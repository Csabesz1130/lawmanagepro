import { CaseStatus, Priority, TaskStatus } from '@prisma/client'
import { Seeder, prisma } from '../index'

/**
 * Interface for task data structure
 */
interface TaskData {
  title: string
  description: string
  status: string
  dueDate: string
}

/**
 * Interface for time entry data structure
 */
interface TimeEntryData {
  description: string
  hours: number
  billable: boolean
  date?: string
}

/**
 * Interface for case data structure
 */
interface CaseData {
  title: string
  description: string
  caseNumber: string
  status: string
  priority: string
  tasks: TaskData[]
  timeEntries: TimeEntryData[]
}

/**
 * Interface for the cases JSON file structure
 */
interface CasesFile {
  cases: CaseData[]
}

/**
 * Case seeder class that handles seeding legal cases and related data
 */
export class CaseSeeder extends Seeder {
  /**
   * Check if prerequisites are met before seeding
   * @returns Promise resolving to true if prerequisites are met
   */
  private async checkPrerequisites(): Promise<boolean> {
    const orgCount = await prisma.organization.count()
    if (orgCount === 0) {
      this.log(
        '⚠️  No organizations found, run OrganizationSeeder first',
        'warning',
      )
      return false
    }
    return true
  }

  /**
   * Main seeding method for cases
   */
  async seed(): Promise<void> {
    if (!(await this.checkPrerequisites())) return

    this.log('📋 Seeding legal cases...', 'info')

    const orgs = await prisma.organization.findMany({
      include: { users: true },
    })

    const data = this.loadData<CasesFile>('cases')
    let caseCount = 0
    let taskCount = 0
    let timeCount = 0

    for (const caseData of data.cases) {
      await this.safeExecute(async () => {
        // Check if case exists
        const existing = await prisma.case.findFirst({
          where: { caseNumber: caseData.caseNumber },
        })

        if (existing) {
          this.log(`  ℹ️  Case ${caseData.caseNumber} exists, skipping`, 'info')
          return
        }

        // Random org and user
        const org = this.random.choice(orgs)
        const user = this.random.choice(org.users)

        // Create case with all related data in transaction
        await prisma.$transaction(async tx => {
          const case_ = await tx.case.create({
            data: {
              title: caseData.title,
              description: caseData.description,
              caseNumber: caseData.caseNumber,
              status: caseData.status as CaseStatus,
              priority: caseData.priority as Priority,
              organizationId: org.id,
            },
          })
          caseCount++
          this.log(`  ✓ Created case: ${case_.caseNumber}`, 'success')

          // Create tasks
          for (const taskData of caseData.tasks) {
            await tx.task.create({
              data: {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status as TaskStatus,
                dueDate: new Date(taskData.dueDate),
                caseId: case_.id,
                assignedToId: user.id,
                createdById: user.id,
              },
            })
            taskCount++
          }
          this.log(`    ✓ Created ${caseData.tasks.length} tasks`, 'success')

          // Create time entries
          for (const entryData of caseData.timeEntries) {
            await tx.timeEntry.create({
              data: {
                description: entryData.description,
                hours: entryData.hours,
                billable: entryData.billable,
                date: entryData.date ? new Date(entryData.date) : new Date(),
                userId: user.id,
                caseId: case_.id,
              },
            })
            timeCount++
          }
          this.log(
            `    ✓ Created ${caseData.timeEntries.length} time entries`,
            'success',
          )
        })
      }, `Failed to seed case: ${caseData.caseNumber}`)
    }

    this.log(
      `✅ Created ${caseCount} cases, ${taskCount} tasks, ${timeCount} time entries`,
      'success',
    )
    this.logExecutionTime('Case seeding')
  }
}

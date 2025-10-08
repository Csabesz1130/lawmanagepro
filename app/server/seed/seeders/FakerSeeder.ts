import { faker } from '@faker-js/faker'
import { CaseStatus, Priority, TaskStatus } from '@prisma/client'
import { Seeder, prisma } from '../base'

/**
 * Faker seeder class that generates random test data using Faker
 */
export class FakerSeeder extends Seeder {
  private caseCount: number

  constructor(caseCount: number = 20) {
    super()
    this.caseCount = caseCount
  }

  /**
   * Main seeding method for random data generation
   */
  async seed(): Promise<void> {
    this.log(`🎲 Generating ${this.caseCount} random cases...`, 'info')

    const org = await prisma.organization.findFirst({
      include: { users: true },
    })

    if (!org || org.users.length === 0) {
      this.log('⚠️  No organization with users found', 'warning')
      return
    }

    let created = 0

    for (let i = 0; i < this.caseCount; i++) {
      const user = this.random.choice(org.users)

      await prisma.case.create({
        data: {
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraphs(2),
          caseNumber: `CASE-${faker.string.numeric(4)}`,
          status: this.random.choice(Object.values(CaseStatus)),
          priority: this.random.choice(Object.values(Priority)),
          organizationId: org.id,

          tasks: {
            create: Array.from({ length: this.random.int(2, 5) }, () => ({
              title: faker.hacker.phrase(),
              description: faker.lorem.paragraph(),
              status: this.random.choice(Object.values(TaskStatus)),
              dueDate: faker.date.future(),
              assignedToId: user.id,
              createdById: user.id,
            })),
          },

          timeEntries: {
            create: Array.from({ length: this.random.int(3, 8) }, () => ({
              description: faker.lorem.sentence(),
              hours: parseFloat(
                faker.number.float({ min: 0.5, max: 8, fractionDigits: 2 }),
              ),
              billable: faker.datatype.boolean(),
              userId: user.id,
              date: faker.date.recent({ days: 30 }),
            })),
          },
        },
      })

      created++

      if ((i + 1) % 5 === 0) {
        this.log(`  ⏳ Progress: ${i + 1}/${this.caseCount}`, 'info')
      }
    }

    this.log(`✅ Created ${created} random cases`, 'success')
    this.logTime('Random data generation')
  }
}

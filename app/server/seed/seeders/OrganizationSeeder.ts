import bcrypt from 'bcryptjs'
import { Seeder, prisma } from '../base'

/**
 * Interface for user data structure
 */
interface UserData {
  email: string
  password: string
  firstName: string
  lastName: string
}

/**
 * Interface for organization data structure
 */
interface OrganizationData {
  name: string
  owner: UserData
  members: UserData[]
}

/**
 * Interface for the organizations JSON file structure
 */
interface OrganizationsFile {
  organizations: OrganizationData[]
}

/**
 * Organization seeder class that handles seeding organizations and their users
 */
export class OrganizationSeeder extends Seeder {
  /**
   * Main seeding method for organizations
   */
  async seed(): Promise<void> {
    this.log('🏢 Seeding organizations...', 'info')

    const data = this.loadData<OrganizationsFile>('organizations')
    let orgCount = 0
    let userCount = 0

    for (const orgData of data.organizations) {
      await this.safeExecute(async () => {
        // Check if organization already exists
        const existing = await prisma.organization.findFirst({
          where: { name: orgData.name },
        })

        if (existing) {
          this.log(
            `  ℹ️  Organization "${orgData.name}" exists, skipping`,
            'info',
          )
          return
        }

        // Hash owner password
        const ownerHash = await bcrypt.hash(orgData.owner.password, 10)

        // Create owner
        const owner = await prisma.user.create({
          data: {
            email: orgData.owner.email,
            password: ownerHash,
            firstName: orgData.owner.firstName,
            lastName: orgData.owner.lastName,
          },
        })
        userCount++
        this.log(`  ✓ Created owner: ${owner.email}`, 'success')

        // Create organization
        const org = await prisma.organization.create({
          data: {
            name: orgData.name,
            ownerId: owner.id,
          },
        })
        orgCount++
        this.log(`  ✓ Created organization: ${org.name}`, 'success')

        // Create members
        for (const memberData of orgData.members) {
          const memberHash = await bcrypt.hash(memberData.password, 10)
          const member = await prisma.user.create({
            data: {
              email: memberData.email,
              password: memberHash,
              firstName: memberData.firstName,
              lastName: memberData.lastName,
              organizationId: org.id,
            },
          })
          userCount++
          this.log(`  ✓ Created member: ${member.email}`, 'success')
        }
      }, `Failed to seed organization: ${orgData.name}`)
    }

    this.log(
      `✅ Created ${orgCount} organizations, ${userCount} users`,
      'success',
    )
    this.logTime('Organization seeding')
  }
}

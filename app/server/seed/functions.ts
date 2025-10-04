import bcrypt from 'bcryptjs'
import { Seeder, prisma } from './index'

/**
 * Interface for user data structure
 */
export interface UserData {
  email: string
  password: string
  firstName: string
  lastName: string
}

/**
 * Interface for organization data structure
 */
export interface OrganizationData {
  name: string
  owner: UserData
  members: UserData[]
}

/**
 * Interface for the organizations JSON file structure
 */
interface OrganizationsData {
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
    this.log('Starting organization seeding...', 'info')

    await this.safeExecute(async () => {
      // Load organization data from JSON file
      const data = this.loadData<OrganizationsData>('organizations')

      if (!data.organizations || data.organizations.length === 0) {
        this.log('No organizations found in data file', 'warning')
        return
      }

      this.log(
        `Found ${data.organizations.length} organization(s) to seed`,
        'info',
      )

      let totalOrganizations = 0
      let totalUsers = 0
      let skippedOrganizations = 0

      // Process each organization
      for (const orgData of data.organizations) {
        await this.safeExecute(async () => {
          // Check if organization already exists
          const existingOrg = await prisma.organization.findFirst({
            where: { name: orgData.name },
          })

          if (existingOrg) {
            this.log(
              `Organization '${orgData.name}' already exists, skipping...`,
              'warning',
            )
            skippedOrganizations++
            return
          }

          this.log(`Processing organization: ${orgData.name}`, 'info')

          // Hash owner password
          const hashedOwnerPassword = await bcrypt.hash(
            orgData.owner.password,
            12,
          )

          // Create owner user
          const owner = await prisma.user.create({
            data: {
              email: orgData.owner.email,
              password: hashedOwnerPassword,
              firstName: orgData.owner.firstName,
              lastName: orgData.owner.lastName,
            },
          })

          this.log(`Created owner user: ${owner.email}`, 'success')

          // Create organization and connect owner
          const organization = await prisma.organization.create({
            data: {
              name: orgData.name,
              ownerId: owner.id,
            },
          })

          this.log(`Created organization: ${organization.name}`, 'success')

          // Create member users
          let memberCount = 0
          for (const memberData of orgData.members) {
            await this.safeExecute(async () => {
              // Check if member already exists
              const existingMember = await prisma.user.findUnique({
                where: { email: memberData.email },
              })

              if (existingMember) {
                this.log(
                  `Member '${memberData.email}' already exists, skipping...`,
                  'warning',
                )
                return
              }

              // Hash member password
              const hashedMemberPassword = await bcrypt.hash(
                memberData.password,
                12,
              )

              // Create member user
              const member = await prisma.user.create({
                data: {
                  email: memberData.email,
                  password: hashedMemberPassword,
                  firstName: memberData.firstName,
                  lastName: memberData.lastName,
                },
              })

              // Connect member to organization
              await prisma.organizationMember.create({
                data: {
                  organizationId: organization.id,
                  userId: member.id,
                  role: 'MEMBER', // Default role for members
                },
              })

              this.log(`Created member user: ${member.email}`, 'success')
              memberCount++
            }, `Failed to create member user: ${memberData.email}`)
          }

          this.log(
            `Organization '${orgData.name}' completed with ${memberCount} members`,
            'success',
          )
          totalOrganizations++
          totalUsers += memberCount + 1 // +1 for owner
        }, `Failed to process organization: ${orgData.name}`)
      }

      // Log final summary
      this.log('Organization seeding completed!', 'success')
      this.log(`Total organizations created: ${totalOrganizations}`, 'info')
      this.log(`Total users created: ${totalUsers}`, 'info')
      this.log(`Skipped organizations: ${skippedOrganizations}`, 'info')

      this.logExecutionTime('Organization seeding')
    }, 'Organization seeding failed')
  }
}

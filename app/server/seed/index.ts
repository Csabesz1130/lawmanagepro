import { prisma } from './base'
import { CaseSeeder } from './seeders/CaseSeeder'
import { FakerSeeder } from './seeders/FakerSeeder'
import { OrganizationSeeder } from './seeders/OrganizationSeeder'

/**
 * Seed orchestrator that manages all seeders
 */
export class SeedOrchestrator {
  /**
   * Flush the database by deleting all records
   */
  static async flush(): Promise<void> {
    console.log('\n⚠️  Flushing database...\n')

    // Delete in correct order (respect foreign keys)
    await prisma.notification.deleteMany()
    await prisma.webhookSubscription.deleteMany()
    await prisma.webhook.deleteMany()
    await prisma.timeEntry.deleteMany()
    await prisma.document.deleteMany()
    await prisma.task.deleteMany()
    await prisma.case.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()

    console.log('✅ Database flushed\n')
  }

  /**
   * Seed all data with options
   */
  static async seedAll(
    options: {
      flush?: boolean
      random?: boolean
      randomCount?: number
    } = {},
  ): Promise<void> {
    const start = Date.now()
    console.log('\n🌱 Starting database seeding...\n')

    try {
      if (options.flush) {
        await this.flush()
      }

      // Seed in order
      await new OrganizationSeeder().seed()
      await new CaseSeeder().seed()

      if (options.random) {
        await new FakerSeeder(options.randomCount || 20).seed()
      }

      const duration = ((Date.now() - start) / 1000).toFixed(2)
      console.log(`\n🎉 Seeding completed in ${duration}s!\n`)
    } catch (error) {
      console.error('\n❌ Seeding failed:', error)
      throw error
    } finally {
      await prisma.$disconnect()
    }
  }

  /**
   * Seed a specific component
   */
  static async seedComponent(name: string): Promise<void> {
    console.log(`\n🌱 Seeding ${name}...\n`)

    try {
      switch (name) {
        case 'organizations':
          await new OrganizationSeeder().seed()
          break
        case 'cases':
          await new CaseSeeder().seed()
          break
        case 'random':
          await new FakerSeeder().seed()
          break
        default:
          throw new Error(`Unknown component: ${name}`)
      }
    } finally {
      await prisma.$disconnect()
    }
  }
}

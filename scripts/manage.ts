#!/usr/bin/env node

import bcrypt from 'bcryptjs'
import { Command } from 'commander'
import { prisma } from '../app/server/seed/index'
import { SeedOrchestrator } from '../app/server/seed/run'

const program = new Command()

program
  .name('lawmanage')
  .description('LawManagePro Management CLI')
  .version('1.0.0')

// Seed command group
const seedCmd = program.command('seed').description('Database seeding commands')

seedCmd
  .command('all')
  .description('Seed all data')
  .option('--flush', 'Clear database first')
  .option('--random', 'Include random test data')
  .option('--count <number>', 'Number of random records', '20')
  .action(async options => {
    try {
      await SeedOrchestrator.seedAll({
        flush: options.flush,
        random: options.random,
        randomCount: parseInt(options.count),
      })
    } catch (error) {
      console.error('Seeding failed:', error)
      process.exit(1)
    }
  })

seedCmd
  .command('organizations')
  .description('Seed organizations only')
  .action(async () => {
    try {
      await SeedOrchestrator.seedComponent('organizations')
    } catch (error) {
      console.error('Failed:', error)
      process.exit(1)
    }
  })

seedCmd
  .command('cases')
  .description('Seed cases only')
  .action(async () => {
    try {
      await SeedOrchestrator.seedComponent('cases')
    } catch (error) {
      console.error('Failed:', error)
      process.exit(1)
    }
  })

seedCmd
  .command('random')
  .description('Generate random test data')
  .option('-c, --count <number>', 'Number of cases', '20')
  .action(async options => {
    try {
      await SeedOrchestrator.seedComponent('random')
    } catch (error) {
      console.error('Failed:', error)
      process.exit(1)
    }
  })

// Database command group
const dbCmd = program.command('db').description('Database management')

dbCmd
  .command('check')
  .description('Check database connection and show counts')
  .action(async () => {
    console.log('\n🗄️  Checking Database...\n')
    console.log('='.repeat(60))

    try {
      // Test connection
      await prisma.$queryRaw`SELECT 1`
      console.log('✓ Database connection successful\n')

      // Show counts
      const tables = [
        { name: 'Users', model: prisma.user },
        { name: 'Organizations', model: prisma.organization },
        { name: 'Cases', model: prisma.case },
        { name: 'Tasks', model: prisma.task },
        { name: 'Time Entries', model: prisma.timeEntry },
      ]

      console.log('Table Counts:')
      for (const { name, model } of tables) {
        try {
          const count = await model.count()
          console.log(`  ${name}: ${count}`)
        } catch (e) {
          console.log(`  ${name}: ✗ Error`)
        }
      }

      console.log()
    } catch (error) {
      console.error('✗ Database connection failed:', error)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  })

dbCmd
  .command('migrate')
  .description('Run database migrations')
  .option('--reset', 'Reset database')
  .action(async options => {
    const { execSync } = await import('child_process')

    console.log('\n🔄 Running migrations...\n')

    try {
      if (options.reset) {
        console.log('⚠️  Resetting database...')
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' })
      } else {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      }
      console.log('\n✅ Migrations completed\n')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }
  })

dbCmd
  .command('studio')
  .description('Open Prisma Studio')
  .action(async () => {
    const { execSync } = await import('child_process')
    console.log('\n🎨 Opening Prisma Studio...\n')
    execSync('npx prisma studio', { stdio: 'inherit' })
  })

// User management command
program
  .command('createuser')
  .description('Create a new user')
  .requiredOption('-e, --email <email>', 'User email')
  .requiredOption('-p, --password <password>', 'User password')
  .requiredOption('-f, --first-name <name>', 'First name')
  .requiredOption('-l, --last-name <name>', 'Last name')
  .option('-o, --org-id <id>', 'Organization ID')
  .action(async options => {
    console.log('\n👤 Creating user...\n')

    try {
      const hashedPassword = await bcrypt.hash(options.password, 10)

      const user = await prisma.user.create({
        data: {
          email: options.email,
          password: hashedPassword,
          firstName: options.firstName,
          lastName: options.lastName,
          organizationId: options.orgId,
        },
      })

      console.log('✅ User created successfully')
      console.log(`  ID: ${user.id}`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Name: ${user.firstName} ${user.lastName}\n`)
    } catch (error) {
      console.error('❌ Failed to create user:', error)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  })

// Version command
program
  .command('version')
  .description('Show version information')
  .action(() => {
    const pkg = require('../package.json')
    console.log(`\n📦 LawManagePro v${pkg.version}`)
    console.log(`Node: ${process.version}`)
    console.log(`Platform: ${process.platform}\n`)
  })

// Info command
program
  .command('info')
  .description('Show application info')
  .action(async () => {
    console.log('\n📊 LawManagePro Information\n')
    console.log('='.repeat(60))

    try {
      const orgCount = await prisma.organization.count()
      const userCount = await prisma.user.count()
      const caseCount = await prisma.case.count()
      const taskCount = await prisma.task.count()

      console.log('Database Statistics:')
      console.log(`  Organizations: ${orgCount}`)
      console.log(`  Users: ${userCount}`)
      console.log(`  Cases: ${caseCount}`)
      console.log(`  Tasks: ${taskCount}`)
      console.log()
    } catch (error) {
      console.error('Error fetching info:', error)
    } finally {
      await prisma.$disconnect()
    }
  })

// Parse arguments
program.parse()

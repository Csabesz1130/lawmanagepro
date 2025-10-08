import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Prisma client instance for database operations
 */
export const prisma = new PrismaClient()

/**
 * Base abstract class for all seeders
 * Provides common functionality for data seeding operations
 */
export abstract class Seeder {
  /** Directory containing seed data JSON files */
  protected readonly dataDir: string = './data'

  /** Start time for tracking execution duration */
  protected startTime: number = Date.now()

  /**
   * Random utility object with helper methods for generating random data
   */
  protected random = {
    /**
     * Generate a random integer between min (inclusive) and max (inclusive)
     * @param min Minimum value
     * @param max Maximum value
     * @returns Random integer
     */
    int: (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    /**
     * Select a random element from an array
     * @param array Array to choose from
     * @returns Random element from array
     */
    choice: <T>(array: T[]): T => {
      return array[Math.floor(Math.random() * array.length)]
    },

    /**
     * Generate a random boolean value
     * @returns Random boolean
     */
    boolean: (): boolean => {
      return Math.random() < 0.5
    },

    /**
     * Generate a random date between start and end dates
     * @param start Start date
     * @param end End date
     * @returns Random date between start and end
     */
    date: (start: Date, end: Date): Date => {
      const startTime = start.getTime()
      const endTime = end.getTime()
      const randomTime = startTime + Math.random() * (endTime - startTime)
      return new Date(randomTime)
    },
  }

  /**
   * Load JSON data from a file in the data directory
   * @param filename Name of the JSON file (without extension)
   * @returns Parsed JSON data
   */
  protected loadData<T>(filename: string): T {
    try {
      const filePath = join(this.dataDir, `${filename}.json`)
      const fileContent = readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent) as T
    } catch (error) {
      this.log(`Failed to load data from ${filename}.json: ${error}`, 'error')
      throw error
    }
  }

  /**
   * Log a message with colored output to console
   * @param message Message to log
   * @param type Type of log message
   */
  protected log(
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
  ): void {
    const colors = {
      info: '\x1b[36m', // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
    }

    const reset = '\x1b[0m'
    const timestamp = new Date().toLocaleTimeString()
    const prefix = `[${timestamp}] [${this.constructor.name}]`

    console.log(`${colors[type]}${prefix} ${message}${reset}`)
  }

  /**
   * Log the execution time for a specific operation
   * @param label Label for the operation
   */
  protected logTime(label: string): void {
    const executionTime = Date.now() - this.startTime
    const seconds = (executionTime / 1000).toFixed(2)
    this.log(`${label} completed in ${seconds}s`, 'success')
  }

  /**
   * Safely execute a function with error handling
   * @param fn Function to execute
   * @param errorMsg Error message to display if execution fails
   */
  protected async safeExecute(
    fn: () => Promise<void>,
    errorMsg: string,
  ): Promise<void> {
    try {
      await fn()
    } catch (error) {
      this.log(`${errorMsg}: ${error}`, 'error')
      throw error
    }
  }

  /**
   * Abstract method that must be implemented by subclasses
   * Contains the main seeding logic
   */
  abstract seed(): Promise<void>
}

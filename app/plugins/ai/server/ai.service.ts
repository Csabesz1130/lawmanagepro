import { ReadStream } from 'fs'
import { OpenAI } from 'openai'
import { ZodType } from 'zod'
import { prisma } from '~/server/prisma'
import {
    OpenaiGenerateTextOptions,
    OpenaiProvider,
} from './providers/openai/openai.provider'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Activity {
  type: string
  timestamp: string
  content: string
  matterId?: string
  duration: number
}

class Service {
  private openai = new OpenaiProvider()

  async generateText(options: OpenaiGenerateTextOptions): Promise<string> {
    return this.openai.generateText(options)
  }

  async generateJson<SchemaType extends ZodType>(
    instruction: string,
    content: string,
    schema: SchemaType,
    attachmentUrls?: string[],
  ) {
    return this.openai.generateJson<SchemaType>(
      instruction,
      content,
      schema,
      attachmentUrls,
    )
  }

  async generateImage(prompt: string): Promise<string> {
    return this.openai.generateImage(prompt)
  }

  async fromAudioToText(readStream: ReadStream): Promise<string> {
    return this.openai.fromAudioToText(readStream)
  }

  async fromTextToAudio(text: string): Promise<Buffer> {
    return this.openai.fromTextToAudio(text)
  }

  isActive(): boolean {
    return this.openai.isActive()
  }

  async getTimeSuggestions(organizationId: string) {
    // Összegyűjtjük az utolsó 24 óra tevékenységeit
    const activities = await prisma.activity.findMany({
      where: {
        organizationId,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    })

    // Csoportosítjuk a tevékenységeket ügy szerint
    const activitiesByMatter = activities.reduce((acc, activity) => {
      const matterId = activity.matterId || 'unknown'
      if (!acc[matterId]) {
        acc[matterId] = []
      }
      acc[matterId].push(activity)
      return acc
    }, {} as Record<string, Activity[]>)

    // Generáljuk a javaslatokat minden ügyhöz
    const suggestions = await Promise.all(
      Object.entries(activitiesByMatter).map(async ([matterId, matterActivities]) => {
        const prompt = this.generatePrompt(matterActivities)
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Te egy jogi időkövető rendszer AI asszisztense vagy. Analizáld a felhasználó tevékenységeit és generálj időbejegyzési javaslatokat.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        })

        const suggestion = JSON.parse(response.choices[0].message.content || '{}')
        return {
          ...suggestion,
          matterId,
          activities: matterActivities.map(a => a.type),
        }
      })
    )

    return suggestions
  }

  private generatePrompt(activities: Activity[]): string {
    return `
      Analizáld a következő tevékenységeket és generálj egy időbejegyzési javaslatot:
      ${activities.map(a => `
        - Típus: ${a.type}
        - Időpont: ${a.timestamp}
        - Tartalom: ${a.content}
        - Időtartam: ${a.duration} perc
      `).join('\n')}

      Válasz formátuma:
      {
        "matterName": "ügy neve",
        "startTime": "kezdési idő (ISO string)",
        "endTime": "befejezési idő (ISO string)",
        "duration": "összes időtartam (percben)",
        "description": "részletes leírás a tevékenységről",
        "confidence": "biztonsági szint (0-1)"
      }
    `
  }

  async saveTimeEntry(data: {
    organizationId: string
    matterId: string
    startTime: string
    endTime: string
    description: string
    activities: string[]
  }) {
    return prisma.timeEntry.create({
      data: {
        organizationId: data.organizationId,
        matterId: data.matterId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        description: data.description,
        activities: data.activities,
        isAIGenerated: true,
      },
    })
  }
}

export const AiService = new Service()

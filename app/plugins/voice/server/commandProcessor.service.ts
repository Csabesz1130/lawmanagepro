import { prisma } from '~/server/prisma';

interface CommandContext {
  userId: string;
  organizationId: string;
  matterId?: string;
}

interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export class CommandProcessorService {
  private readonly commandPatterns = {
    startTimer: /^(?:indíts|kezd) (?:időzítő|időzítést) (?:az|a) (.+) ügy(?:hez)?$/i,
    stopTimer: /^(?:állítsd|állíts) le (?:az|a) időzítőt$/i,
    createTask: /^(?:hozz|készíts) létre (?:egy|új) feladatot (.+) ügy(?:hez)?$/i,
    searchMatter: /^(?:keress|keresés) (?:az|a) (.+) ügy(?:ben)?$/i,
    addNote: /^(?:jegyzet|jegyzetelj) (.+) (?:az|a) (.+) ügy(?:hez)?$/i,
  };

  async processCommand(command: string, context: CommandContext): Promise<CommandResult> {
    try {
      // Időzítő indítása
      if (this.commandPatterns.startTimer.test(command)) {
        const match = command.match(this.commandPatterns.startTimer);
        if (match) {
          const matterName = match[1];
          const matter = await this.findMatterByName(matterName, context.organizationId);
          
          if (!matter) {
            return {
              success: false,
              message: `Nem találtam ügyet a következő névvel: ${matterName}`,
            };
          }

          const timer = await prisma.timeEntry.create({
            data: {
              matterId: matter.id,
              userId: context.userId,
              startTime: new Date(),
              description: 'Időzítő indítva hangparanccsal',
            },
          });

          return {
            success: true,
            message: `Időzítő elindítva az ügyhez: ${matter.name}`,
            data: timer,
          };
        }
      }

      // Időzítő leállítása
      if (this.commandPatterns.stopTimer.test(command)) {
        const activeTimer = await prisma.timeEntry.findFirst({
          where: {
            userId: context.userId,
            endTime: null,
          },
          include: {
            matter: true,
          },
        });

        if (!activeTimer) {
          return {
            success: false,
            message: 'Nincs aktív időzítő',
          };
        }

        await prisma.timeEntry.update({
          where: { id: activeTimer.id },
          data: {
            endTime: new Date(),
          },
        });

        return {
          success: true,
          message: `Időzítő leállítva az ügyhez: ${activeTimer.matter.name}`,
        };
      }

      // Feladat létrehozása
      if (this.commandPatterns.createTask.test(command)) {
        const match = command.match(this.commandPatterns.createTask);
        if (match) {
          const matterName = match[1];
          const matter = await this.findMatterByName(matterName, context.organizationId);
          
          if (!matter) {
            return {
              success: false,
              message: `Nem találtam ügyet a következő névvel: ${matterName}`,
            };
          }

          const task = await prisma.task.create({
            data: {
              matterId: matter.id,
              assignedToId: context.userId,
              title: 'Új feladat hangparanccsal létrehozva',
              description: 'Feladat létrehozva hangparanccsal',
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 óra múlva
            },
          });

          return {
            success: true,
            message: `Feladat létrehozva az ügyhez: ${matter.name}`,
            data: task,
          };
        }
      }

      // Ügy keresése
      if (this.commandPatterns.searchMatter.test(command)) {
        const match = command.match(this.commandPatterns.searchMatter);
        if (match) {
          const searchTerm = match[1];
          const matters = await prisma.matter.findMany({
            where: {
              organizationId: context.organizationId,
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            take: 5,
          });

          return {
            success: true,
            message: `${matters.length} találat a keresésre: ${searchTerm}`,
            data: matters,
          };
        }
      }

      // Jegyzet hozzáadása
      if (this.commandPatterns.addNote.test(command)) {
        const match = command.match(this.commandPatterns.addNote);
        if (match) {
          const [_, noteContent, matterName] = match;
          const matter = await this.findMatterByName(matterName, context.organizationId);
          
          if (!matter) {
            return {
              success: false,
              message: `Nem találtam ügyet a következő névvel: ${matterName}`,
            };
          }

          const note = await prisma.note.create({
            data: {
              matterId: matter.id,
              userId: context.userId,
              content: noteContent,
              type: 'VOICE_NOTE',
            },
          });

          return {
            success: true,
            message: `Jegyzet hozzáadva az ügyhez: ${matter.name}`,
            data: note,
          };
        }
      }

      return {
        success: false,
        message: 'Nem értettem a parancsot. Kérlek, próbáld újra.',
      };
    } catch (error) {
      console.error('Parancs feldolgozási hiba:', error);
      return {
        success: false,
        message: 'Hiba történt a parancs feldolgozása során',
      };
    }
  }

  private async findMatterByName(name: string, organizationId: string) {
    return prisma.matter.findFirst({
      where: {
        organizationId,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }
} 
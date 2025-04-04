import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { createTRPCRouter, protectedProcedure } from '~/server/trpc';

export const activityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        data: z.object({
          organizationId: z.string(),
          type: z.string(),
          content: z.string(),
          matterId: z.string().optional(),
          duration: z.number(),
          timestamp: z.date(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.activity.create({
        data: input.data,
      });
    }),

  findMany: protectedProcedure
    .input(
      z.object({
        where: z.object({
          organizationId: z.string(),
          timestamp: z.object({
            gte: z.date().optional(),
            lte: z.date().optional(),
          }).optional(),
        }),
        orderBy: z.object({
          timestamp: z.enum(['asc', 'desc']),
        }).optional(),
      })
    )
    .query(async ({ input }) => {
      return prisma.activity.findMany({
        where: input.where,
        orderBy: input.orderBy,
      });
    }),
}); 
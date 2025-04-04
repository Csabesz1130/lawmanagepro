import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { createTRPCRouter, protectedProcedure } from '~/server/trpc';
import { RecommendationService } from './recommendation.service';
import { KnowledgeSearchService } from './search.service';

const searchService = new KnowledgeSearchService();
const recommendationService = new RecommendationService();

export const knowledgeRouter = createTRPCRouter({
  // Knowledge Articles
  knowledgeArticles: createTRPCRouter({
    list: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          practiceAreaId: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return prisma.knowledgeArticle.findMany({
          where: {
            organizationId: input.organizationId,
            practiceAreaId: input.practiceAreaId,
          },
          include: {
            practiceArea: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return prisma.knowledgeArticle.findUnique({
          where: { id: input.id },
          include: {
            practiceArea: true,
            comments: {
              include: {
                createdBy: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
      }),

    create: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          title: z.string(),
          content: z.string(),
          practiceAreaId: z.string(),
          tags: z.array(z.string()),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const article = await prisma.knowledgeArticle.create({
          data: {
            ...input,
            createdById: ctx.session.user.id,
          },
        });

        await searchService.indexDocument({
          id: `article-${article.id}`,
          contentId: article.id,
          contentType: 'article',
          title: article.title,
          content: article.content,
          metadata: {
            practiceAreaId: article.practiceAreaId,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
          },
        });

        return article;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          practiceAreaId: z.string(),
          tags: z.array(z.string()),
        })
      )
      .mutation(async ({ input }) => {
        const article = await prisma.knowledgeArticle.update({
          where: { id: input.id },
          data: input,
        });

        await searchService.indexDocument({
          id: `article-${article.id}`,
          contentId: article.id,
          contentType: 'article',
          title: article.title,
          content: article.content,
          metadata: {
            practiceAreaId: article.practiceAreaId,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
          },
        });

        return article;
      }),
  }),

  // Precedents
  precedents: createTRPCRouter({
    list: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          filters: z.object({
            practiceArea: z.string().optional(),
            documentType: z.string().optional(),
          }),
          sortBy: z.enum(['date', 'usage', 'success']),
        })
      )
      .query(async ({ input }) => {
        const orderBy: any = {
          date: { createdAt: 'desc' },
          usage: { usageCount: 'desc' },
          success: { successRate: 'desc' },
        }[input.sortBy];

        return prisma.precedentDocument.findMany({
          where: {
            organizationId: input.organizationId,
            practiceAreaId: input.filters.practiceArea,
            documentType: input.filters.documentType,
          },
          include: {
            practiceArea: true,
          },
          orderBy,
        });
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return prisma.precedentDocument.findUnique({
          where: { id: input.id },
          include: {
            practiceArea: true,
            citations: true,
            relatedPrecedents: {
              include: {
                targetPrecedent: {
                  include: {
                    practiceArea: true,
                  },
                },
              },
            },
          },
        });
      }),
  }),

  // Templates
  templates: createTRPCRouter({
    list: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          filters: z.object({
            practiceArea: z.string().optional(),
            documentType: z.string().optional(),
            status: z.enum(['draft', 'review', 'approved']).optional(),
          }),
        })
      )
      .query(async ({ input }) => {
        return prisma.documentTemplate.findMany({
          where: {
            organizationId: input.organizationId,
            practiceAreaId: input.filters.practiceArea,
            documentType: input.filters.documentType,
            status: input.filters.status,
          },
          include: {
            practiceArea: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return prisma.documentTemplate.findUnique({
          where: { id: input.id },
          include: {
            practiceArea: true,
            versions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        });
      }),

    create: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
          title: z.string(),
          content: z.string(),
          guidance: z.string(),
          practiceAreaId: z.string(),
          documentType: z.string(),
          status: z.enum(['draft', 'review', 'approved']),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const template = await prisma.documentTemplate.create({
          data: {
            ...input,
            createdById: ctx.session.user.id,
          },
        });

        await searchService.indexDocument({
          id: `template-${template.id}`,
          contentId: template.id,
          contentType: 'template',
          title: template.title,
          content: template.content,
          metadata: {
            practiceAreaId: template.practiceAreaId,
            documentType: template.documentType,
            status: template.status,
            createdAt: template.createdAt.toISOString(),
          },
        });

        return template;
      }),
  }),

  // Search
  search: createTRPCRouter({
    query: protectedProcedure
      .input(
        z.object({
          query: z.string(),
          filters: z.record(z.string()).optional(),
        })
      )
      .query(async ({ input }) => {
        return searchService.search(input.query, input.filters);
      }),
  }),

  // Recommendations
  recommendations: createTRPCRouter({
    get: protectedProcedure
      .input(
        z.object({
          matterId: z.string().optional(),
          practiceAreaId: z.string().optional(),
          documentType: z.string().optional(),
          content: z.string().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        return recommendationService.getRecommendations(
          ctx.session.user.id,
          input
        );
      }),

    feedback: protectedProcedure
      .input(
        z.object({
          recommendationId: z.string(),
          accepted: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        return recommendationService.updateRecommendationFeedback(
          input.recommendationId,
          input.accepted
        );
      }),
  }),
}); 
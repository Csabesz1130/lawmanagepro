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
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const article = await prisma.knowledgeArticle.create({
          data: {
            organizationId: input.organizationId,
            title: input.title,
            content: input.content,
            practiceAreaId: input.practiceAreaId,
            tags: input.tags,
          },
        });

        await searchService.indexDocument({
          id: article.id,
          contentId: article.id,
          contentType: 'article',
          title: article.title,
          content: article.content,
          metadata: {
            practiceArea: article.practiceAreaId,
            organizationId: article.organizationId,
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
          title: z.string().optional(),
          content: z.string().optional(),
          practiceAreaId: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const article = await prisma.knowledgeArticle.update({
          where: { id: input.id },
          data: {
            title: input.title,
            content: input.content,
            practiceAreaId: input.practiceAreaId,
            tags: input.tags,
          },
        });

        await searchService.indexDocument({
          id: article.id,
          contentId: article.id,
          contentType: 'article',
          title: article.title,
          content: article.content,
          metadata: {
            practiceArea: article.practiceAreaId,
            organizationId: article.organizationId,
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
          practiceAreaId: z.string().optional(),
          documentType: z.string().optional(),
          sortBy: z.enum(['relevance', 'date', 'usage']).optional(),
        })
      )
      .query(async ({ input }) => {
        return prisma.precedentDocument.findMany({
          where: {
            organizationId: input.organizationId,
            practiceAreaId: input.practiceAreaId,
            documentType: input.documentType,
          },
          include: {
            practiceArea: true,
            citations: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
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
                precedent: true,
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
          practiceAreaId: z.string().optional(),
          documentType: z.string().optional(),
          status: z.enum(['draft', 'published', 'archived']).optional(),
        })
      )
      .query(async ({ input }) => {
        return prisma.documentTemplate.findMany({
          where: {
            organizationId: input.organizationId,
            practiceAreaId: input.practiceAreaId,
            documentType: input.documentType,
            status: input.status,
          },
          include: {
            practiceArea: true,
            versions: {
              orderBy: {
                createdAt: 'desc',
              },
            },
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
          guidance: z.string().optional(),
          practiceAreaId: z.string(),
          documentType: z.string(),
          status: z.enum(['draft', 'published', 'archived']),
        })
      )
      .mutation(async ({ input }) => {
        const template = await prisma.documentTemplate.create({
          data: {
            organizationId: input.organizationId,
            title: input.title,
            content: input.content,
            guidance: input.guidance,
            practiceAreaId: input.practiceAreaId,
            documentType: input.documentType,
            status: input.status,
          },
        });

        await searchService.indexDocument({
          id: template.id,
          contentId: template.id,
          contentType: 'template',
          title: template.title,
          content: template.content,
          metadata: {
            practiceArea: template.practiceAreaId,
            documentType: template.documentType,
            organizationId: template.organizationId,
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
          filters: z
            .object({
              contentType: z.string().optional(),
              practiceArea: z.string().optional(),
              documentType: z.string().optional(),
            })
            .optional(),
          sort: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return searchService.search(input.query, input.filters, input.sort);
      }),
  }),

  // Practice Areas
  practiceAreas: createTRPCRouter({
    list: protectedProcedure
      .input(
        z.object({
          organizationId: z.string(),
        })
      )
      .query(async ({ input }) => {
        return prisma.practiceArea.findMany({
          where: {
            organizationId: input.organizationId,
          },
          orderBy: {
            name: 'asc',
          },
        });
      }),
  }),

  // Recommendations
  recommendations: createTRPCRouter({
    get: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          organizationId: z.string(),
          limit: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return recommendationService.getRecommendations(
          input.userId,
          input.organizationId,
          input.limit
        );
      }),

    feedback: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          itemId: z.string(),
          feedback: z.enum(['positive', 'negative']),
        })
      )
      .mutation(async ({ input }) => {
        return recommendationService.updateFeedback(
          input.userId,
          input.itemId,
          input.feedback
        );
      }),
  }),
}); 
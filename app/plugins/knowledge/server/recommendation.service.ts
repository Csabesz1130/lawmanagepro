import { prisma } from '~/server/prisma';
import { KnowledgeSearchService } from './search.service';

interface Context {
  matterId?: string;
  practiceAreaId?: string;
  documentType?: string;
  content?: string;
}

export class RecommendationService {
  private searchService: KnowledgeSearchService;

  constructor() {
    this.searchService = new KnowledgeSearchService();
  }

  async getRecommendations(userId: string, context: Context) {
    // Get user's practice areas and recent interactions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        matters: true,
        recommendations: {
          take: 100,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Build search filters based on context
    const filters: Record<string, any> = {};
    
    if (context.practiceAreaId) {
      filters['metadata.practiceArea'] = context.practiceAreaId;
    }
    
    if (context.documentType) {
      filters['metadata.documentType'] = context.documentType;
    }

    // Get relevant documents based on content similarity
    let relevantDocs = [];
    if (context.content) {
      const searchResults = await this.searchService.search(
        context.content,
        filters,
        'metadata.usageCount:desc'
      );
      relevantDocs = searchResults.hits;
    }

    // Get popular documents in the same practice area
    const popularDocs = await this.searchService.search(
      '',
      filters,
      'metadata.usageCount:desc'
    );

    // Get successful documents (high success rate)
    const successfulDocs = await this.searchService.search(
      '',
      filters,
      'metadata.successRate:desc'
    );

    // Combine and rank recommendations
    const recommendations = this.rankRecommendations(
      relevantDocs,
      popularDocs.hits,
      successfulDocs.hits,
      user.recommendations
    );

    // Store recommendations
    await this.storeRecommendations(userId, context, recommendations);

    return recommendations;
  }

  private rankRecommendations(
    relevantDocs: any[],
    popularDocs: any[],
    successfulDocs: any[],
    userHistory: any[]
  ) {
    // Combine all documents
    const allDocs = new Map();

    // Add relevant docs with high weight
    relevantDocs.forEach((doc) => {
      allDocs.set(doc.id, {
        ...doc,
        score: (doc._score || 0) * 2,
      });
    });

    // Add popular docs
    popularDocs.forEach((doc) => {
      if (allDocs.has(doc.id)) {
        const existing = allDocs.get(doc.id);
        existing.score += doc.metadata.usageCount * 0.5;
      } else {
        allDocs.set(doc.id, {
          ...doc,
          score: doc.metadata.usageCount * 0.5,
        });
      }
    });

    // Add successful docs
    successfulDocs.forEach((doc) => {
      if (allDocs.has(doc.id)) {
        const existing = allDocs.get(doc.id);
        existing.score += (doc.metadata.successRate || 0) * 0.8;
      } else {
        allDocs.set(doc.id, {
          ...doc,
          score: (doc.metadata.successRate || 0) * 0.8,
        });
      }
    });

    // Adjust scores based on user history
    const acceptedDocs = new Set(
      userHistory
        .filter((rec) => rec.accepted)
        .map((rec) => rec.contentId)
    );

    const rejectedDocs = new Set(
      userHistory
        .filter((rec) => rec.accepted === false)
        .map((rec) => rec.contentId)
    );

    allDocs.forEach((doc) => {
      if (acceptedDocs.has(doc.contentId)) {
        doc.score *= 1.2; // Boost accepted docs
      }
      if (rejectedDocs.has(doc.contentId)) {
        doc.score *= 0.5; // Penalize rejected docs
      }
    });

    // Sort by final score
    return Array.from(allDocs.values()).sort((a, b) => b.score - a.score);
  }

  private async storeRecommendations(
    userId: string,
    context: Context,
    recommendations: any[]
  ) {
    const contextId = context.matterId || 'general';

    // Store top recommendations
    await Promise.all(
      recommendations.slice(0, 10).map((rec) =>
        prisma.recommendation.create({
          data: {
            userId,
            contextId,
            contentId: rec.contentId,
            contentType: rec.contentType,
          },
        })
      )
    );
  }

  async updateRecommendationFeedback(
    recommendationId: string,
    accepted: boolean
  ) {
    await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { accepted },
    });
  }
} 
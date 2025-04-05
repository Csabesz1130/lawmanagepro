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

  async getRecommendations(userId: string, organizationId: string, limit?: number) {
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

    // Get user's recent matters
    const recentMatters = await prisma.matter.findMany({
      where: {
        organizationId,
        assignedToId: userId,
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        practiceArea: true,
      },
    });

    // Build search filters based on user's context
    const filters: Record<string, any> = {
      'metadata.organizationId': organizationId,
    };

    // Get relevant documents based on user's practice areas
    let relevantDocs = [];
    if (recentMatters.length > 0) {
      const practiceAreaIds = recentMatters
        .map((matter) => matter.practiceAreaId)
        .filter(Boolean);
      
      if (practiceAreaIds.length > 0) {
        const searchResults = await this.searchService.search(
          '',
          {
            practiceArea: practiceAreaIds[0],
          },
          'relevance'
        );
        relevantDocs = searchResults;
      }
    }

    // Get popular documents
    const popularDocs = await this.searchService.search(
      '',
      {
        organizationId,
      },
      'usage'
    );

    // Get successful documents
    const successfulDocs = await this.searchService.search(
      '',
      {
        organizationId,
      },
      'success'
    );

    // Get user's history
    const userHistory = user.recommendations.map((rec) => ({
      id: rec.id,
      itemId: rec.itemId,
      feedback: rec.feedback,
    }));

    // Rank recommendations
    const recommendations = this.rankRecommendations(
      relevantDocs,
      popularDocs,
      successfulDocs,
      userHistory
    );

    // Store recommendations
    await this.storeRecommendations(userId, organizationId, recommendations);

    // Return top recommendations
    return recommendations.slice(0, limit || 10);
  }

  private rankRecommendations(
    relevantDocs: any[],
    popularDocs: any[],
    successfulDocs: any[],
    userHistory: any[]
  ) {
    // Combine all documents
    const allDocs = [...relevantDocs, ...popularDocs, ...successfulDocs];

    // Remove duplicates
    const uniqueDocs = allDocs.filter(
      (doc, index, self) =>
        index === self.findIndex((d) => d.id === doc.id)
    );

    // Rank documents based on various factors
    const rankedDocs = uniqueDocs.map((doc) => {
      let score = 0;

      // Relevance score
      const relevanceIndex = relevantDocs.findIndex((d) => d.id === doc.id);
      if (relevanceIndex !== -1) {
        score += (relevantDocs.length - relevanceIndex) * 2;
      }

      // Popularity score
      const popularityIndex = popularDocs.findIndex((d) => d.id === doc.id);
      if (popularityIndex !== -1) {
        score += (popularDocs.length - popularityIndex);
      }

      // Success score
      const successIndex = successfulDocs.findIndex((d) => d.id === doc.id);
      if (successIndex !== -1) {
        score += (successfulDocs.length - successIndex) * 1.5;
      }

      // History score
      const historyItem = userHistory.find((h) => h.itemId === doc.id);
      if (historyItem) {
        if (historyItem.feedback === 'positive') {
          score += 3;
        } else if (historyItem.feedback === 'negative') {
          score -= 2;
        }
      }

      return {
        ...doc,
        score,
      };
    });

    // Sort by score
    return rankedDocs.sort((a, b) => b.score - a.score);
  }

  private async storeRecommendations(
    userId: string,
    organizationId: string,
    recommendations: any[]
  ) {
    // Store recommendations in database
    await prisma.recommendation.createMany({
      data: recommendations.map((rec) => ({
        userId,
        organizationId,
        itemId: rec.id,
        itemType: rec.contentType,
        score: rec.score,
      })),
      skipDuplicates: true,
    });
  }

  async updateFeedback(userId: string, itemId: string, feedback: 'positive' | 'negative') {
    // Update recommendation feedback
    await prisma.recommendation.updateMany({
      where: {
        userId,
        itemId,
      },
      data: {
        feedback,
      },
    });
  }
} 
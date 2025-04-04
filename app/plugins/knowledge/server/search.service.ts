import { MeiliSearch } from 'meilisearch';
import { prisma } from '~/server/prisma';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY,
});

const KNOWLEDGE_INDEX = 'knowledge';

interface SearchableDocument {
  id: string;
  contentId: string;
  contentType: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
}

export class KnowledgeSearchService {
  private async ensureIndex() {
    const index = await client.getOrCreateIndex(KNOWLEDGE_INDEX, {
      primaryKey: 'id',
    });
    
    await index.updateSettings({
      searchableAttributes: [
        'title',
        'content',
        'metadata.practiceArea',
        'metadata.documentType',
        'metadata.tags',
      ],
      filterableAttributes: [
        'contentType',
        'metadata.practiceArea',
        'metadata.documentType',
        'metadata.organizationId',
      ],
      sortableAttributes: [
        'metadata.usageCount',
        'metadata.successRate',
        'metadata.createdAt',
      ],
    });
  }

  async indexDocument(document: SearchableDocument) {
    await this.ensureIndex();
    const index = await client.getIndex(KNOWLEDGE_INDEX);
    await index.addDocuments([document]);

    // Update search index in database
    await prisma.searchIndex.upsert({
      where: {
        id: document.id,
      },
      create: {
        id: document.id,
        contentId: document.contentId,
        contentType: document.contentType,
        indexedText: `${document.title} ${document.content}`,
        metadata: document.metadata,
      },
      update: {
        indexedText: `${document.title} ${document.content}`,
        metadata: document.metadata,
      },
    });
  }

  async search(query: string, filters?: Record<string, any>, sort?: string) {
    await this.ensureIndex();
    const index = await client.getIndex(KNOWLEDGE_INDEX);

    const searchParams: any = {};
    if (filters) {
      searchParams.filter = Object.entries(filters).map(
        ([key, value]) => `${key} = "${value}"`
      );
    }
    if (sort) {
      searchParams.sort = [sort];
    }

    const results = await index.search(query, searchParams);
    return results;
  }

  async deleteDocument(id: string) {
    await this.ensureIndex();
    const index = await client.getIndex(KNOWLEDGE_INDEX);
    await index.deleteDocument(id);
    
    await prisma.searchIndex.delete({
      where: { id },
    });
  }

  async reindexAll() {
    // Reindex knowledge articles
    const articles = await prisma.knowledgeArticle.findMany({
      include: {
        practiceArea: true,
      },
    });

    const articleDocs = articles.map((article) => ({
      id: `article-${article.id}`,
      contentId: article.id,
      contentType: 'article',
      title: article.title,
      content: article.content,
      metadata: {
        practiceArea: article.practiceArea.title,
        organizationId: article.organizationId,
        tags: article.tags,
        viewCount: article.viewCount,
        createdAt: article.createdAt.toISOString(),
      },
    }));

    // Reindex precedent documents
    const precedents = await prisma.precedentDocument.findMany({
      include: {
        practiceArea: true,
      },
    });

    const precedentDocs = precedents.map((precedent) => ({
      id: `precedent-${precedent.id}`,
      contentId: precedent.id,
      contentType: 'precedent',
      title: precedent.title,
      content: precedent.content,
      metadata: {
        practiceArea: precedent.practiceArea.title,
        organizationId: precedent.organizationId,
        documentType: precedent.documentType,
        successRate: precedent.successRate,
        usageCount: precedent.usageCount,
        createdAt: precedent.createdAt.toISOString(),
      },
    }));

    // Reindex templates
    const templates = await prisma.documentTemplate.findMany({
      include: {
        practiceArea: true,
      },
    });

    const templateDocs = templates.map((template) => ({
      id: `template-${template.id}`,
      contentId: template.id,
      contentType: 'template',
      title: template.title,
      content: template.content,
      metadata: {
        practiceArea: template.practiceArea.title,
        organizationId: template.organizationId,
        documentType: template.documentType,
        successRate: template.successRate,
        usageCount: template.usageCount,
        status: template.status,
        createdAt: template.createdAt.toISOString(),
      },
    }));

    // Index all documents
    const allDocs = [...articleDocs, ...precedentDocs, ...templateDocs];
    await this.ensureIndex();
    const index = await client.getIndex(KNOWLEDGE_INDEX);
    await index.addDocuments(allDocs);
  }
} 
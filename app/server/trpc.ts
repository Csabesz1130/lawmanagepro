import { initTRPC } from '@trpc/server';
import { activityRouter } from '~/plugins/activity/server/activity.router';
import { knowledgeRouter } from '~/plugins/knowledge/server/knowledge.router';

const t = initTRPC.context().create();
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;

export const appRouter = createTRPCRouter({
  activityApi: activityRouter,
  knowledge: knowledgeRouter,
});

export type AppRouter = typeof appRouter; 
/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from ".";
import * as _Schema from '@zenstackhq/runtime/zod/input';
const $Schema: typeof _Schema = (_Schema as any).default ?? _Schema;
import { checkRead, checkMutate } from '../helper';
import type { Prisma } from '@zenstackhq/runtime/models';
import type { UseTRPCMutationOptions, UseTRPCMutationResult, UseTRPCQueryOptions, UseTRPCQueryResult, UseTRPCInfiniteQueryOptions, UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export default function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({

        createMany: procedure.input($Schema.TimeEntryInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).timeEntry.createMany(input as any))),

        create: procedure.input($Schema.TimeEntryInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).timeEntry.create(input as any))),

        deleteMany: procedure.input($Schema.TimeEntryInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).timeEntry.deleteMany(input as any))),

        delete: procedure.input($Schema.TimeEntryInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).timeEntry.delete(input as any))),

        findFirst: procedure.input($Schema.TimeEntryInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).timeEntry.findFirst(input as any))),

        findMany: procedure.input($Schema.TimeEntryInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).timeEntry.findMany(input as any))),

        findUnique: procedure.input($Schema.TimeEntryInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).timeEntry.findUnique(input as any))),

        updateMany: procedure.input($Schema.TimeEntryInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).timeEntry.updateMany(input as any))),

        update: procedure.input($Schema.TimeEntryInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).timeEntry.update(input as any))),

        count: procedure.input($Schema.TimeEntryInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).timeEntry.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.TimeEntryCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TimeEntryCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TimeEntryCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TimeEntryCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.TimeEntryCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TimeEntryCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TimeEntryGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TimeEntryGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TimeEntryCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TimeEntryCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TimeEntryGetPayload<T>, Context>) => Promise<Prisma.TimeEntryGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.TimeEntryDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TimeEntryDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TimeEntryDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TimeEntryDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.TimeEntryDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TimeEntryDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TimeEntryGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TimeEntryGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TimeEntryDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TimeEntryDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TimeEntryGetPayload<T>, Context>) => Promise<Prisma.TimeEntryGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.TimeEntryFindFirstArgs, TData = Prisma.TimeEntryGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.TimeEntryFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TimeEntryGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TimeEntryFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TimeEntryFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TimeEntryGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TimeEntryGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.TimeEntryFindManyArgs, TData = Array<Prisma.TimeEntryGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.TimeEntryFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.TimeEntryGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TimeEntryFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TimeEntryFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.TimeEntryGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.TimeEntryGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.TimeEntryFindUniqueArgs, TData = Prisma.TimeEntryGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.TimeEntryFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TimeEntryGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TimeEntryFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TimeEntryFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TimeEntryGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TimeEntryGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.TimeEntryUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TimeEntryUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TimeEntryUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TimeEntryUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.TimeEntryUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TimeEntryUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TimeEntryGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TimeEntryGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TimeEntryUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TimeEntryUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TimeEntryGetPayload<T>, Context>) => Promise<Prisma.TimeEntryGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.TimeEntryCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TimeEntryCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.TimeEntryCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.TimeEntryCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.TimeEntryCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.TimeEntryCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.TimeEntryCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TimeEntryCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

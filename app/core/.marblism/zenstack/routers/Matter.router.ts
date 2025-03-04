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

        createMany: procedure.input($Schema.MatterInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).matter.createMany(input as any))),

        create: procedure.input($Schema.MatterInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).matter.create(input as any))),

        deleteMany: procedure.input($Schema.MatterInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).matter.deleteMany(input as any))),

        delete: procedure.input($Schema.MatterInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).matter.delete(input as any))),

        findFirst: procedure.input($Schema.MatterInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).matter.findFirst(input as any))),

        findMany: procedure.input($Schema.MatterInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).matter.findMany(input as any))),

        findUnique: procedure.input($Schema.MatterInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).matter.findUnique(input as any))),

        updateMany: procedure.input($Schema.MatterInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).matter.updateMany(input as any))),

        update: procedure.input($Schema.MatterInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).matter.update(input as any))),

        count: procedure.input($Schema.MatterInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).matter.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.MatterCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MatterCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MatterCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MatterCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.MatterCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MatterCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MatterGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MatterGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MatterCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MatterCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MatterGetPayload<T>, Context>) => Promise<Prisma.MatterGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.MatterDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MatterDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MatterDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MatterDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.MatterDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MatterDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MatterGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MatterGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MatterDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MatterDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MatterGetPayload<T>, Context>) => Promise<Prisma.MatterGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.MatterFindFirstArgs, TData = Prisma.MatterGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.MatterFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.MatterGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MatterFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.MatterFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.MatterGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.MatterGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.MatterFindManyArgs, TData = Array<Prisma.MatterGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.MatterFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.MatterGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MatterFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.MatterFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.MatterGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.MatterGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.MatterFindUniqueArgs, TData = Prisma.MatterGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.MatterFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.MatterGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MatterFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MatterFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.MatterGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.MatterGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.MatterUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MatterUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MatterUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MatterUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.MatterUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MatterUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MatterGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MatterGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MatterUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MatterUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MatterGetPayload<T>, Context>) => Promise<Prisma.MatterGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.MatterCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.MatterCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.MatterCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.MatterCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.MatterCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.MatterCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.MatterCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.MatterCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

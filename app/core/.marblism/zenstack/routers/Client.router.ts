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

        createMany: procedure.input($Schema.ClientInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).client.createMany(input as any))),

        create: procedure.input($Schema.ClientInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).client.create(input as any))),

        deleteMany: procedure.input($Schema.ClientInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).client.deleteMany(input as any))),

        delete: procedure.input($Schema.ClientInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).client.delete(input as any))),

        findFirst: procedure.input($Schema.ClientInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).client.findFirst(input as any))),

        findMany: procedure.input($Schema.ClientInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).client.findMany(input as any))),

        findUnique: procedure.input($Schema.ClientInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).client.findUnique(input as any))),

        updateMany: procedure.input($Schema.ClientInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).client.updateMany(input as any))),

        update: procedure.input($Schema.ClientInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).client.update(input as any))),

        count: procedure.input($Schema.ClientInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).client.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.ClientCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ClientCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ClientCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ClientCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.ClientCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ClientCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.ClientGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.ClientGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ClientCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ClientCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ClientGetPayload<T>, Context>) => Promise<Prisma.ClientGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.ClientDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ClientDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ClientDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ClientDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.ClientDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ClientDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.ClientGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.ClientGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ClientDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ClientDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ClientGetPayload<T>, Context>) => Promise<Prisma.ClientGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.ClientFindFirstArgs, TData = Prisma.ClientGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.ClientFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ClientGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ClientFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.ClientFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ClientGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.ClientGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.ClientFindManyArgs, TData = Array<Prisma.ClientGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.ClientFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.ClientGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ClientFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.ClientFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.ClientGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.ClientGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.ClientFindUniqueArgs, TData = Prisma.ClientGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.ClientFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ClientGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ClientFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ClientFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ClientGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.ClientGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.ClientUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ClientUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ClientUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ClientUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.ClientUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ClientUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.ClientGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.ClientGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ClientUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ClientUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ClientGetPayload<T>, Context>) => Promise<Prisma.ClientGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.ClientCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.ClientCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.ClientCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.ClientCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.ClientCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.ClientCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.ClientCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.ClientCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

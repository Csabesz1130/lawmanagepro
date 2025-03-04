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

        createMany: procedure.input($Schema.TaskInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).task.createMany(input as any))),

        create: procedure.input($Schema.TaskInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).task.create(input as any))),

        deleteMany: procedure.input($Schema.TaskInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).task.deleteMany(input as any))),

        delete: procedure.input($Schema.TaskInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).task.delete(input as any))),

        findFirst: procedure.input($Schema.TaskInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).task.findFirst(input as any))),

        findMany: procedure.input($Schema.TaskInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).task.findMany(input as any))),

        findUnique: procedure.input($Schema.TaskInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).task.findUnique(input as any))),

        updateMany: procedure.input($Schema.TaskInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).task.updateMany(input as any))),

        update: procedure.input($Schema.TaskInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).task.update(input as any))),

        count: procedure.input($Schema.TaskInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).task.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.TaskCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TaskCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TaskCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TaskCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.TaskCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TaskCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TaskGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TaskGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TaskCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TaskCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TaskGetPayload<T>, Context>) => Promise<Prisma.TaskGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.TaskDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TaskDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TaskDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TaskDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.TaskDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TaskDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TaskGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TaskGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TaskDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TaskDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TaskGetPayload<T>, Context>) => Promise<Prisma.TaskGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.TaskFindFirstArgs, TData = Prisma.TaskGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.TaskFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TaskGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TaskFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TaskFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TaskGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TaskGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.TaskFindManyArgs, TData = Array<Prisma.TaskGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.TaskFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.TaskGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TaskFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TaskFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.TaskGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.TaskGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.TaskFindUniqueArgs, TData = Prisma.TaskGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.TaskFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TaskGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TaskFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TaskFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TaskGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TaskGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.TaskUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TaskUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TaskUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TaskUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.TaskUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TaskUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TaskGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TaskGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TaskUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TaskUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TaskGetPayload<T>, Context>) => Promise<Prisma.TaskGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.TaskCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TaskCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.TaskCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.TaskCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.TaskCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.TaskCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.TaskCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TaskCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

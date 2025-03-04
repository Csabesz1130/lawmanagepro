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

        createMany: procedure.input($Schema.ExpenseInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).expense.createMany(input as any))),

        create: procedure.input($Schema.ExpenseInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).expense.create(input as any))),

        deleteMany: procedure.input($Schema.ExpenseInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).expense.deleteMany(input as any))),

        delete: procedure.input($Schema.ExpenseInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).expense.delete(input as any))),

        findFirst: procedure.input($Schema.ExpenseInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).expense.findFirst(input as any))),

        findMany: procedure.input($Schema.ExpenseInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).expense.findMany(input as any))),

        findUnique: procedure.input($Schema.ExpenseInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).expense.findUnique(input as any))),

        updateMany: procedure.input($Schema.ExpenseInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).expense.updateMany(input as any))),

        update: procedure.input($Schema.ExpenseInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).expense.update(input as any))),

        count: procedure.input($Schema.ExpenseInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).expense.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.ExpenseCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ExpenseCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ExpenseCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ExpenseCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.ExpenseCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ExpenseCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.ExpenseGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.ExpenseGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ExpenseCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ExpenseCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExpenseGetPayload<T>, Context>) => Promise<Prisma.ExpenseGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.ExpenseDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ExpenseDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ExpenseDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ExpenseDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.ExpenseDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ExpenseDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.ExpenseGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.ExpenseGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ExpenseDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ExpenseDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExpenseGetPayload<T>, Context>) => Promise<Prisma.ExpenseGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.ExpenseFindFirstArgs, TData = Prisma.ExpenseGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.ExpenseFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ExpenseGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ExpenseFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.ExpenseFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ExpenseGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.ExpenseGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.ExpenseFindManyArgs, TData = Array<Prisma.ExpenseGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.ExpenseFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.ExpenseGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ExpenseFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.ExpenseFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.ExpenseGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.ExpenseGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.ExpenseFindUniqueArgs, TData = Prisma.ExpenseGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.ExpenseFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ExpenseGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ExpenseFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExpenseFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ExpenseGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.ExpenseGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.ExpenseUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ExpenseUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ExpenseUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ExpenseUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.ExpenseUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.ExpenseUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.ExpenseGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.ExpenseGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.ExpenseUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.ExpenseUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExpenseGetPayload<T>, Context>) => Promise<Prisma.ExpenseGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.ExpenseCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.ExpenseCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.ExpenseCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.ExpenseCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.ExpenseCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.ExpenseCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.ExpenseCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.ExpenseCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

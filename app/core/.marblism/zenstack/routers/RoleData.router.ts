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

        createMany: procedure.input($Schema.RoleDataInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).roleData.createMany(input as any))),

        create: procedure.input($Schema.RoleDataInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).roleData.create(input as any))),

        deleteMany: procedure.input($Schema.RoleDataInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).roleData.deleteMany(input as any))),

        delete: procedure.input($Schema.RoleDataInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).roleData.delete(input as any))),

        findFirst: procedure.input($Schema.RoleDataInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).roleData.findFirst(input as any))),

        findMany: procedure.input($Schema.RoleDataInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).roleData.findMany(input as any))),

        findUnique: procedure.input($Schema.RoleDataInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).roleData.findUnique(input as any))),

        updateMany: procedure.input($Schema.RoleDataInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).roleData.updateMany(input as any))),

        update: procedure.input($Schema.RoleDataInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).roleData.update(input as any))),

        count: procedure.input($Schema.RoleDataInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).roleData.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.RoleDataCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.RoleDataCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.RoleDataCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.RoleDataCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.RoleDataCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.RoleDataCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.RoleDataGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.RoleDataGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.RoleDataCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.RoleDataCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.RoleDataGetPayload<T>, Context>) => Promise<Prisma.RoleDataGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.RoleDataDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.RoleDataDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.RoleDataDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.RoleDataDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.RoleDataDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.RoleDataDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.RoleDataGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.RoleDataGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.RoleDataDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.RoleDataDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.RoleDataGetPayload<T>, Context>) => Promise<Prisma.RoleDataGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.RoleDataFindFirstArgs, TData = Prisma.RoleDataGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.RoleDataFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.RoleDataGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.RoleDataFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.RoleDataFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.RoleDataGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.RoleDataGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.RoleDataFindManyArgs, TData = Array<Prisma.RoleDataGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.RoleDataFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.RoleDataGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.RoleDataFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.RoleDataFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.RoleDataGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.RoleDataGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.RoleDataFindUniqueArgs, TData = Prisma.RoleDataGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.RoleDataFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.RoleDataGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.RoleDataFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.RoleDataFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.RoleDataGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.RoleDataGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.RoleDataUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.RoleDataUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.RoleDataUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.RoleDataUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.RoleDataUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.RoleDataUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.RoleDataGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.RoleDataGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.RoleDataUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.RoleDataUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.RoleDataGetPayload<T>, Context>) => Promise<Prisma.RoleDataGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.RoleDataCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.RoleDataCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.RoleDataCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.RoleDataCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.RoleDataCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.RoleDataCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.RoleDataCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.RoleDataCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

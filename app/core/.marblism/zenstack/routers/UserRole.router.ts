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

        createMany: procedure.input($Schema.UserRoleInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).userRole.createMany(input as any))),

        create: procedure.input($Schema.UserRoleInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).userRole.create(input as any))),

        deleteMany: procedure.input($Schema.UserRoleInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).userRole.deleteMany(input as any))),

        delete: procedure.input($Schema.UserRoleInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).userRole.delete(input as any))),

        findFirst: procedure.input($Schema.UserRoleInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).userRole.findFirst(input as any))),

        findMany: procedure.input($Schema.UserRoleInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).userRole.findMany(input as any))),

        findUnique: procedure.input($Schema.UserRoleInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).userRole.findUnique(input as any))),

        updateMany: procedure.input($Schema.UserRoleInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).userRole.updateMany(input as any))),

        update: procedure.input($Schema.UserRoleInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).userRole.update(input as any))),

        count: procedure.input($Schema.UserRoleInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).userRole.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.UserRoleCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.UserRoleCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.UserRoleCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.UserRoleCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.UserRoleCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.UserRoleCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.UserRoleGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.UserRoleGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.UserRoleCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.UserRoleCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.UserRoleGetPayload<T>, Context>) => Promise<Prisma.UserRoleGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.UserRoleDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.UserRoleDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.UserRoleDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.UserRoleDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.UserRoleDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.UserRoleDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.UserRoleGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.UserRoleGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.UserRoleDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.UserRoleDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.UserRoleGetPayload<T>, Context>) => Promise<Prisma.UserRoleGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.UserRoleFindFirstArgs, TData = Prisma.UserRoleGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.UserRoleFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.UserRoleGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.UserRoleFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.UserRoleFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.UserRoleGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.UserRoleGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.UserRoleFindManyArgs, TData = Array<Prisma.UserRoleGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.UserRoleFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.UserRoleGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.UserRoleFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.UserRoleFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.UserRoleGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.UserRoleGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.UserRoleFindUniqueArgs, TData = Prisma.UserRoleGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.UserRoleFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.UserRoleGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.UserRoleFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.UserRoleFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.UserRoleGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.UserRoleGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.UserRoleUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.UserRoleUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.UserRoleUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.UserRoleUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.UserRoleUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.UserRoleUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.UserRoleGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.UserRoleGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.UserRoleUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.UserRoleUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.UserRoleGetPayload<T>, Context>) => Promise<Prisma.UserRoleGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.UserRoleCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.UserRoleCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.UserRoleCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.UserRoleCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.UserRoleCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.UserRoleCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.UserRoleCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.UserRoleCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}

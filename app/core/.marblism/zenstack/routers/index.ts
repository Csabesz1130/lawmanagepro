/* eslint-disable */
import type { unsetMarker, AnyRouter, AnyRootConfig, CreateRouterInner, Procedure, ProcedureBuilder, ProcedureParams, ProcedureRouterRecord, ProcedureType } from "@trpc/server";
import type { PrismaClient } from "@zenstackhq/runtime/models";
import createUserRouter from "./User.router";
import createRoleDataRouter from "./RoleData.router";
import createUserRoleRouter from "./UserRole.router";
import createClientRouter from "./Client.router";
import createMatterRouter from "./Matter.router";
import createTaskRouter from "./Task.router";
import createTimeEntryRouter from "./TimeEntry.router";
import createExpenseRouter from "./Expense.router";
import createOrganizationRouter from "./Organization.router";
import createOrganizationRoleRouter from "./OrganizationRole.router";
import createPwaSubscriptionRouter from "./PwaSubscription.router";
import { ClientType as UserClientType } from "./User.router";
import { ClientType as RoleDataClientType } from "./RoleData.router";
import { ClientType as UserRoleClientType } from "./UserRole.router";
import { ClientType as ClientClientType } from "./Client.router";
import { ClientType as MatterClientType } from "./Matter.router";
import { ClientType as TaskClientType } from "./Task.router";
import { ClientType as TimeEntryClientType } from "./TimeEntry.router";
import { ClientType as ExpenseClientType } from "./Expense.router";
import { ClientType as OrganizationClientType } from "./Organization.router";
import { ClientType as OrganizationRoleClientType } from "./OrganizationRole.router";
import { ClientType as PwaSubscriptionClientType } from "./PwaSubscription.router";

export type BaseConfig = AnyRootConfig;

export type RouterFactory<Config extends BaseConfig> = <
    ProcRouterRecord extends ProcedureRouterRecord
>(
    procedures: ProcRouterRecord
) => CreateRouterInner<Config, ProcRouterRecord>;

export type UnsetMarker = typeof unsetMarker;

export type ProcBuilder<Config extends BaseConfig> = ProcedureBuilder<
    ProcedureParams<Config, any, any, any, UnsetMarker, UnsetMarker, any>
>;

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({
        user: createUserRouter(router, procedure),
        roleData: createRoleDataRouter(router, procedure),
        userRole: createUserRoleRouter(router, procedure),
        client: createClientRouter(router, procedure),
        matter: createMatterRouter(router, procedure),
        task: createTaskRouter(router, procedure),
        timeEntry: createTimeEntryRouter(router, procedure),
        expense: createExpenseRouter(router, procedure),
        organization: createOrganizationRouter(router, procedure),
        organizationRole: createOrganizationRoleRouter(router, procedure),
        pwaSubscription: createPwaSubscriptionRouter(router, procedure),
    }
    );
}

export interface ClientType<AppRouter extends AnyRouter> {
    user: UserClientType<AppRouter>;
    roleData: RoleDataClientType<AppRouter>;
    userRole: UserRoleClientType<AppRouter>;
    client: ClientClientType<AppRouter>;
    matter: MatterClientType<AppRouter>;
    task: TaskClientType<AppRouter>;
    timeEntry: TimeEntryClientType<AppRouter>;
    expense: ExpenseClientType<AppRouter>;
    organization: OrganizationClientType<AppRouter>;
    organizationRole: OrganizationRoleClientType<AppRouter>;
    pwaSubscription: PwaSubscriptionClientType<AppRouter>;
}

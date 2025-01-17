import { AppPermission } from '@talk2resume/types'

export type UserRoleResolverFn<TRole> = (tenant?: string) => TRole

export class RBACContainerBase<TRoles, TResource, TAction> {
  config = new Map<TRoles, Array<AppPermission<TRoles, TResource, TAction>>>()
  public describeRole(
    role: TRoles,
    permissions: Array<AppPermission<TRoles, TResource, TAction>> = []
  ) {
    return {
      withPermissions: (
        resource: TResource,
        actions: Array<TAction>
      ) => {
        const newPermission = new AppPermission<TRoles, TResource, TAction>(role, resource, actions)
        return {
          buildRole: () => {
            this.config.set(role, [...permissions, newPermission])
          },
          allowColumns: (allowedColumns: Array<string>) => {
            newPermission.columns = allowedColumns
            return this.describeRole(role, permissions)
          },
          rowFilter: (
            rowFilter: (record, user) => boolean
          ) => {
            newPermission.rowFilter = rowFilter
            return this.describeRole(role, [...permissions, newPermission])
          },
          ...this.describeRole(role, [...permissions, newPermission])
        }
      }
    }
  }

}

export class RBACUserContainerBase<TRole, TResource, TAction> {
  role: TRole

  constructor(
    private userRbac: RBACContainerBase<TRole, TResource, TAction>,
    getCurrentRole: UserRoleResolverFn<TRole>
  ) {
    this.role = getCurrentRole()
  }

  testOperationPermissions<TData>(
    resource: TResource,
    action: TAction,
    data: Partial<TData>
  ) {
    let allow = false
    const resourceConfig = this.userRbac.config.get(this.role)?.find(x => x.resource === resource)
    if (!resourceConfig) { return { allow } }

    let maskedData: Partial<TData> = data
    allow = resourceConfig?.permissions.includes(action)
    if (resourceConfig.columns.length > 0 && !resourceConfig.columns.includes('*')) {
      maskedData = resourceConfig.columns.reduce((delta, column) => ({
        ...delta,
        [column]: data[column]
      }), {} as Partial<TData>)
    }

    return { allow, data: maskedData }
  }

  createResourceScopedRBAC<TData>(
    resource: TResource
  ) {
    return (
      action: TAction,
      data: Partial<TData>
    ) => this.testOperationPermissions(resource, action, data)
  }

}

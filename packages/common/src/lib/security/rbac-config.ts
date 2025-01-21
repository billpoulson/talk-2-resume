import { Actions, Resource, Role } from '@talk2resume/types'
import { inject, injectable } from 'tsyringe'
import { TypedRBACFn } from '.'
import { RBACContainerBase, RBACUserContainerBase, UserRoleResolverFn } from './rbac-base'

export type AppRBACFn = TypedRBACFn<Actions>
export const APP_ROLE_RESOLVER_FN$$ = "AppRoleResolverFn"
export type AppRoleResolverFn = UserRoleResolverFn<Role>

@injectable()
export class ApplicationRBAC extends RBACContainerBase<Role, Resource, Actions> {
  constructor() {
    super()

    this.describeRole(Role.Admin)
      .withPermissions(Resource.Ship, [Actions.Update])
      .withPermissions(Resource.UserFiles, [Actions.Read])
      .buildRole()

    this.describeRole(Role.AuthorizedUser)
      .withPermissions(Resource.UserFiles, [Actions.Wildcard])
      .buildRole()

    this.describeRole(Role.Guest)
      .withPermissions(Resource.Ship, [Actions.Read])
      .buildRole()
  }

}

@injectable()
export class UserRBAC extends RBACUserContainerBase<Role, Resource, Actions> {
  constructor(
    appRBAC: ApplicationRBAC,
    @inject(APP_ROLE_RESOLVER_FN$$) userProfile: AppRoleResolverFn
  ) {
    super(appRBAC, userProfile)
  }
}


export enum Role {
  Admin = "Admin",
  Guest = "Guest",
  AuthorizedUser = "AuthorizedUser"
}
export enum Actions {
  Wildcard = "*",
  Create = "Create",
  Read = "Read",
  Update = "Update",
  Delete = "Delete",
}
export enum Resource {
  Wildcard = "*",
  Station = "station",
  Ship = "ship",
}
export class AppPermission<TRole, TResource, TAction> {
  columns: string[] = ['*']
  rowFilter: (record: any, user: any) => boolean = (record: any, user: any) => true
  constructor(
    public role: TRole,
    public resource: TResource,
    public permissions: Array<TAction>
  ) { }
}


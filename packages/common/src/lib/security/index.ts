export * from './rbac-base'
export * from './rbac-config'

export type TypedRBACFn<TAction> = (action: TAction, data?: any) => { allow: boolean; data?: undefined } | { allow: boolean; data: any }

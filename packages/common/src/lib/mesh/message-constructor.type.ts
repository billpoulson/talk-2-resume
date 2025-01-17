export type MessageConstructor<TArgs, TMessageType> = {
  new(data: TArgs): TMessageType // Constructor for instances
  type: string // Static property
  uuid?: string
}

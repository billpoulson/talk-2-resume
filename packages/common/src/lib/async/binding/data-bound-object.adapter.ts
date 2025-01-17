import { DataBindingFactory, } from './data-binding-factory.abstract'
import { IDataBoundObject } from './data-bound-object.interface'

export abstract class DataBoundObjectBase<
  TData,
  TBoundObject extends IDataBoundObject<TData>
>
  extends DataBindingFactory<TData, TBoundObject> {
  constructor(boundSource: TBoundObject) {
    super(boundSource)
    return this.getPortable() as any
  }
}

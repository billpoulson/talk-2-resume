import { IDataBoundObject } from './data-bound-object.interface'

export interface DataBindingFactory<TData> {
  getPortable: () => IDataBoundObject<TData>
}

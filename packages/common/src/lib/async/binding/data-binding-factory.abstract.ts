import { Observable } from 'rxjs'
import { LoadingState } from '../../state'
import { IDataBoundObject } from './data-bound-object.interface'

export abstract class DataBindingFactory<
  TData,
  TBoundObject extends IDataBoundObject<TData>
>
  implements IDataBoundObject<TData> {
  constructor(
    private boundObject: TBoundObject
  ) {
  }
  public getPortable(): IDataBoundObject<TData> {
    return {
      update: this.boundObject.update.bind(this.boundObject),
      fetch: this.boundObject.fetch.bind(this.boundObject),
      data$: this.boundObject.data$,
    }
  }
  update!: (
    createPatch: (data: LoadingState | TData) => Observable<any>,
    pushUpdate?: boolean
  ) => Observable<TData>

  fetch!: () => void
  data$!: Observable<LoadingState | TData>
}

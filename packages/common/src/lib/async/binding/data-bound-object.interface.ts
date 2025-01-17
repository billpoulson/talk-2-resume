import { Observable } from 'rxjs'
import { LoadingState } from '../../state'

export interface IDataBoundObject<TData> {
  update: (
    createPatch: (data: TData | LoadingState) => Observable<any>,
    pushUpdate?: boolean
  ) => Observable<TData>
  fetch: () => void
  data$: Observable<TData | LoadingState>
}

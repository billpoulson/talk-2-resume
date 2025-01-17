import { BehaviorSubject } from 'rxjs'
import { LoadingState } from '../state'

export interface ILazyLoader<TData> {
  data: BehaviorSubject<LoadingState | TData>
  load(): Promise<TData>
}

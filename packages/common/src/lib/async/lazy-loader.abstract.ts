import { BehaviorSubject } from 'rxjs'
import { LoadingState } from '../state'
import { ILazyLoader } from './lazy-loader.interface'

export abstract class LazyLoader<TData> implements ILazyLoader<TData> {
  data!: BehaviorSubject<TData | LoadingState>
  load(): Promise<TData> {
    throw new Error('Method not implemented.')
  }
}
import { Observable, filter } from 'rxjs'
import { LoadingState } from './loading-state'

export function isLoaded<T>(
  enumObj?: { [key: string]: string }
) {
  return function (source: Observable<T>): Observable<T> {
    return source.pipe(
      filter((value: any) => isNotALoadingStateEnumValue(value, enumObj)),
    ) as Observable<T>
  }
}

function isNotALoadingStateEnumValue(value: any, enumObj: { [key: string]: string } | undefined): boolean {
  return !isEnumValue(LoadingState, value)
    && !isEnumValue(enumObj, value)
}

function isEnumValue<T extends string>(enumObj: { [key: string]: T } | undefined, value: any): value is T {
  return Object.values(enumObj ?? []).includes(value as T)
}
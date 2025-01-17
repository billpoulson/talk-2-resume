import { OperatorFunction, map } from 'rxjs'

/**
 * Custom operator that applies the given operator based on a feature flag.
 * @param featureFlag A boolean indicating whether the feature is enabled.
 * @param innerOperator The operator to apply if the feature is enabled.
 */
export function withFeatureFlag<T, R = T>(
  featureFlag: boolean,
  innerOperator: OperatorFunction<T, R> = map((value) => value as unknown as R)
): OperatorFunction<T, T | R> {
  return function (source) {
    return featureFlag ? source.pipe(innerOperator) : source
  }
}
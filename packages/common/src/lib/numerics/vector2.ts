import { Point } from './point'

export class Vector2 {
  x: Point
  y: Point

  constructor(
    params: { x: Point, y: Point }
  ) {
    this.x = params.x
    this.y = params.y
  }
  static multiplyV2 = (a: Vector2, b: Vector2): Vector2 => new Vector2({ x: a.x * b.x, y: a.y * b.y })
}

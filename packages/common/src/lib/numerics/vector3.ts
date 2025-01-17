import { isInRange } from './functions/isInRange'
import { Point } from './point'
import { getRandomInclusive } from './random/getRandomInclusive'
import { Vector2 } from './vector2'
import { Vector3Boundary } from './vector3-boundary'

export class Vector3 extends Vector2 {
  z: Point
  /**
   *
   */
  constructor(
    params: {
      x: Point,
      y: Point,
      z: Point,
    }
  ) {
    super(params)
    this.z = params.z
  }
  static createVector3 = ([x, y, z]: [Point, Point, Point]): Vector3 => new Vector3({ x, y, z })
  static multiplyV3 = (a: Vector3, b: Vector3): Vector3 => new Vector3({ x: a.x * b.x, y: a.y * b.y, z: a.z * b.z })
  static add = (a: Vector3, b: Vector3): Vector3 => new Vector3({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })
  static multiplyBy = (a: Vector3, b: number): Vector3 => new Vector3({ x: a.x * b, y: a.y * b, z: a.z * b })
  static divideBy = (a: Vector3, b: number): Vector3 => new Vector3({ x: a.x / b, y: a.y / b, z: a.z / b })
  static square = (val: number): Vector3 => new Vector3({ x: val, y: val, z: val })
  static zero: Vector3 = Vector3.square(0)
  static one: Vector3 = Vector3.square(1)
  static negativeOne: Vector3 = Vector3.square(-1)
  override toString = (): string => `${this.x}.${this.y}.${this.z}`


  static random = ({ root, limit }: Vector3Boundary): Vector3 => new Vector3({
    x: getRandomInclusive(root.x, limit.x),
    y: getRandomInclusive(root.y, limit.y),
    z: getRandomInclusive(root.z, limit.z),
  })

  private static getIntersectingAxis = (
    {
      root: { x: rx, y: ry, z: rz },
      limit: { x: lx, y: ly, z: lz }
    }: Vector3Boundary,
    { x: tx, y: ty, z: tz }: Vector3
  ) => ({
    x: isInRange(rx, lx, tx),
    y: isInRange(ry, ly, ty),
    z: isInRange(rz, lz, tz)
  })

  static isWithinBoundary = (boundary: Vector3Boundary, position: Vector3) => {
    const { x, y, z } = Vector3.getIntersectingAxis(boundary, position)
    return x && y && z
  }

  static distanceBetween = (vec1: Vector3, vec2: Vector3): number => {
    const dx = vec1.x - vec2.x
    const dy = vec1.y - vec2.y
    const dz = vec1.z - vec2.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  };

  distanceTo = (vec2: Vector3): number => {
    const dx = this.x - vec2.x
    const dy = this.y - vec2.y
    const dz = this.z - vec2.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  subtract(other: Vector3): Vector3 {
    return new Vector3({
      x: this.x - other.x,
      y: this.y - other.y,
      z: this.z - other.z
    })
  }

  pointTowards(from: Vector3, to: Vector3): Vector3 {
    const directionVector = to.subtract(from)
    return directionVector.normalize()
  }

  normalize(): Vector3 {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    if (magnitude === 0) {
      throw new Error("Cannot normalize a zero vector.")
    }
    return Vector3.createVector3([
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude
    ])
  }

  scale(scalar: number): Vector3 {
    return Vector3.createVector3([
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    ])
  }

  // Add another vector to this vector
  add(other: Vector3): Vector3 {
    return Vector3.createVector3([
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    ])
  }

  // Method to compute the magnitude of the vector
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  lerp(target: Vector3, t: number) {
    return this.scale(1 - t).add(target.scale(t))
  }
}

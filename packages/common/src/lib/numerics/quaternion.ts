import { Point } from './point'
import { Vector3 } from './vector3'

export class Quaternion extends Vector3 {
  public w: number
  static createQuaternion(params: Point[]) {
    const [w, x, y, z] = params
    return new Quaternion({ w, x, y, z })
  }
  // Convert a vector to a quaternion with zero w
  static fromVector(v: Vector3): Quaternion {
    return Quaternion.createQuaternion([0, v.x, v.y, v.z])
  }
  // Create a quaternion from an axis and angle
  static fromAxisAngle(axis: Vector3, angleDegrees: number): Quaternion {
    const angleRadians = (angleDegrees * Math.PI) / 180
    const halfAngle = angleRadians / 2
    const sinHalfAngle = Math.sin(halfAngle)

    return Quaternion.createQuaternion([
      Math.cos(halfAngle),
      axis.x * sinHalfAngle,
      axis.y * sinHalfAngle,
      axis.z * sinHalfAngle
    ]).normalize()
  }
  constructor({ w, x, y, z }: { w: number, x: number, y: number, z: number }) {
    super({ x, y, z })
    this.w = w
  }

  // Normalize the quaternion
  override normalize(): Quaternion {
    const magnitude = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
    return new Quaternion({
      w: this.w / magnitude,
      x: this.x / magnitude,
      y: this.y / magnitude,
      z: this.z / magnitude
    })
  }

  // Quaternion multiplication
  multiply(q: Quaternion): Quaternion {
    return new Quaternion({
      w: this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      x: this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      y: this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      z: this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    })
  }

  // Rotate a vector using this quaternion
  rotateVector(vector: Vector3): Vector3 {
    const qVector = Quaternion.fromVector(vector)
    const qConjugate = Quaternion.createQuaternion([this.w, -this.x, -this.y, -this.z])
    const result = this.multiply(qVector).multiply(qConjugate)
    return Vector3.createVector3([result.x, result.y, result.z])
  }
  static override zero: Quaternion = Quaternion.createQuaternion([1, 0, 0, 0])

}


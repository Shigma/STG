import { math } from '@stg/utils'
import config from './config'

/** a general point in Cartesian coordinate system */
export interface Point {
  /** x coordinate */
  x: number
  /** y coordinate */
  y: number
  /** polar radius */
  rho?: number
  /** polar angle (in the unit of `config.angleUnit`) */
  theta?: number
  /** point orientation (in the unit of `config.angleUnit`) */
  face?: number
}

/** a sub coordinate system in Cartesian coordinate system */
export default class Coordinate implements Point {
  static from(point: Point) {
    return new Coordinate(point.x, point.y, point.face)
  }

  static polar(rho: number, theta: number, face = 0) {
    return new Coordinate(
      rho * math.cos(theta * config.angleUnit),
      rho * math.sin(theta * config.angleUnit),
      face,
    )
  }
  
  public x: number
  public y: number
  public $birth?: number

  private _cos: number
  private _sin: number
  private _rho: number
  private _face: number
  private _thetaRadian: number
  
  constructor(x: number, y: number, face?: number) {
    this.x = x
    this.y = y
    this.face = face
  }

  get face(): number {
    return this._face
  }

  set face(value) {
    this._face = value || 0
    this._cos = math.cos(config.angleUnit * value || 0)
    this._sin = math.sin(config.angleUnit * value || 0)
  }

  get rho(): number {
    if (this._rho) return this._rho
    return this._rho = math.sqrt(this.x ** 2 + this.y ** 2)
  }

  get theta(): number {
    return this.thetaRadian / config.angleUnit
  }

  get thetaRadian() {
    if (typeof this._thetaRadian === 'number') return this._thetaRadian
    return this._thetaRadian = math.atan2(this.y, this.x)
  }

  orient(point: Point): Coordinate {
    return new Coordinate(
      this.x,
      this.y,
      this.locate(point).theta,
    )
  }

  rotate(rotate: number = 1): Coordinate {
    return new Coordinate(
      this.x,
      this.y,
      this.face + rotate,
    )
  }

  dist2(point: Point): number {
    return (this.x - point.x) ** 2 + (this.y - point.y) ** 2
  }

  resolve(point: Point): Coordinate
  resolve(x: number, y: number, face?: number): Coordinate
  resolve(...args: [any, any?, any?]) {
    let x: number, y: number, face: number
    if (typeof args[0] === 'object') {
      x = args[0].x
      y = args[0].y
      face = args[0].face
    } else {
      [x, y, face = 0] = args
    }
    return new Coordinate(
      this.x + x * this._cos - y * this._sin,
      this.y + x * this._sin + y * this._cos,
      this.face + face,
    )
  }

  locate(point: Point): Coordinate
  locate(x: number, y: number, face?: number): Coordinate
  locate(...args: [any, any?, any?]) {
    let x: number, y: number, face: number
    if (typeof args[0] === 'object') {
      x = args[0].x
      y = args[0].y
      face = args[0].face
    } else {
      [x, y, face = 0] = args
    }
    const dx = x - this.x, dy = y - this.y
    return new Coordinate(
      dx * this._cos + dy * this._sin,
      dy * this._cos - dx * this._sin,
      face - this.face,
    )
  }
}

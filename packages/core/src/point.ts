import config from './config'
import builtin from './template'
import { math } from '@stg/utils'
import { images } from './assets'
import { Wrapped } from './plugin'
import { EmitBulletsOptions } from './barrage'
import Coordinate, { Point } from './coordinate'
import Updater, { TaskHook, MountHook } from './updater'

export interface ImageTransform {
  scale?: number
  rotate?: number
  xOffset?: number
  yOffset?: number
}

export interface ImagePosition {
  xStart: number
  yStart: number
  xEnd: number
  yEnd: number
}

export interface PointOptions<T extends CanvasPoint = CanvasPoint> {
  state?: Wrapped<Record<string, any>>
  mounted?: MountHook<T & Record<string, any>>
  mutate?: TaskHook<T & Record<string, any>>
  display?: string | TaskHook<T & Record<string, any>>
  methods?: Record<string, (this: T & Record<string, any>, ...args: any[]) => any>
}

export type PointDirection = 'static' | 'leftward' | 'rightward'

/** a general point in the canvas */
export default class CanvasPoint extends Updater {
  public innerColor?: any
  public radiusX?: number
  public radiusY?: number
  public spin?: number

  /** @protected point position */
  protected _point: Point = { x: 0, y: 0, face: 0 }
  /** @protected current coordinate */
  protected _coordinate?: Coordinate
  /** @protected mounted hook */
  protected _mountedHook: MountHook<this>[]
  /** @protected mutate hook */
  protected _mutateHook: TaskHook<this>[]
  /** @protected display hook */
  protected _displayHook: TaskHook<this>

  /** @public judge radius */
  public judgeRadius?: number
  /** @public the radius of the point */
  public radius?: number
  /** @public the color of the point */
  public color?: any
  /** @public number of ticks since change to current display */
  public $displayTick?: number
  /** @public moving direction */
  public $direction?: PointDirection
  /** @public current action */
  public $action?: string
  /** @public number of ticks since change to current action */
  public $mappingTick?: number

  constructor(options: PointOptions = {}) {
    super()
    this._mountedHook = options.mounted ? [options.mounted] : []
    this._mutateHook = options.mutate ? [options.mutate] : []
    Object.assign(this, options.methods)
    const state = typeof options.state === 'function'
      ? options.state.call(this)
      : options.state
    Object.assign(this, state)
    if (!this.color) this.color = config.defaultColor

    // set initial display
    this.$display = options.display
    this.$mappingTick = 0
    this.$direction = 'static'
  }

  public get x() {
    return this._point.x
  }

  public get y() {
    return this._point.y
  }

  public get face() {
    return this._point.face
  }

  public set x(value) {
    this._point.x = value
    this._coordinate = null
  }

  public set y(value) {
    this._point.y = value
    this._coordinate = null
  }

  public set face(value) {
    this._point.face = value
    this._coordinate = null
  }

  get $player() {
    return this.$barrage.$refs.player
  }

  get $display() {
    return this._displayHook
  }

  set $display(value: string | TaskHook<this>) {
    if (typeof value === 'string') {
      const wrapper = builtin.display.resolve(value, this)
      if (wrapper.applied) wrapper.applied.call(this)
      this._displayHook = wrapper.display
    } else {
      this._displayHook = value
    }
    this.$displayTick = 0
  }

  drawTemplate(key: string, tick: number = 0) {
    builtin.display.resolve(key, this).display.call(this, tick)
  }

  _mounted() {
    this._mutateHook.forEach(hook => this.setTask(hook, 0))
    this._mountedHook.forEach(hook => hook.call(this))
  }

  update() {
    // update display tick
    if (this.$tick) this.$displayTick += 1

    // store previous position and status
    const lastX = this.$coord.x
    const lastMapping = this.$mapping

    // perform an update cycle
    super.update()

    // update action
    const sign = math.sign(this.$coord.x - lastX)
    this.$direction = sign ? sign > 0 ? 'rightward' : 'leftward' : 'static'
    const mapping = this.$mapping
    if (mapping !== lastMapping) {
      this.$mappingTick = 0
    } else if (this.$tick) {
      this.$mappingTick += 1
    }
  }

  get $mapping() {
    return this.$action || this.$direction
  }

  render() {
    if (!this.$context || typeof this._displayHook !== 'function') return
    this._displayHook.call(this, this.$displayTick)
  }

  get $coord(): Coordinate {
    if (!this._coordinate || this.$tick !== this._coordinate.$birth) {
      this._coordinate = Coordinate.from(this)
      this._coordinate.$birth = this.$tick
    }
    return this._coordinate
  }

  /** emit bullets from the barrage */
  emitBullets(bullet: EmitBulletsOptions): void
  emitBullets(end: number, bullet: EmitBulletsOptions): void
  emitBullets(start: number, end: number, bullet: EmitBulletsOptions): void
  emitBullets(start: number, end: number, step: number, bullet: EmitBulletsOptions): void
  emitBullets(...args: [any, any?, any?, any?]): void {
    // set temporary source
    this.$barrage.$refs.source = this
    this.$barrage.emitBullets(...args)
    delete this.$barrage.$refs.source
  }

  /** draw image from image assets */
  drawImage(image: string | ImageBitmap, transform: ImageTransform = {}, selector?: ImagePosition) {
    const { x, y, face } = this.$coord
    if (typeof image === 'string') {
      [ image ] = images.get(image)
    }
    const { xStart, xEnd, yStart, yEnd } = selector || {
      xStart: 0,
      yStart: 0,
      xEnd: image.width,
      yEnd: image.height,
    }
    const sw = xEnd - xStart
    const sh = yEnd - yStart
    const {
      scale = 1,
      xOffset = 0,
      yOffset = 0,
      rotate = this.spin === undefined ? face : this.spin,
    } = transform
    const dw = sw * scale
    const dh = sh * scale
    const dx = -(sw / 2 + xOffset) * scale
    const dy = -(sh / 2 + yOffset) * scale
    const sin = math.sin(config.angleUnit * rotate)
    const cos = math.cos(config.angleUnit * rotate)
    this.$context.setTransform(-sin, cos, -cos, -sin, x, y)
    this.$context.drawImage(image, xStart, yStart, sw, sh, dx, dy, dw, dh)
    this.$context.setTransform(1, 0, 0, 1, 0, 0)
  }

  fillCircle(fill = this.color, radius = this.radius): void {
    const { x, y } = this.$coord
    this.$context.beginPath()
    this.$context.arc(x, y, radius, 0, math.twoPI)
    this.$context.closePath()
    this.$context.fillStyle = fill.output ? fill.output() : fill
    this.$context.fill()
  }

  fillEllipse(
    stroke = this.color,
    fill = this.innerColor,
    radiusX = this.radiusX,
    radiusY = this.radiusY,
    rotation = this.face,
  ): void {
    const { x, y } = this.$coord
    this.$context.beginPath()
    this.$context.strokeStyle = stroke
    this.$context.lineWidth = 2
    this.$context.ellipse(x, y, radiusX, radiusY, rotation * config.angleUnit, 0, math.twoPI)
    this.$context.closePath()
    this.$context.stroke()
    this.$context.fillStyle = fill.output ? fill.output() : fill
    this.$context.fill()
  }

  getGradient(c1: any, r1: number, c2 = this.color, r2 = this.radius): CanvasGradient {
    const { x, y } = this.$coord
    const gradient = this.$context.createRadialGradient(x, y, r1, x, y, r2)
    gradient.addColorStop(0, c1.output ? c1.output() : c1)
    gradient.addColorStop(1, c2.output ? c2.output() : c2)
    return gradient
  }

  bezierCurve(...coords: number[]) {
    if (coords.length % 6 === 2) {
      const point = this.$coord.resolve(coords[0], coords[1])
      this.$context.moveTo(point.x, point.y)
    }
    for (let i = 0; i < coords.length; i += 6) {
      const point1 = this.$coord.resolve(coords[i], coords[i + 1])
      const point2 = this.$coord.resolve(coords[i + 2], coords[i + 3])
      const point3 = this.$coord.resolve(coords[i + 4], coords[i + 5])
      this.$context.bezierCurveTo(point1.x, point1.y, point2.x, point2.y, point3.x, point3.y)
    }
  }

  quadraticCurve(...coords: number[]) {
    if (coords.length % 4 === 2) {
      const point = this.$coord.resolve(coords[0], coords[1])
      this.$context.moveTo(point.x, point.y)
    }
    for (let i = 0; i < coords.length; i += 4) {
      const point1 = this.$coord.resolve(coords[i], coords[i + 1])
      const point2 = this.$coord.resolve(coords[i + 2], coords[i + 3])
      this.$context.quadraticCurveTo(point1.x, point1.y, point2.x, point2.y)
    }
  }

  /** serialize to JSON */
  protected toJSON() {
    const result: Partial<this> = {}
    for (const key in this) {
      if (typeof key === 'string' && key[0] !== '$' && key[0] !== '_' || key === '$tick') {
        result[key] = this[key]
      }
    }
    return result
  }
}

import { TaskHook, MountHook } from './updater'
import CanvasPoint, { Emitter } from './point'
import { AssetOptions } from './assets'
import { Point } from './coordinate'
import { math } from '@stg/utils'
import config from './config'
import Field from './field'

type BoolInt = 0 | 1
export type ControlMode = 'keyboard' | 'mouse'

type Listener = [
  EventTarget,
  string,
  (this: Player, event: Event) => any,
  boolean | AddEventListenerOptions
]

interface KeyState extends Record<string, BoolInt> {
  ArrowUp: BoolInt
  ArrowDown: BoolInt
  ArrowLeft: BoolInt
  ArrowRight: BoolInt
  Shift: BoolInt
}

export interface PlayerOptions {
  assets?: AssetOptions
  control?: ControlMode
  state?: PlayerState
  mounted?: MountHook<Player>
  mutate?: TaskHook<Player>
}

interface PlayerState {
  /** judge radius */
  judgeRadius?: number
  /** graze radius */
  grazeRadius?: number
  /** life count */
  lifeCount?: number
  /** bomb count */
  bombCount?: number
  /** high speed */
  highSpeed?: number
  /** low speed */
  lowSpeed?: number

  [key: string]: any
}

export default class Player extends CanvasPoint implements PlayerState, Emitter {
  public lifeCount: number
  public bombCount: number
  public highSpeed: number
  public lowSpeed: number
  public grazeRadius: number
  public $direction: number
  public $directionTick: number

  /** @public the control of the player */
  public readonly control: ControlMode

  /** @public parent field */
  public $parent: Field

  /** @private listeners */
  private _listeners: Listener[]
  /** @private mouse position */
  private _mouseState: Point
  /** @private keyboard state */
  private _keyState: KeyState

  constructor(options: PlayerOptions = {}) {
    options.state = {
      color: 'red',
      radius: 4,
      lifeCount: 8,
      judgeRadius: 3,
      grazeRadius: 24,
      bombCount: 0,
      highSpeed: 4.5,
      lowSpeed: 2,
      ...options.state,
    }
    super(options)
    this._listeners = []
    this.$directionTick = 0
    this.face = -config.angleUnit / math.twoPI
    this.control = options.control === undefined ? 'keyboard' : options.control
  }

  _mounted() {
    this.x = this.$context.canvas.width / 2
    this.y = this.$context.canvas.height / 8 * 7
    this._mountedHook.forEach(hook => hook.call(this))
    this.render()
    this.setTask(this._mutate)

    if (this.control === 'mouse') {
      this._mouseState = { x: 0, y: 0 }
      this.$parent.onMouseMove = event => {
        this._mouseState.x = event.clientX / this.$context.canvas.clientWidth * this.$context.canvas.width
        this._mouseState.y = event.clientY / this.$context.canvas.clientHeight * this.$context.canvas.height
        event.preventDefault()
        event.stopPropagation()
      }
    } else if (this.control === 'keyboard') {
      this._keyState = {
        ArrowUp: 0,
        ArrowDown: 0,
        ArrowLeft: 0,
        ArrowRight: 0,
        Shift: 0,
      }
      this._listen(window, 'keydown', (event: KeyboardEvent) => {
        if (!(event.key in this._keyState)) return
        this._keyState[event.key] = 1
        event.preventDefault()
        event.stopPropagation()
      })
      this._listen(window, 'keyup', (event: KeyboardEvent) => {
        if (!(event.key in this._keyState)) return
        this._keyState[event.key] = 0
        event.preventDefault()
        event.stopPropagation()
      })
    }
  }

  private _listen(
    target: EventTarget,
    type: string,
    listener: (event: Event) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    target.addEventListener(type, listener, options)
    this._listeners.push([target, type, listener, options])
  }

  private _mutate(tick: number) {
    this._mutateHook.forEach(hook => hook.call(this, tick))

    // store last position
    const lastX = this.x

    // update position
    if (this.control === 'mouse') {
      this.x = this._mouseState.x
      this.y = this._mouseState.y
    } else if (this.control === 'keyboard') {
      const v = (this._keyState.Shift ? this.lowSpeed : this.highSpeed) / Math.sqrt(
        (this._keyState.ArrowDown ^ this._keyState.ArrowUp) +
        (this._keyState.ArrowLeft ^ this._keyState.ArrowRight) || 1
      )
      this.x += v * this._keyState.ArrowRight
      this.x -= v * this._keyState.ArrowLeft
      this.y += v * this._keyState.ArrowDown
      this.y -= v * this._keyState.ArrowUp
    }

    // update direction
    const direction = Math.sign(this.x - lastX)
    if (direction === this.$direction) {
      this.$directionTick += 1
    } else {
      this.$directionTick = 0
      this.$direction = direction
    }

    // restrict postion to moving scope
    const { left, right, bottom, top } = this.$parent.movingScope
    if (this.x < left) this.x = left
    if (this.y < top) this.y = top
    if (this.x > right) this.x = right
    if (this.y > bottom) this.y = bottom
  }

  renderBelow() {
    if (!this.$context || typeof this._displayHook !== 'function') return
    this._displayHook.call(this, this.$displayTick)
  }

  renderAbove() {
    // draw judge point
    const gradient = this.getGradient('white', this.radius / 2)
    this.fillCircle(gradient)
  }

  destory() {
    this._listeners.forEach(([target, type, listener, options]) => {
      target.removeEventListener(type, listener, options)
    })
  }
}

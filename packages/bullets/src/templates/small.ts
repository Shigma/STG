import { BulletOptions } from '@stg/core'

export default {
  state: {
    radius: 6,
    judgeRadius: 4,
    innerRadius: 4,
    color: 'blue',
    innerColor: 'white',
  },
  display() {
    this.fillCircle(this.getGradient(this.innerColor, this.innerRadius))
  },
} as BulletOptions

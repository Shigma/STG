module.exports = {
  reference: {
    base: {
      state: {
        x: 240,
        y: 280,
        radius: 12,
        color: 'violet'
      }
    }
  },
  created() {
    this.setInterval(100, (time) => {
      this.emitBullets(8, (index) => ({
        extends: 'small',
        state: {
          rho: 12,
          outerR: 12,
          face: index / 4 + Math.sin(time / 1000),
          color: 'white',
          glColor: 'violet'
        },
        mutate(time, delta) {
          this.rho += (1 + time / 1000) * delta / 16
          this.polarLocate(this.rho, this.face)
        }
      }))
    })
  }
}

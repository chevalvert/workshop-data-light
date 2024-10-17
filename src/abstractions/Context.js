import * as MissingMath from 'missing-math'
import chroma from 'chroma-js'

export default class Context {
  PROPERTIES = {
    // Utils

    ...MissingMath,
    ...console,
    min: Math.min,
    max: Math.max,

    // Environment

    data: null,
    frameCount: 0,
    frameRate: 30,
    frames: 300,
    leds: [],
    ledCount: 0,

    // Color

    chroma,
    rgb: (r = 0, g = r, b = g = r) => chroma.rgb(r, g, b),
    hsl: (h = 360, s = 1, l = 1) => chroma.hsl(h, s, l),

    // Drawing

    clear: () => {
      this.leds = new Array(this.ledCount)
    },

    led: (index, color = this.rgb(), mixBlendMode = null) => {
      if (!color || !color._rgb) throw new Error('Unexpected color value')
      index = Math.round(index)
      if (index < 0 || index > this.leds.length) return

      if (mixBlendMode && this.leds[index]) this.leds[index] = chroma.blend(this.leds[index], color, mixBlendMode)._rgb
      else this.leds[index] = color._rgb
    },

    line: (from, to, color, mixBlendMode = null) => {
      const range = [from, to].sort((a, b) => a - b)
      for (let index = range[0]; index < range[1]; index++) {
        this.led(index, color, mixBlendMode)
      }
    },

    fill: (color = this.rgb(), mixBlendMode = null) => {
      this.line(0, this.ledCount, color, mixBlendMode)
    },

    gradient: (from, to, color1 = this.rgb(), color2 = color1, colorSpace = 'rgb', mixBlendMode = null) => {
      if (!color1 || !color1._rgb) throw new Error('Unexpected color value')
      if (!color2 || !color2._rgb) throw new Error('Unexpected color value')

      const range = [from, to].sort((a, b) => a - b)
      for (let index = range[0]; index < range[1]; index++) {
        const t = MissingMath.normalize(index, range[0], range[1])
        this.led(index, chroma.mix(color1, color2, t, colorSpace), mixBlendMode)
      }
    }
  }

  constructor () {
    for (const [prop, value] of Object.entries(this.PROPERTIES)) {
      makeGlobal(prop, value, this)
    }

    this.reset()
  }

  reset () {
    this.frameCount = 0
    this.clear()
  }

  render (ctx, offx = 0) {
    // Render stripled
    for (let i = 0; i < this.ledCount; i++) {
      const y = (this.ledCount - 1) - i
      const [r, g, b] = this.leds[i] ?? [0, 0, 0]
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(offx, y, 1, 1)
    }
  }
}

/**
 * Clone a context property onto the window context in a way that
 * setting/getting one property set/get the matching other
 */
function makeGlobal (key, initial, context) {
  Object.defineProperty(context, key, {
    get () { return window[key] },
    set (value) { window[key] = value }
  })

  Object.defineProperty(window, key, {
    set (value) { context['_' + key] = value },
    get () { return context['_' + key] }
  })

  context[key] = initial
}

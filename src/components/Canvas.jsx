import './Canvas.scss'

import { Component } from '@tooooools/ui'
import { ensure, writable } from '@tooooools/ui/state'

export default class Canvas extends Component {
  beforeRender (props) {
    this.state = {
      width: ensure(writable)(props.width),
      height: ensure(writable)(props.height)
    }
  }

  template (props) {
    return (
      <canvas class='canvas' />
    )
  }

  get width () { return this.base.width }
  get height () { return this.base.height }

  afterRender () {
    this.context = this.base.getContext('2d')
    this.state.width.subscribe(this.#onresize)
    this.state.height.subscribe(this.#onresize)
    this.#onresize()
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  #onresize = () => {
    this.base.width = this.state.width.get()
    this.base.height = this.state.height.get()
  }
}

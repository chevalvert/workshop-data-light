import './Scene.scss'
import { Component } from '@tooooools/ui'
import { writable } from '@tooooools/ui/state'

import Canvas from '/components/Canvas'

export default class Scene extends Component {
  state = {
    zoomed: writable(true)
  }

  template (props) {
    return (
      <section
        class={[
          'scene',
          { 'is-zoomed': this.state.zoomed }
        ]}
        event-click={this.state.zoomed.toggle}
      >
        <Canvas
          ref={this.ref('canvas')}
          width={1}
        />
      </section>
    )
  }

  update (context) {
    this.refs.canvas.clear()
    this.refs.canvas.state.height.set(context.ledCount)
    context.render(this.refs.canvas.context)
  }
}

/* global __REPOSITORY__ */
import './App.scss'

import slug from 'slug'
import { raf, fpsLimiter } from '@internet/raf'
import { Component } from '@tooooools/ui'
import { not, derived, writable } from '@tooooools/ui/state'
import { Button, Toolbar, Input, Modal } from '@tooooools/ui/components'

import * as Icons from '/data/icons'
import code from '/data/code.js?raw'
import rawPublicSvgAsset from '/favicons/icon.svg?raw'

import Context from '/abstractions/Context'

import write from '/controllers/write'

import Editor from '/components/Editor'
import Scene from '/components/Scene'

import noop from '/utils/noop'
import persist from '/utils/persist'
import confirm from '/utils/confirm'

export default class App extends Component {
  state = {
    error: writable(null),
    running: writable(false),
    frameCount: writable(0),
    dataMode: writable(false)
  }

  store = {
    code: persist(code.toString(), 'code'),
    data: persist('export default {}', 'data'),

    title: persist('Sans titre', 'title'),
    author: persist('Inconnu', 'author'),
    description: persist('', 'description'),
    credits: persist('', 'credits'),
    frames: persist(300, 'frames'),
    frameRate: persist(30, 'frameRate'),
    ledCount: writable(+(import.meta.env.VITE_LED_COUNT ?? 0))
  }

  tick = noop
  context = new Context()
  __module = noop

  template () {
    return (
      <main
        class={[
          'app',
          {
            'is-running': this.state.running,
            'has-error': this.state.error
          }
        ]}
      >
        <header class='app__header'>
          <h1 class='app__title'>
            <span class='app__logo' innerHTML={rawPublicSvgAsset} />
            <span>{document.title}</span>
          </h1>

          <a
            innerHTML={Icons.github}
            href={__REPOSITORY__}
            target='_blank'
            rel='noreferrer'
          />
        </header>

        <Editor
          class={['editor-code', { 'is-active': not(this.state.dataMode) }]}
          ref={this.ref('editor')}
          lint
          globals={Object.keys(this.context.PROPERTIES)}
          content={this.store.code}
        />

        <Editor
          class={['editor-data', { 'is-active': this.state.dataMode }]}
          ref={this.ref('data')}
          content={this.store.data}
        />

        <Scene ref={this.ref('scene')} />

        <footer class='app__footer'>
          <Toolbar>
            <Button
              class='data-code-toggler'
              icon={derived(this.state.dataMode, d => d ? Icons.data : Icons.code)}
              label={derived(this.state.dataMode, d => d ? 'data' : 'code')}
              event-click={this.state.dataMode.toggle}
            />

            <Toolbar>
              <Toolbar compact>
                <Button
                  icon={derived(this.state.running, r => r ? Icons.stop : Icons.play)}
                  event-click={e => {
                    this.state.running.get() ? this.stop() : this.#oncode()
                  }}
                  active={this.state.running}
                />
                <Input class='readonly' type='number' value={this.state.frameCount} active={this.state.running} />
                <Input type='number' label='/' titles='frames' value={this.store.frames} active={this.state.running} />
              </Toolbar>

              <Input
                type='number'
                label='fps'
                value={this.store.frameRate}
                min={0}
                max={30} // BUG
              />
            </Toolbar>
          </Toolbar>

          <Toolbar>
            <Button
              icon={Icons.trash}
              title='Commencer un nouveau programme'
              event-click={e => confirm(() => {
                this.refs.data.clear('export default {}')
                this.refs.editor.clear(code.toString())
              }, {
                title: 'Commencer un nouveau programme ?',
                message: 'Tout votre programme et toutes vos données seront perdues.',
                confirm: {
                  label: 'effacer'
                }
              })}
            />

            <Button
              icon={Icons.save}
              event-click={this.export.bind(this)}
            />
          </Toolbar>
        </footer>
      </main>
    )
  }

  afterRender () {
    // These signals will be reflected into their matching context property
    for (const prop of [
      'ledCount',
      'frames',
      'frameRate'
    ]) {
      const handler = this.createContextPropHandler(prop)
      this.store[prop].subscribe(handler)
      handler(this.store[prop].get())
    }

    this.store.frames.subscribe(this.#oncode)
    this.store.frameRate.subscribe(this.#oncode)
    this.store.code.subscribe(this.#oncode)
    this.store.data.subscribe(this.#ondata)

    // Do not execute code right away in safe mode
    if (window.location.hash === '#safe') return
    this.#ondata()
    this.#oncode()
  }

  createContextPropHandler (key) {
    return value => {
      this.context[key] = value
      this.context.reset()
    }
  }

  reset () {
    this.state.error.set(null)
    this.context.reset()
  }

  start () {
    this.reset()
    raf.add(this.tick)
    this.state.running.set(true)
  }

  stop () {
    raf.remove(this.tick)
    this.state.running.set(false)
  }

  export () {
    let modal

    this.render((
      <Modal
        title='Exporter l’animation'
        class='app__export'
        ref={t => { modal = t }}
      >
        <fieldset>
          <Input type='text' label='titre' value={this.store.title} />
          <Input type='text' label='auteur·ice' value={this.store.author} />
          <textarea
            value={this.store.description}
            event-input={e => this.store.description.set(e.target.value)}
            rows='4'
            placeholder='description'
          />
          <textarea
            value={this.store.credits}
            event-input={e => this.store.credits.set(e.target.value)}
            rows='2'
            placeholder='crédits'
          />
        </fieldset>

        <footer>
          <Button
            icon={Icons.save}
            label='exporter'
            event-click={async () => {
              await write({
                context: this.context,
                setup: this._module.setup ?? noop,
                draw: this._module.draw ?? this._module.default ?? noop,
                title: this.store.title.get(),
                author: this.store.author.get(),
                description: this.store.description.get(),
                credits: this.store.credits.get(),
                filename: slug(this.store.title.get()) + '.png'
              })
              modal?.destroy()
            }}
          />
        </footer>
      </Modal>
    ), document.body)
  }

  #ondata = async () => {
    const signature = this.store.data.get()
    const m = await import('data:text/javascript;base64,' + btoa(signature) /* @vite-ignore */)
    try {
      this.context.data = m.default
    } catch (error) {
      this.state.dataMode.set(true)
      this.#onerror(error)
    }
  }

  #oncode = async () => {
    const cacheBust = `/* ${Date.now()} */\n`
    const signature = cacheBust + this.store.code.get()
    this.stop()

    try {
      // TODO[next] use worker to run module code, measure execution time and
      // kill if too long (ie infinite loop)
      // SEE https://github.com/dtao/lemming.js
      this._module = await import('data:text/javascript;base64,' + btoa(signature) /* @vite-ignore */)

      this.tick = fpsLimiter(this.context.frameRate, dt => {
        this.state.frameCount.set(this.context.frameCount)
        if (this.context.frameCount >= this.context.frames) return this.stop()

        try {
          ;(this._module.draw ?? this._module.default ?? noop)(dt)
          this.context.frameCount++
          this.refs.scene.update(this.context)
        } catch (error) {
          this.#onerror(error)
        }
      })

      if (import.meta.env.PROD) console.clear()

      // Run setup and update scene
      this.reset()
      ;(this._module.setup ?? noop)()
      this.refs.scene.update(this.context)

      // Start only if draw call exists
      if (this._module.draw ?? this._module.default) this.start()
    } catch (error) {
      this.#onerror(error)
    }
  }

  #onerror = error => {
    this.stop()
    if (import.meta.env.PROD) console.clear()
    this.state.error.set(error)
    console.error(error)
  }
}

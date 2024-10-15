import './Editor.scss'
import { Component } from '@tooooools/ui'
import { writable, ensure } from '@tooooools/ui/state'

import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { javascript, esLint } from '@codemirror/lang-javascript'
import { lintGutter, linter } from '@codemirror/lint'
import globals from 'globals'
import * as eslint from 'eslint-linter-browserify'
import { dracula } from 'thememirror'

export default class Editor extends Component {
  beforeRender (props) {
    this.state = {
      content: ensure(writable)(props.content, '')
    }
  }

  template (props) {
    return (
      <section class={['editor', ...(Array.isArray(props.class) ? props.class : [props.class])]}>
        <div class='editor__view' ref={this.ref('view')} />
      </section>
    )
  }

  afterRender (props) {
    this.refs.editor = new EditorView({
      doc: this.state.content.get(),
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
        lintGutter(),
        linter(esLint(new eslint.Linter(), {
          languageOptions: {
            globals: {
              ...globals.browser,
              ...(props.globals ?? []).reduce((acc, key) => {
                acc[key] = 'readonly'
                return acc
              }, {})
            }
          },
          rules: {
            'constructor-super': 'error',
            'for-direction': 'error',
            'getter-return': 'error',
            'no-async-promise-executor': 'error',
            'no-case-declarations': 'error',
            'no-class-assign': 'error',
            'no-compare-neg-zero': 'error',
            'no-cond-assign': 'error',
            'no-const-assign': 'error',
            'no-constant-binary-expression': 'error',
            'no-constant-condition': 'error',
            'no-control-regex': 'error',
            'no-debugger': 'error',
            'no-delete-var': 'error',
            'no-dupe-args': 'error',
            'no-dupe-class-members': 'error',
            'no-dupe-else-if': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty': 'error',
            'no-empty-character-class': 'error',
            'no-empty-pattern': 'error',
            'no-empty-static-block': 'error',
            'no-ex-assign': 'error',
            'no-extra-boolean-cast': 'error',
            'no-fallthrough': 'error',
            'no-func-assign': 'error',
            'no-global-assign': 'error',
            'no-import-assign': 'error',
            'no-invalid-regexp': 'error',
            'no-irregular-whitespace': 'error',
            'no-loss-of-precision': 'error',
            'no-misleading-character-class': 'error',
            'no-new-native-nonconstructor': 'error',
            'no-nonoctal-decimal-escape': 'error',
            'no-obj-calls': 'error',
            'no-octal': 'error',
            'no-prototype-builtins': 'error',
            'no-redeclare': 'error',
            'no-regex-spaces': 'error',
            'no-self-assign': 'error',
            'no-setter-return': 'error',
            'no-shadow-restricted-names': 'error',
            'no-sparse-arrays': 'error',
            'no-this-before-super': 'error',
            'no-undef': 'error',
            'no-unexpected-multiline': 'error',
            'no-unreachable': 'error',
            'no-unsafe-finally': 'error',
            'no-unsafe-negation': 'error',
            'no-unsafe-optional-chaining': 'error',
            'no-unused-labels': 'error',
            'no-unused-private-class-members': 'error',
            'no-unused-vars': 'error',
            'no-useless-backreference': 'error',
            'no-useless-catch': 'error',
            'no-useless-escape': 'error',
            'no-with': 'error',
            'require-yield': 'error',
            'use-isnan': 'error',
            'valid-typeof': 'error'
          }
        })),
        dracula,
        EditorView.updateListener.of(update => {
          if (!update.docChanged) return
          this.state.content.set(update.state.doc.toString())
        })
      ],
      parent: this.refs.view
    })
  }

  clear (insert = this.state.content.initial) {
    this.refs.editor.dispatch({
      changes: {
        insert,
        from: 0,
        to: this.refs.editor.state.doc.length
      }
    })
  }

  beforeDestroy () {
    this.refs.editor?.destroy()
  }
}

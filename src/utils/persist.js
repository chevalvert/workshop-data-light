/* global localStorage, __NAME__, __VERSION__ */
import { writable } from '@tooooools/ui/state'

const NS = `${__NAME__}@${__VERSION__}__`

export default function (value, key, {
  encode = JSON.stringify,
  decode = value => { try { return JSON.parse(value) } catch { return value } }
} = {}) {
  const item = localStorage.getItem(NS + key)
  const signal = writable(item ? decode(item) : value)

  if (item === null) localStorage.setItem(NS + key, encode(signal.current))

  signal.persist = value => localStorage.setItem(NS + key, encode(value))
  signal.subscribe(signal.persist)
  signal.clear = () => localStorage.removeItem(NS + key)

  return signal
}

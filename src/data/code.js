export function setup () {
  log('hello world')
}

export function draw () {
  clear()
  led(frameCount, rgb(255))
}

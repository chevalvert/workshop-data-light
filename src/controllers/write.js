/* global Blob, __REPOSITORY__ */
import FileSaver from 'file-saver'
import { addMetadataFromBase64DataURI } from 'meta-png'
import noop from '/utils/noop'

export default async ({
  context,
  setup = noop,
  draw = noop,
  title = 'untitled',
  author = 'unknown',
  credits = '',
  description = '0',
  filename = Date.now() + '.png'
} = {}) => {
  // TODO OffscreenCanvas + worker

  context.reset()

  const canvas = document.createElement('canvas')
  canvas.width = context.frames
  canvas.height = context.ledCount
  const ctx = canvas.getContext('2d')

  setup()
  for (let x = 0; x < canvas.width; x++) {
    context.frameCount = x
    draw()
    context.render(ctx, x)
  }

  let dataURL = canvas.toDataURL('image/png')

  dataURL = addMetadataFromBase64DataURI(dataURL, 'Title', title)
  dataURL = addMetadataFromBase64DataURI(dataURL, 'Author', author)
  dataURL = addMetadataFromBase64DataURI(dataURL, 'Description', description)
  dataURL = addMetadataFromBase64DataURI(dataURL, 'Software', __REPOSITORY__)
  dataURL = addMetadataFromBase64DataURI(dataURL, 'Comment', `@${context.frameRate}fps`)
  dataURL = addMetadataFromBase64DataURI(dataURL, 'Copyright', credits)

  return write(filename, { dataURL })
}

function write (filename, { dataURL, blob, url, json } = {}) {
  if (json) {
    const string = JSON.stringify(json, null, 2)
    blob = new Blob([string], { mimetype: 'application/json' })
  }

  if (dataURL) {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    blob = new Blob([u8arr], { type: mime })
  }

  return FileSaver.saveAs(blob ?? url, filename)
}

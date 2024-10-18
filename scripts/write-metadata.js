#!/usr/bin/node

/* global Buffer */
const fs = require('fs')
const path = require('path')
const prompt = require('prompt')
const { addMetadata } = require('meta-png')
const { repository } = require('../package.json')

prompt.message = null
prompt.delimiter = ' →'

const file = path.resolve(process.cwd(), process.argv[2])
let dataURL = Buffer.from(fs.readFileSync(file))

;(async () => {
  prompt.start()
  const {
    title = 'Untitled',
    author = 'Unknown',
    description = '',
    frameRate = '30',
    credits = ''
  } = await prompt.get([
    'title',
    'author',
    'description',
    'frame rate',
    'credits'
  ])

  // WARNING: could not update tEXT chunks, only add new ones
  dataURL = addMetadata(dataURL, 'Title', title)
  dataURL = addMetadata(dataURL, 'Author', author)
  dataURL = addMetadata(dataURL, 'Description', description)
  dataURL = addMetadata(dataURL, 'Software', repository.url + '/write-metadata')
  dataURL = addMetadata(dataURL, 'Comment', `@${frameRate}fps`)
  dataURL = addMetadata(dataURL, 'Copyright', credits)

  fs.writeFileSync(file, dataURL)
})()

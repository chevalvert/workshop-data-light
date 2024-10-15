import circle from 'iconoir/icons/circle.svg?raw'

export const color = fill => {
  const stroke = fill === '#FFFFFF' ? 'var(--ui-color-text-dim)' : null
  return circle.replace(/stroke=".*?"/gi, `stroke="${stroke}" fill="${fill}"`)
}

export { default as help } from 'iconoir/icons/regular/question-mark.svg?raw'
export { default as close } from 'iconoir/icons/regular/xmark.svg?raw'
export { default as trash } from 'iconoir/icons/regular/trash.svg?raw'
export { default as play } from 'iconoir/icons/regular/refresh.svg?raw'
export { default as stop } from 'iconoir/icons/regular/pause.svg?raw'
export { default as new } from 'iconoir/icons/empty-page.svg?raw'
export { default as ok } from 'iconoir/icons/regular/check.svg?raw'
export { default as settings } from 'iconoir/icons/regular/settings.svg?raw'
export { default as github } from 'iconoir/icons/regular/git-fork.svg?raw'
export { default as save } from 'iconoir/icons/regular/floppy-disk.svg?raw'
export { default as code } from 'iconoir/icons/regular/code.svg?raw'
export { default as data } from 'iconoir/icons/regular/database.svg?raw'

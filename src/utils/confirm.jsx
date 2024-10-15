import { render } from '@tooooools/ui'
import Confirm from '/components/Confirm'

export default async (action, props = {}) => {
  const confirmed = await new Promise(resolve => {
    render(
      <Confirm event-close={resolve} event-input={resolve} {...props}>
        {(typeof props.message === 'string'
          ? <div innerHTML={props.message} />
          : props.message
        )}
      </Confirm>
    )
  })

  if (confirmed) return action()
}

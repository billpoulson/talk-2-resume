import { MatTabChangeEvent } from '@angular/material/tabs'
import { IDefferedActivationCapable } from '@talk2resume/types'

export function activateSelectedTab(
  componentsByIndex: Array<IDefferedActivationCapable | undefined>,
  event: MatTabChangeEvent
) {
  componentsByIndex[event.index]?.activate?.()
}

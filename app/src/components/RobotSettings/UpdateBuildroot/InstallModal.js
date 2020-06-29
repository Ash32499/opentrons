// @flow
import { AlertModal } from '@opentrons/components'
import * as React from 'react'

import type {
  BuildrootUpdateSession,
  RobotSystemType,
} from '../../../buildroot/types'
import type { ViewableRobot } from '../../../discovery/types'
import { InstallModalContents } from './InstallModalContents'

export type InstallModalProps = {|
  robot: ViewableRobot,
  robotSystemType: RobotSystemType | null,
  session: BuildrootUpdateSession,
  close: () => mixed,
|}

export function InstallModal(props: InstallModalProps): React.Node {
  const { session, close, robotSystemType } = props
  const buttons = []

  if (session.step === 'finished' || session.error !== null) {
    buttons.push({ children: 'close', onClick: close })
  }

  let heading: string
  if (robotSystemType === 'balena') {
    if (
      session.step === 'premigration' ||
      session.step === 'premigrationRestart'
    ) {
      heading = 'Robot Update: Step 1 of 2'
    } else {
      heading = 'Robot Update: Step 2 of 2'
    }
  } else if (robotSystemType === 'buildroot') {
    heading = 'Robot Update'
  }

  return (
    <AlertModal
      heading={heading}
      buttons={buttons}
      restrictOuterScroll={false}
      alertOverlay
    >
      <InstallModalContents
        robotSystemType={robotSystemType}
        session={session}
      />
    </AlertModal>
  )
}

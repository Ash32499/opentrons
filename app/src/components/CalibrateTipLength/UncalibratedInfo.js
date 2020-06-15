// @flow
import * as React from 'react'
import { useDispatch } from 'react-redux'

import { PrimaryButton } from '@opentrons/components'
import { CalibrationInfoContent } from '../CalibrationInfoContent'
import type { CalibrateTipLengthProps } from './types'

const IS_CALIBRATED = 'Pipette tip height is calibrated'
const IS_NOT_CALIBRATED = 'Pipette tip height is not calibrated'
const CALIBRATE_TIP_LENGTH = 'Calibrate tip length'
const RECALIBRATE_TIP_LENGTH = 'Re-Calibrate tip length'
const CONTINUE = 'Continue to labware setup'

export function UncalibratedInfo(props: CalibrateTipLengthProps): React.Node {
  const { mount, probed } = props
  const [showClearDeck, setShowClearDeck] = React.useState(false)
  const dispatch = useDispatch<Dispatch>()

  const handleStart = () => {
    console.log('TODO: start tip length cal session')
  }

  const leftChildren = (
    <div>
      <p>{!probed ? IS_NOT_CALIBRATED : IS_CALIBRATED}</p>
      <PrimaryButton onClick={handleStart}>
        {!probed ? CALIBRATE_TIP_LENGTH : RECALIBRATE_TIP_LENGTH}
      </PrimaryButton>
    </div>
  )

  return <CalibrationInfoContent leftChildren={leftChildren} />
}

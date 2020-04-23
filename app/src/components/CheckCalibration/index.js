// @flow
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalPage } from '@opentrons/components'
import type { State, Dispatch } from '../../types'
import {
  fetchRobotCalibrationCheckSession,
  deleteRobotCalibrationCheckSession,
  getRobotCalibrationCheckSession,
  CHECK_STEP_SESSION_STARTED,
  CHECK_STEP_LABWARE_LOADED,
  CHECK_STEP_PREPARING_PIPETTE,
  CHECK_STEP_INSPECTING_TIP,
  CHECK_STEP_CHECKING_POINT_ONE,
  CHECK_STEP_CHECKING_POINT_TWO,
  CHECK_STEP_CHECKING_POINT_THREE,
  CHECK_STEP_CHECKING_HEIGHT,
  CHECK_STEP_SESSION_EXITED,
  CHECK_STEP_BAD_ROBOT_CALIBRATION,
  CHECK_STEP_NO_PIPETTES_ATTACHED,
} from '../../calibration'
import { RIGHT, LEFT } from '../../pipettes'
import { createLogger } from '../../logger'

import { Introduction } from './Introduction'
import { DeckSetup } from './DeckSetup'
import { TipPickUp } from './TipPickUp'
import { CompleteConfirmation } from './CompleteConfirmation'
import styles from './styles.css'

const AXIS_BY_MOUNT = { left: 'z', right: 'a' }
const log = createLogger(__filename)

const ROBOT_CALIBRATION_CHECK_SUBTITLE = 'Check deck calibration'

type CheckCalibrationProps = {|
  robotName: string,
  closeCalibrationCheck: () => mixed,
|}
export function CheckCalibration(props: CheckCalibrationProps) {
  const { robotName, closeCalibrationCheck } = props
  const dispatch = useDispatch<Dispatch>()

  const { currentStep, nextSteps, labware, instruments } =
    useSelector((state: State) =>
      getRobotCalibrationCheckSession(state, robotName)
    ) || {}
  React.useEffect(() => {
    dispatch(fetchRobotCalibrationCheckSession(robotName))
  }, [dispatch, robotName])

  const [activeMount, setActiveMount] = React.useState(RIGHT)

  const activeInstrumentId = React.useMemo(() => (
    instruments && Object.keys(instruments).find((id) => instruments[id].mount_axis === AXIS_BY_MOUNT[activeMount])
  ), [instruments, activeMount])
  const activeLabware = React.useMemo(() => (
    labware && labware.find(l => (
      l.forPipettes.includes(activeInstrumentId)
    ))
  ), [labware, activeInstrumentId])

  function exit() {
    dispatch(deleteRobotCalibrationCheckSession(robotName))
    closeCalibrationCheck()
  }

  let stepContents
  let modalContentsClassName = styles.modal_contents

  switch (currentStep) {
    case CHECK_STEP_SESSION_STARTED: {
      stepContents = (
        <Introduction
          exit={exit}
          labwareLoadNames={labware.map(l => l.loadName)}
        />
      )
      break
    }
    case CHECK_STEP_LABWARE_LOADED: {
      stepContents = <DeckSetup labware={labware} />
      modalContentsClassName = styles.page_content_dark
      break
    }
    case CHECK_STEP_PREPARING_PIPETTE: {
      stepContents = activeInstrumentId && activeLabware ? (
        <TipPickUp
          tiprack={activeLabware}
          pipette={instruments[activeInstrumentId]}
        />
      ) : null
      break
    }
    case CHECK_STEP_INSPECTING_TIP:
    case CHECK_STEP_CHECKING_POINT_ONE:
    case CHECK_STEP_CHECKING_POINT_TWO:
    case CHECK_STEP_CHECKING_POINT_THREE:
    case CHECK_STEP_CHECKING_HEIGHT:
    case CHECK_STEP_SESSION_EXITED:
    case CHECK_STEP_BAD_ROBOT_CALIBRATION:
    case CHECK_STEP_NO_PIPETTES_ATTACHED: {
      stepContents = <CompleteConfirmation robotName={robotName} exit={exit} />
      modalContentsClassName = styles.terminal_modal_contents
      break
    }
    default: {
      // TODO: BC next, this null state is visible when either:
      // 1. session accession errors
      // 2. session accession is loading
      // both should probably be handled with some sort of UI
      // affordance in the future.
      stepContents = null
    }
  }

  return (
    <ModalPage
      titleBar={{
        title: ROBOT_CALIBRATION_CHECK_SUBTITLE,
        back: { onClick: exit },
      }}
      contentsClassName={modalContentsClassName}
    >
      {stepContents}
    </ModalPage>
  )
}

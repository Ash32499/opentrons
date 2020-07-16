// @flow
import * as React from 'react'
import {
  Box,
  Flex,
  PrimaryButton,
  Text,
  ALIGN_CENTER,
  ALIGN_FLEX_START,
  BORDER_SOLID_LIGHT,
  DIRECTION_COLUMN,
  FONT_SIZE_BODY_2,
  JUSTIFY_CENTER,
  POSITION_RELATIVE,
  SPACING_2,
  SPACING_3,
  TEXT_ALIGN_CENTER,
} from '@opentrons/components'
import { getLabwareDisplayName } from '@opentrons/shared-data'

import type { JogAxis, JogDirection, JogStep } from '../../http-api-client'
import { getLatestLabwareDef } from '../../getLabware'
import { JogControls } from '../JogControls'
import type { CalibrateTipLengthChildProps } from './types'
import styles from './styles.css'

// TODO: put these assets in a shared location?
import multiDemoAsset from '../CheckCalibration/videos/A1_Multi_Channel_REV1.webm'
import singleDemoAsset from '../CheckCalibration/videos/A1_Single_Channel_REV1.webm'

const TIP_PICK_UP_HEADER = 'Position pipette over '
const TIP_PICK_UP_BUTTON_TEXT = 'Pick up tip'

const SINGLE_JOG_UNTIL_AT = 'Jog pipette until nozzle is centered above the'
const MULTI_JOG_UNTIL_AT = 'Jog pipette until the channel nozzle'
const CLOSEST = 'closest'
const TO_YOU_IS_CENTERED = 'to you is centered above the'
const POSITION = 'position'
const AND = 'and'
const FLUSH = 'flush'
const WITH_TOP_OF_TIP = 'with the top of the tip.'
const TIP_WELL_NAME = 'A1'

const ASSET_MAP = {
  multi: multiDemoAsset,
  single: singleDemoAsset,
}
export function TipPickUp(props: CalibrateTipLengthChildProps): React.Node {
  // TODO: get real isMulti and tiprack from the session
  const { mount, session } = props
  const tiprackID =
    session.details.instruments[mount.toLowerCase()]['tiprack_id']
  const tiprack = session.details.labware.find(l => l.id === tiprackID)
  const isMulti = true

  const tiprackDef = React.useMemo(
    () => getLatestLabwareDef(tiprack?.loadName),
    [tiprack]
  )

  const demoAsset = ASSET_MAP[isMulti ? 'multi' : 'single']

  const jogUntilAbove = isMulti ? (
    <>
      {MULTI_JOG_UNTIL_AT}
      <b>&nbsp;{CLOSEST}&nbsp;</b>
      {TO_YOU_IS_CENTERED}
    </>
  ) : (
    SINGLE_JOG_UNTIL_AT
  )

  const pickUpTip = () => {
    console.log('TODO: wire up command')
    // props.sendSessionCommand('pickUpTip')
  }

  const jog = (axis: JogAxis, dir: JogDirection, step: JogStep) => {
    console.log('TODO: wire up jog with params', axis, dir, step)
    // props.sendSessionCommand('jog',{
    //   vector: formatJogVector(axis, direction, step),
    // }, {})
  }

  return (
    <>
      <Flex
        marginY={SPACING_2}
        flexDirection={DIRECTION_COLUMN}
        alignItems={ALIGN_FLEX_START}
        position={POSITION_RELATIVE}
        width="100%"
      >
        <h3 className={styles.intro_header}>
          {TIP_PICK_UP_HEADER}
          {tiprackDef
            ? getLabwareDisplayName(tiprackDef).replace('µL', 'uL')
            : null}
        </h3>
        <Box
          padding={SPACING_3}
          border={BORDER_SOLID_LIGHT}
          borderWidth="2px"
          width="100%"
        >
          <Flex
            justifyContent={JUSTIFY_CENTER}
            flexDirection={DIRECTION_COLUMN}
            alignItems={ALIGN_CENTER}
            textAlign={TEXT_ALIGN_CENTER}
          >
            <Text
              fontSize={FONT_SIZE_BODY_2}
              marginBottom={SPACING_3}
              paddingX={SPACING_2}
            >
              {jogUntilAbove}
              <b>&nbsp;{TIP_WELL_NAME}&nbsp;</b>
              {POSITION}
              &nbsp;
              {AND}
              <b>&nbsp;{FLUSH}&nbsp;</b>
              {WITH_TOP_OF_TIP}
            </Text>
            <div className={styles.step_check_video_wrapper}>
              <video
                key={demoAsset}
                className={styles.step_check_video}
                autoPlay={true}
                loop={true}
                controls={false}
              >
                <source src={demoAsset} />
              </video>
            </div>
          </Flex>
        </Box>
        <div>
          <JogControls jog={jog} />
        </div>
        <Flex width="100%">
          <PrimaryButton onClick={pickUpTip} className={styles.command_button}>
            {TIP_PICK_UP_BUTTON_TEXT}
          </PrimaryButton>
        </Flex>
      </Flex>
    </>
  )
}

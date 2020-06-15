// @flow
import type { State } from '../types'
import * as Calibration from '../calibration'
import * as Constants from './constants'
import * as Types from './types'

export const getRobotSessions: (
  state: State,
  robotName: string
) => Types.SessionsById | null = (state, robotName) =>
  state.sessions[robotName]?.robotSessions ?? null

export const getRobotSessionById: (
  state: State,
  robotName: string,
  sessionId: string
) => Types.Session | null = (state, robotName, sessionId) => {
  return (getRobotSessions(state, robotName) || {})[sessionId] ?? null
}

export function getRobotSessionOfType<T: Types.Session>(
  state: State,
  robotName: string,
  sessionType: Types.SessionType
): T | null {
  const sessionsById = getRobotSessions(state, robotName) || {}
  const foundSessionId =
    Object.keys(sessionsById).find(
      id => sessionsById[id].sessionType === sessionType
    ) ?? null
  return foundSessionId ? sessionsById[foundSessionId] : null
}

export const getAnalyticsPropsForRobotSessionById: (
  state: State,
  robotName: string,
  sessionId: string
) => Types.SessionAnalyticsProps | null = (state, robotName, sessionId) => {
  const session = getRobotSessionById(state, robotName, sessionId)
  if (!session) return null

  if (session.sessionType === Constants.SESSION_TYPE_CALIBRATION_CHECK) {
    // $FlowFixMe (bc, 2020-6-10) we know that this property exists in a session of this type, but flow doesn't
    const { instruments, comparisonsByStep } = session.details
    const initialModelsByMount: $Shape<Types.AnalyticsModelsByMount> = {}
    const modelsByMount: Types.AnalyticsModelsByMount = Object.keys(
      instruments
    ).reduce(
      (acc: Types.AnalyticsModelsByMount, mount: string) => ({
        ...acc,
        [`${mount.toLowerCase()}PipetteModel`]: instruments[mount].model,
      }),
      initialModelsByMount
    )
    const initialStepData: $Shape<Types.CalibrationCheckAnalyticsData> = {}
    // $FlowFixMe (bc, 2020-6-10) we know that this property exists in a session of this type, but flow doesn't
    const normalizedStepData = Object.keys(comparisonsByStep).reduce(
      (
        acc: Types.CalibrationCheckAnalyticsData,
        stepName: Calibration.RobotCalibrationCheckStep
      ) => {
        const {
          differenceVector,
          thresholdVector,
          exceedsThreshold,
          transformType,
        } = comparisonsByStep[stepName]
        return {
          ...acc,
          [`${stepName}DifferenceVector`]: differenceVector,
          [`${stepName}ThresholdVector`]: thresholdVector,
          [`${stepName}ExceedsThreshold`]: exceedsThreshold,
          [`${stepName}ErrorSource`]: transformType,
        }
      },
      initialStepData
    )
    return {
      sessionType: session.sessionType,
      ...modelsByMount,
      ...normalizedStepData,
    }
  } else {
    // the exited session type doesn't report to analytics
    return null
  }
}

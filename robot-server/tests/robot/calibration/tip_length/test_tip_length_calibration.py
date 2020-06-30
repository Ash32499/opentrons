import pytest
from unittest.mock import MagicMock
from typing import List, Tuple, Dict
from opentrons.types import Mount, Point
from opentrons.hardware_control import pipette

from robot_server.robot.calibration.tip_length.user_flow import \
    TipCalibrationUserFlow

stub_jog_data = {'vector': Point(1, 1, 1)}

valid_commands: List[Tuple[str, str, str, Dict]] = [
  ('load_labware', 'sessionStarted', 'labwareLoaded', {}),
  ('move_to_measure_nozzle_offset', 'labwareLoaded',
   'measuringNozzleOffset', {}),
  ('jog', 'measuringNozzleOffset', 'measuringNozzleOffset', stub_jog_data),
  ('save_nozzle_position', 'measuringNozzleOffset', 'preparingPipette', {}),
  ('jog', 'preparingPipette', 'preparingPipette', stub_jog_data),
  ('pick_up_tip', 'preparingPipette', 'preparingPipette', {}),
  ('invalidate_tip', 'preparingPipette', 'preparingPipette', {}),
  ('confirm_tip_attached', 'preparingPipette', 'measuringTipOffset', {}),
  ('jog', 'measuringTipOffset', 'measuringTipOffset', stub_jog_data),
  ('save_tip_position', 'measuringTipOffset', 'calibrationComplete', {}),
  ('exit_session', 'calibrationComplete', 'sessionExited', {}),
  ('exit_session', 'sessionStarted', 'sessionExited', {}),
  ('exit_session', 'labwareLoaded', 'sessionExited', {}),
  ('exit_session', 'measuringNozzleOffset', 'sessionExited', {}),
  ('exit_session', 'preparingPipette', 'sessionExited', {}),
  ('exit_session', 'measuringTipOffset', 'sessionExited', {}),
]


@pytest.fixture
def mock_user_flow(hardware):
    mock_hw_pipette = pipette.Pipette(
      model="p300_single_v2.0",
      inst_offset_config={'single': [0, 0, 0], 'multi': [0, 0, 0]},
    )
    hardware.attached_instruments = {
      Mount.RIGHT: mock_hw_pipette
    }

    async def async_mock(*args, **kwargs):
        pass

    hardware.move_rel = MagicMock(side_effect=async_mock)
    hardware.pick_up_tip = MagicMock(side_effect=async_mock)
    hardware.drop_tip = MagicMock(side_effect=async_mock)

    m = TipCalibrationUserFlow(hardware=hardware, mount=Mount.RIGHT)

    yield m


@pytest.mark.parametrize('command,from_state,to_state,data', valid_commands)
async def test_valid_commands(command, from_state, to_state, data,
                              mock_user_flow):
    mock_user_flow._current_state = from_state
    await mock_user_flow.handle_command(command, data)
    assert mock_user_flow._current_state == to_state

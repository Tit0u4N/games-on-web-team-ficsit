import { ControlOption } from '@/component/options/InputOption.tsx';
import { config } from '@core/Interfaces.ts';
import { Divider } from '@nextui-org/react';

export const ControlOptions = () => {
  return (
    <div className={'flex flex-col w-full pb-2q'}>
      {/* Add ControlOption components for each control setting */}
      <ControlOption
        title={'Move Forward'}
        description={'Key to move forward'}
        option={'moveForward'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.keysUp[0]}
      />
      <DividerOptions />
      <ControlOption
        title={'Move Backward'}
        description={'Key to move backward'}
        option={'moveBackward'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.keysDown[0]}
      />
      <DividerOptions />
      <ControlOption
        title={'Move Left'}
        description={'Key to move left'}
        option={'moveLeft'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.keysLeft[0]}
      />
      <DividerOptions />
      <ControlOption
        title={'Move Right'}
        description={'Key to move right'}
        option={'moveRight'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.keysRight[0]}
      />
      <DividerOptions />
      <ControlOption
        title={'Zoom In'}
        description={'Key to zoom in'}
        option={'zoomIn'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomIn[0]}
      />
      <DividerOptions />
      <ControlOption
        title={'Zoom Out'}
        description={'Key to zoom out'}
        option={'zoomOut'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomOut[0]}
      />
      <DividerOptions />
      <ControlOption
        title={'Reset Camera'}
        description={'Key to reset camera'}
        option={'resetCamera'}
        defaultValue={config.arcRotateCameraKeyboardInputs.controls.keys.resetPosition[0]}
      />
    </div>
  );
};

const DividerOptions = () => {
  return <Divider className={'my-2'}></Divider>;
};

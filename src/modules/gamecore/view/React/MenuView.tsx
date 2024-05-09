import React from 'react';
import { Button, Card, CardBody, Divider, Tab, Tabs } from '@nextui-org/react';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { SwitchOption } from '@/component/options/SwitchOption.tsx';
import { SelectOption } from '@/component/options/SelectOption.tsx';
import { AvatarCredit } from '@/component/AvatarCredit.tsx';
import { ControlOption } from '@/component/options/InputOption.tsx';
import { config } from '@/core/Interfaces.ts';

interface Props {
  presenter: GameCorePresenter;
}

export const MenuView: React.FC<Props> = ({ presenter }) => {
  const cardSize = ' w-[500px] h-[600px] p-2 pb-4';

  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex flex-col items-center justify-center'}>
        <div className={'mt-[-50px] h-[640px] font-semibold'}>
          <Tabs size={'lg'} fullWidth={true} aria-label={'Menu'}>
            <Tab key={'game'} title={'Game'} aria-label={'Menu Game'} className={'h-[50px] '}>
              <Card className={cardSize}>
                <CardBody>Game</CardBody>
              </Card>
            </Tab>
            <Tab key={'options'} title={'Options'} aria-label={'Menu Options'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className={'flex flex-col'}>
                  <p className={'text-center text-gray-500 py-5'}>
                    These options can only be changed before the start of the game.
                  </p>

                  <div className={'w-full'}>
                    <h3 className={'text-xl pb-2'}> Graphics </h3>
                    <div className={'flex flex-col w-full'}>
                      <SwitchOption title={'Shadows'} description={'Active shadows'} option={'shadows'} />
                      <DividerOptions />
                      <SelectOption title={'Trees'} description={'Number of trees'} option={'trees'} />
                      <DividerOptions />
                      <SelectOption title={'Rocks'} description={'Number of rocks'} option={'trees'} />
                    </div>
                  </div>
                  <DividerOptions />
                  <div className={'w-full pt-4'}>
                    <h3 className={'text-xl pb-2'}> Controls </h3>
                    <div className={'flex flex-col w-full'}>
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
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key={'credit'} title={'Credit'} aria-label={'Menu Credit'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className="flex flex-col gap-8">
                  <AvatarCredit
                    image={'/img/avatar_titou.jpg'}
                    name={'Titouan Lacombe--Fabre'}
                    githubUser={'Tit0u4N'}
                  />
                  <AvatarCredit image={'/img/avatar_tamas.png'} name={'Tamas Palotas'} githubUser={'Shiyamii'} />
                  <AvatarCredit
                    image={'/img/avatar_bapt.png'}
                    name={'Baptiste LACROIX'}
                    githubUser={'BaptisteLacroix'}
                  />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
        <Button
          color="primary"
          className={'w-[250px] h-[75px] text-white text-3xl'}
          onClick={() => presenter.startGame()}>
          Start Game
        </Button>
      </div>
    </div>
  );
};

const DividerOptions = () => {
  return <Divider className={'my-2'}></Divider>;
};

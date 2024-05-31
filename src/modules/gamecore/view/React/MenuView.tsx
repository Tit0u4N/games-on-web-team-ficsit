import React from 'react';
import { Button, Card, CardBody, Divider, Switch, Tab, Tabs } from '@nextui-org/react';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { SwitchOption } from '@/component/options/SwitchOption.tsx';
import { SelectOption } from '@/component/options/SelectOption.tsx';
import { AvatarCredit } from '@/component/AvatarCredit.tsx';
import { ApplicationStatus } from '@gamecore/presenter/ApplicationStatus.ts';
import { MapSizeOption } from '@/component/options/MapSizeOption.tsx';
import { SeedInputOption } from '@/component/options/SeedInputOption.tsx';
import { ControlOptions } from '@/component/options/ControlOptions.tsx';
import { config } from '@core/Interfaces.ts';
import { AudioComponent } from '@/modules/audio/view/React/AudioComponent.tsx';

interface Props {
  presenter: GameCorePresenter;
}

export const MenuView: React.FC<Props> = ({ presenter }) => {
  const cardSize = ' w-[500px] h-[600px] p-2 pb-4';
  const [isNarratorSwitchOn, setIsNarratorSwitchOn] = React.useState(config.narratorBox.enabled);

  const toggleNarratorSwitch = () => {
    setIsNarratorSwitchOn(!isNarratorSwitchOn);
    config.narratorBox.enabled = !config.narratorBox.enabled;
  };
  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex flex-col items-center justify-center'}>
        <div className={'mt-[-50px] h-[640px] font-semibold'}>
          <Tabs size={'lg'} fullWidth={true} aria-label={'Menu'}>
            <Tab key={'game'} title={config.gamecore.view.react.menuView.tabGameTitle} aria-label={'Menu Game'} className={'h-[50px] '}>
              <Card className={cardSize}>
                <CardBody>
                  <h2 className={'text-2xl mb-4 text-center'}>{config.gamecore.view.react.menuView.welcomeMessage}</h2>
                  <p className={'text-center text-gray-500 mb-5'}>
                    {config.gamecore.view.react.menuView.welcomeDescriptionMessage}
                  </p>
                  <DividerOptions />
                  <MapSizeOption
                    title={'Map Size'}
                    description={'Choose the size of the map'}
                    option={'mapSize'}
                    min={20}
                    max={100}
                  />
                  <DividerOptions />
                  <SeedInputOption
                    title={'Map Seed'}
                    description={'Enter a seed value for map generation (optional)'}
                    option={'mapSeed'}
                  />
                  <DividerOptions />
                  <div className={'w-full flex justify-between aline-center'} onClick={() => toggleNarratorSwitch()}>
                    <div>
                      <h3 className={'text-l'}>{config.gamecore.view.react.menuView.narratorMessage}</h3>
                      <p className={'m-0 text-sm text-gray-400'}>{config.gamecore.view.react.menuView.narratorDescriptionMessage}</p>
                    </div>
                    <Switch isSelected={isNarratorSwitchOn} onValueChange={toggleNarratorSwitch} />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key={'options'} title={config.gamecore.view.react.menuView.tabOptionTitle} aria-label={'Menu Options'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className={'flex flex-col mb-5'}>
                  <p className={'text-center text-gray-500 py-5'}>
                    {config.gamecore.view.react.menuView.optionMessage}
                  </p>
                  <div className={'w-full'}>
                    <h3 className={'text-xl pb-2'}> {config.gamecore.view.react.menuView.graphicMessageOption} </h3>
                    <div className={'flex flex-col w-full'}>
                      <SwitchOption title={'Shadows'} description={'Active shadows'} option={'shadows'} />
                      <DividerOptions />
                      <SelectOption title={'Trees'} description={'Number of trees'} option={'trees'} />
                      <DividerOptions />
                      <SelectOption title={'Rocks'} description={'Number of rocks'} option={'trees'} />
                    </div>
                  </div>
                  <DividerOptions />
                  <h3 className={'text-xl pb-2'}> {config.gamecore.view.react.menuView.musicMessageOption} </h3>
                  <AudioComponent audioPresenter={GameCorePresenter.AUDIO_PRESENTER} />
                  <DividerOptions />
                  <div className={'w-full pt-4'}>
                    <h3 className={'text-xl pb-2'}> {config.gamecore.view.react.menuView.controlsMessageOption} </h3>
                    <ControlOptions />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key={'credit'} title={config.gamecore.view.react.menuView.tabCreditTitle} aria-label={'Menu Credit'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className="flex flex-col gap-8">
                  <AvatarCredit
                    image={'./images/menu/avatar_titou.jpg'}
                    name={'Titouan Lacombe--Fabre'}
                    githubUser={'Tit0u4N'}
                  />
                  <AvatarCredit
                    image={'./images/menu//avatar_tamas.png'}
                    name={'Tamas Palotas'}
                    githubUser={'Shiyamii'}
                  />
                  <AvatarCredit
                    image={'./images/menu/avatar_bapt.png'}
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
          className={'w-[300px] h-[75px] text-white text-3xl'}
          onClick={() => {
            presenter.setStatus(ApplicationStatus.CONFIGURE_CHARACTERS);
            presenter.notifyViewChange();
          }}>
          Create Athletes
        </Button>
      </div>
    </div>
  );
};

const DividerOptions = () => {
  return <Divider className={'my-2'}></Divider>;
};

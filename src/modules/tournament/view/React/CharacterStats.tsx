import { AllCharactersPresenter } from '../../../character/presenter/AllCharactersPresenter.ts';
import { Image } from '@nextui-org/react';

type CharacterStatsProps = {
  character: AllCharactersPresenter;
}

export const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  const model = character.characterModel;

  return (
    <div className={"flex"}>
      <div className={"w-1/3"}>
      </div>
      <div className={"w-2/3"}>

      </div>
    </div>
  )
}
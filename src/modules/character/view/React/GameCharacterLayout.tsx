import React from 'react';
import CharacterLayout from './CharacterLayout';
import { Season } from '@core/singleton/Season.ts';
import { CharacterPresenter } from '@character/presenter/CharacterPresenter.ts';

interface GameCharacterLayoutProps {
  characterPresenter: CharacterPresenter;
  season: Season;
}

const GameCharacterLayout: React.FC<GameCharacterLayoutProps> = ({ characterPresenter, season }) => {
  const [idSelectedCharacter, setIdSelectedCharacter] = React.useState<number | undefined>(undefined);
  characterPresenter.reactSelectedCharacterHandler = setIdSelectedCharacter;

  const character = characterPresenter.characters;

  return (
    <div className="flex justify-between absolute bottom-0 left-0 right-0 p-4">
      {Array.from(character).map((character, index) => (
        <CharacterLayout
          key={index}
          character={character}
          season={season}
          isSelect={idSelectedCharacter === character.id}
        />
      ))}
    </div>
  );
};

export default GameCharacterLayout;

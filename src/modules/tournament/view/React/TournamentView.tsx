import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  ModalBody,
  ModalFooter,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import { NPCList } from './NPCList.tsx';
import { DiceComponent } from '@dice/view/React/DiceComponent.tsx';
import CharacterLayout from '../../../character/view/React/CharacterLayout.tsx';
import { AnimatePresence, motion } from 'framer-motion';
import { RandomNumber } from '@/component/RandomNumber.tsx';
import { config } from '@core/Interfaces.ts';
import HighlightTutorialSpeech from '@gamecore/view/React/narrator/HighlightTutorialSpeech.tsx';

interface Props {
  tournament: TournamentPresenter;
  setHideModal: (hide: boolean) => void;
  isOpen?: boolean;
}

export const TournamentView: React.FC<Props> = ({ tournament, setHideModal, isOpen }) => {
  const model = tournament.tournamentModel;
  const playerCharacters = Array.from(tournament.tournamentManagerPresenter.gameCorePresenter.getCharacters());
  const npcs = model.currentPoolRolls.filter((character) => !playerCharacters.includes(character.character));
  const presentPlayerCharacters = model.currentPoolRolls.filter((character) =>
    playerCharacters.includes(character.character),
  );
  const [showRollResult, setShowRollResult] = React.useState(model.isRolled);
  const [showResult, setShowResult] = React.useState(model.isAllRolled());
  const [showRank, setShowRank] = React.useState(false);

  const setDiceRoll = (characterId: number) => {
    model.setCurrentPoolRoll(characterId, tournament.echoRollDice);
  };

  let list = model.currentPoolRolls;

  useEffect(() => {
    if (showResult) {
      setTimeout(() => {
        setShowRank(true);
        list = model.currentPoolRolls.sort((a, b) => a.rank - b.rank);
      }, 4000);
    }
  }, [showResult]);

  const showResults = () => {
    setShowResult(true);
    setTimeout(() => {
      setShowRank(true);
      list = model.currentPoolRolls.sort((a, b) => a.rank - b.rank);
    }, 4000);
  };

  setTimeout(() => {
    setShowRollResult(true);
  }, 4000);

  const [isNarrationVisible, setIsNarrationVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && !tournament.tournamentManagerPresenter.hasTournamentShownNarratorBox && config.narratorBox.enabled) {
      setIsNarrationVisible(true);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen !== undefined &&
        config.narratorBox.arenaTournamentViewHighlightTutorialSpeech.length > 0 &&
        isNarrationVisible && (
          <HighlightTutorialSpeech
            className="fixed z-50 top-[0px] left-[0px]"
            steps={config.narratorBox.arenaTournamentViewHighlightTutorialSpeech}
            onComplete={() => {
              setIsNarrationVisible(false);
              tournament.tournamentManagerPresenter.hasTournamentShownNarratorBox = true;
            }}
          />
        )}
      <ModalBody className={'flex-row'}>
        <div className={'w-1/3 flex flex-col gap-1'} id={'PlayerAthletes'}>
          {presentPlayerCharacters.map((character, index) => (
            <Card key={index} className="w-full max-h-[400px] h-fit" id={index === 0 ? 'PlayerAthleteDetails' : ''}>
              <CharacterLayout
                character={character.character}
                isInTournament={true}
                season={tournament.tournamentManagerPresenter.gameCorePresenter.getCurrentSeason()}
              />
              <AnimatePresence>
                {!model.isUserRolledDice(character.character.id) && (
                  <motion.div
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 200 }}
                    exit={{ opacity: 0, maxHeight: 0 }}>
                    <DiceComponent
                      className={'w-full p-2 flex items-center justify-around'}
                      dicePresenter={tournament.dicePresenter}
                      onRoll3DStart={() => {
                        setHideModal(true);
                      }}
                      onRoll3DEnd={() => {
                        setTimeout(() => {
                          setDiceRoll(character.character.id);
                          setHideModal(false);
                          setTimeout(() => {
                            if (model.isAllRolled()) showResults();
                            tournament.dicePresenter.unMountView();
                          }, 500);
                        }, 2000);
                      }}
                      onRoll2DEnd={() => {
                        setDiceRoll(character.character.id);
                        if (model.isAllRolled()) {
                          showResults();
                        }
                        tournament.dicePresenter.unMountView();
                      }}
                      isDisabled={model.isUserRolledDice(character.character.id)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
        <div className={'w-2/3 flex flex-col gap-4'}>
          <NPCList npcs={npcs} isRolled={model.isRolled} />
          <div className={'flex h-full gap-4'}>
            <div className={'w-2/3'} id={'AllParticipantsTable'}>
              <Table isStriped removeWrapper aria-label="Score table">
                <TableHeader>
                  <TableColumn className={'text-[15px]'} id={'RankColumn'}>
                    Rank
                  </TableColumn>
                  <TableColumn className={'text-[15px]'}>Name</TableColumn>
                  <TableColumn className={'text-[15px]'} id={'RollColumn'}>
                    Roll
                  </TableColumn>
                  <TableColumn className={'text-[15px]'} id={'ScoreColumn'}>
                    Final Score
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {list.map((character, index) => (
                    <TableRow key={index} className={character.character.isPlayer ? ' bg-primary-bg' : ''}>
                      <TableCell>{showRank ? (character.rank == -1 ? '?' : character.rank + 1) : '?'}</TableCell>
                      <TableCell>{character.character.name}</TableCell>
                      <TableCell>
                        {showRollResult ? (character.diceRoll == -1 ? '?' : character.diceRoll) : ''}
                      </TableCell>
                      <TableCell align={'center'}>
                        {showResult ? (
                          <RandomNumber
                            finalValue={model.calculateScore(
                              character.character
                                .getStatsWithEffect(
                                  tournament.tournamentManagerPresenter.gameCorePresenter.getCurrentSeason(),
                                )
                                .get(model.sport),
                              character.diceRoll,
                            )}></RandomNumber>
                        ) : (
                          ''
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className={'w-1/3 flex flex-col gap-4'}>
              <div className={'flex size-full border border-default-200 rounded-2xl flex-col-reverse'}></div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>{showRank && <Button onPress={() => model.passToNextRound()}>Next round</Button>}</ModalFooter>
    </>
  );
};

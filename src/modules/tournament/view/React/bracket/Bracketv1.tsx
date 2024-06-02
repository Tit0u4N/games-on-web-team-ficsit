import React, { useEffect, useState } from 'react';
import './Bracket.scss';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Bracketv1Candidate, Candidate } from './Bracketv1Candidate.tsx';
import { Character } from '@character/model/Character.ts';

type Props = {
  bracket: BracketObject;
  isChildren?: boolean;
};

export const Bracketv1: React.FC<Props> = ({ bracket, isChildren = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = (open: boolean) => {
    if (!bracket.hasCandidates()) return setIsOpen(false);
    return setIsOpen(open);
  };

  bracket.open = setIsOpen;
  bracket.loading = setIsLoading;
  const [candidates, setCandidates] = useState(bracket.candidates);

  useEffect(() => {
    if (!isOpen) return;
    if (!isLoading) {
      setCandidates(candidates.sort((a, b) => (a.rank === -1 ? 1000 : a.rank) - (b.rank === -1 ? 1000 : b.rank)));
    } else {
      setCandidates(candidates.sort((a, b) => a.character.id - b.character.id));
    }
  }, [candidates, isLoading, isOpen]);

  const renderBlock = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classNameContainer = isOpen ? 'bg-default' : '';
    return (
      <Popover
        placement={'left'}
        isOpen={isOpen}
        onOpenChange={handleOpen}
        shouldCloseOnInteractOutside={() => !isLoading}>
        <PopoverTrigger>
          <div
            className={
              'h-[60px] w-[150px] flex justify-center items-center rounded-xl border border-default cursor-pointer hover:bg-gray-100 ' +
              classNameContainer
            }
            id={bracket.isFirst ? 'FirstBracket' : ''}>
            <p>{bracket.name}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className={'flex flex-wrap gap-3 w-[380px] p-2'} id={bracket.isFirst ? 'BracketParticipants' : ''}>
            {candidates
              .sort(
                (a, b) =>
                  (!isLoading ? (a.rank === -1 ? 1000 : a.rank) : a.character.id) -
                  (!isLoading ? (b.rank === -1 ? 1000 : b.rank) : b.character.id),
              )
              .map((candidate, index) => (
                <div
                  className={'flex gap-2 items-center'}
                  key={index}
                  id={bracket.isFirst && index === 0 ? 'BracketParticipant' : ''}>
                  <h3>{isLoading ? 0 : candidate.rank + 1}.</h3>
                  <Bracketv1Candidate key={index} candidate={candidate.character} />
                </div>
              ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderHasChildren = () => {
    return (
      <div className={'bracket-item'}>
        <div className={'bracket-item-parent'}>{renderBlock()}</div>
        <div className={'bracket-item-children'}>
          {bracket.children1 && (
            <div className={'bracket-item-child'}>
              <Bracketv1 bracket={bracket.children1} isChildren={true} />{' '}
            </div>
          )}
          {bracket.children2 && (
            <div className={'bracket-item-child'}>
              <Bracketv1 bracket={bracket.children2} isChildren={true} />{' '}
            </div>
          )}
        </div>
      </div>
    );
  };
  if (isChildren) {
    if (bracket.hasChildren()) {
      return renderHasChildren();
    } else {
      return renderBlock();
    }
  }
  return (
    <div className={'bracket-wrapper size-full overflow-y-auto max-h-[90%] h-[90%] flex-wrap'}>
      {renderHasChildren()}
    </div>
  );
};

export class BracketObject {
  private _name!: string;
  private _candidates: Array<{ rank: number; character: Candidate }> = [];
  private readonly _roundNumber: number;
  private readonly _poolNumber: number;
  private _opener: React.Dispatch<React.SetStateAction<boolean>> | null = null;
  private _loading: React.Dispatch<React.SetStateAction<boolean>> | null = null;
  private _parent?: BracketObject | null;
  private _children1?: BracketObject;
  private _children2?: BracketObject;
  public readonly isFirst: boolean;
  private static isFirstCreated: boolean = false;

  constructor(
    roundNumber: number,
    poolNumber: number,
    candidates: Array<{ rank: number; character: Candidate }> = [],
    children1?: BracketObject,
    children2?: BracketObject,
  ) {
    this._roundNumber = roundNumber;
    this._poolNumber = poolNumber;
    this._candidates = candidates;
    this.children1 = children1;
    this.children2 = children2;
    this.updateName();
    if (!BracketObject.isFirstCreated) {
      this.isFirst = true;
      BracketObject.isFirstCreated = true;
    } else this.isFirst = false;
  }

  static buildFromRoundList(
    rounds: { round: number; pools: { rank: number; character: Character }[][] }[],
  ): BracketObject {
    let bracketList: BracketObject[] = [];
    let currentRoundCounter = 0;
    let currentRound = rounds.find((round) => round.round === currentRoundCounter);
    BracketObject.isFirstCreated = false;
    while (currentRound!.pools.length > 1) {
      if (bracketList.length === 0) {
        for (let i = 0; i < currentRound!.pools.length; i++) {
          const bracket = new BracketObject(currentRound!.round, i, currentRound!.pools[i]);
          bracketList.push(bracket);
        }
      } else {
        const newBracketList: BracketObject[] = [];
        for (let i = 0; i < currentRound!.pools.length; i++) {
          const bracket = new BracketObject(
            currentRound!.round,
            i,
            currentRound!.pools[i],
            bracketList[i * 2],
            bracketList[i * 2 + 1],
          );
          newBracketList.push(bracket);
        }
        bracketList = [];
        bracketList.push(...newBracketList);
      }

      currentRoundCounter++;
      currentRound = rounds.find((round) => round.round === currentRoundCounter);
    }

    if (bracketList.length === 0) return new BracketObject(0, 0, currentRound!.pools[0]);
    return new BracketObject(currentRound!.round, 0, currentRound!.pools[0], bracketList[0], bracketList[1]);
  }

  update() {
    this.updateName();
    if (this._children1) this._children1.update();
    if (this._children2) this._children2.update();
  }

  updateName(): void {
    const nbParents = this.nbParents();
    if (nbParents === 0) this._name = 'final';
    else this._name = '1/' + Math.pow(2, this.nbParents()) + ' final';
  }

  nbParents(): number {
    if (!this._parent) return 0;
    return 1 + this._parent.nbParents();
  }

  hasChildren(): boolean {
    return !!(this._children1 || this._children2);
  }

  hasCandidates(): boolean {
    return this._candidates.length > 0;
  }

  get name(): string {
    return this._name;
  }

  get candidates(): Array<{ rank: number; character: Candidate }> {
    return this._candidates;
  }

  get children1(): BracketObject | undefined {
    return this._children1;
  }

  get children2(): BracketObject | undefined {
    return this._children2;
  }

  set children1(children: BracketObject | undefined) {
    this._children1 = children;
    if (this._children1) this._children1.parent = this;
  }

  set children2(children: BracketObject | undefined) {
    this._children2 = children;
    if (this._children2) this._children2.parent = this;
  }

  set parent(parent: BracketObject | null) {
    this._parent = parent;
    this.update();
  }

  get opener(): React.Dispatch<React.SetStateAction<boolean>> | null {
    return this._opener;
  }
  set open(opener: React.Dispatch<React.SetStateAction<boolean>>) {
    this._opener = opener;
  }

  set loading(loading: React.Dispatch<React.SetStateAction<boolean>>) {
    this._loading = loading;
  }

  public startLoading(): void {
    this._loading!(true);
    setTimeout(() => {
      this._loading!(false);
    }, 1000);
  }

  getPool(round: number, pool: number): BracketObject | null {
    if (round === this._roundNumber && pool === this._poolNumber) return this;
    if (this._children1) {
      const child = this._children1.getPool(round, pool);
      if (child) return child;
    }
    if (this._children2) {
      const child = this._children2.getPool(round, pool);
      if (child) return child;
    }
    return null;
  }
}

import React from 'react';
import './Bracket.scss';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Bracketv1Candidate, Candidate } from './Bracketv1Candidate.tsx';
import { Country } from '../../../../../core/Country.ts';

type Props = {
  bracket: BracketObject;
  isChildren?: boolean;
};

const randomCandidates = () => {
  const candidates: Array<Candidate> = [];
  for (let i = 0; i < 8; i++) {
    candidates.push({
      name: 'Candidate_ ' + i,
      country: Country.getRandom(),
      image: 'https://i.pravatar.cc/150?img=' + i,
      score: Math.floor(Math.random() * 100),
    });
  }

  return candidates;
};

export const Bracketv1: React.FC<Props> = ({ bracket, isChildren = false }) => {
  const renderBlock = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = (open: boolean) => {
      if (!bracket.hasCandidates()) return setIsOpen(false);
      return setIsOpen(open);
    };

    const classNameContainer = isOpen ? 'bg-default' : '';

    return (
      <Popover placement={'left'} isOpen={isOpen} onOpenChange={handleOpen}>
        <PopoverTrigger>
          <div
            className={
              'h-[60px] w-[150px] flex justify-center items-center rounded-xl border border-default cursor-pointer hover:bg-gray-100 ' +
              classNameContainer
            }>
            <p>{bracket.name}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className={'flex flex-wrap gap-3 w-[360px] p-2'}>
            {bracket.candidates.map((candidate, index) => (
              <Bracketv1Candidate key={index} candidate={candidate} />
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
  return <div className={'bracket-wrapper size-full'}>{renderHasChildren()}</div>;
};

export class BracketObject {
  private _name: string;
  private _candidates: Array<Candidate> = [];
  private _parent?: BracketObject | null;
  private _children1?: BracketObject;
  private _children2?: BracketObject;

  constructor(candidates: Array<Candidate> = [], children1?: BracketObject, children2?: BracketObject) {
    this._candidates = candidates;
    this.children1 = children1;
    this.children2 = children2;
    this.updateName();
  }

  static testBracket(): BracketObject {
    const child = new BracketObject(randomCandidates());
    const child2 = new BracketObject(randomCandidates());
    const parent1 = new BracketObject(randomCandidates(), child, child2);
    const parent2_1 = new BracketObject(randomCandidates(), child, child2);
    const parent2_2 = new BracketObject(randomCandidates(), child, child2);
    const parent1_1 = new BracketObject(randomCandidates(), parent1, parent2_1);
    const parent1_2 = new BracketObject(randomCandidates(), parent1, parent2_2);

    return new BracketObject(randomCandidates(), parent1_1, parent1_2);
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

  get candidates(): Array<Candidate> {
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
}

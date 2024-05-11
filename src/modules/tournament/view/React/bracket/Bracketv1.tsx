import React from 'react';
import './Bracket.scss';
import { Avatar } from '@nextui-org/react';

type Props = {
  bracket: BracketObject;
  isChildren?: boolean;
};

export const Bracketv1: React.FC<Props> = ({ bracket, isChildren = false }) => {
  const hasChildren = !!(bracket.children1 || bracket.children2);

  const renderBlock = () => {
    return (
      <div className={'bracket-block'}>
        <Avatar src={'character_1.png'} isBordered radius={'full'} size={'sm'} />
        <p>{bracket.name}</p>
      </div>
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
    if (hasChildren) {
      return renderHasChildren();
    } else {
      return renderBlock();
    }
  }
  return <div className={'bracket-wrapper'}>{renderHasChildren()}</div>;
};

export class BracketObject {
  private _name: string;
  private _children1?: BracketObject;
  private _children2?: BracketObject;

  constructor(name: string, children1?: BracketObject, children2?: BracketObject) {
    this._name = name;
    this._children1 = children1;
    this._children2 = children2;
  }

  static testBracket(): BracketObject {
    const child = new BracketObject('child');
    const child2 = new BracketObject('child2');
    const parent1 = new BracketObject('parent2_1', child, child2);
    const parent2_1 = new BracketObject('parent2_1', child, child2);
    const parent2_2 = new BracketObject('parent2_2', child, child2);
    const parent1_1 = new BracketObject('parent1_1', parent1, parent2_1);
    const parent1_2 = new BracketObject('parent1_2', parent1, parent2_2);

    return new BracketObject('parent', parent1_1, parent1_2);
  }

  hasChildren(): boolean {
    return !!(this._children1 || this._children2);
  }

  get name(): string {
    return this._name;
  }

  get children1(): BracketObject | undefined {
    return this._children1;
  }

  get children2(): BracketObject | undefined {
    return this._children2;
  }
}

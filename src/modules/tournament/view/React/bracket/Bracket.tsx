import React from 'react';
import "./Bracket.scss";

type Props = {
  bracket: BracketObject;
  isChildren?: boolean;
};


export const Bracket: React.FC<Props> = ({ bracket, isChildren = false }) => {

  const hasChildren = !!(bracket.children1 || bracket.children2);

  if (!isChildren) {
    return (
    <div className={"wrapper"}>
      <div className={"item"}>
        <div className={"item-parent"}>
          <p> { bracket.name } </p>
        </div>
        <div className={"item-children"}>
          {
              <div className={"item-child"}>
                { bracket.children1 && <Bracket bracket={bracket.children1} /> }
                { bracket.children2 && <Bracket bracket={bracket.children2} /> }
              </div>
          }
          { bracket.children1 && <Bracket bracket={bracket.children1} /> }
          { bracket.children2 && <Bracket bracket={bracket.children2} /> }
        </div>
      </div>
    </div>
    );
  }
  return (

  );
};

export class BracketObject {
  private _name: string;
  private _children1?: BracketObject;
  private _children2?: BracketObject;

  constructor(name: string, children1?: BracketObject, children2?: BracketObject) {
    this._name = "";
    this._children1 = children1;
    this._children2 = children2;
  }

  static testBracket(): BracketObject {
    const parent3_1 = new BracketObject("parent3_1", new BracketObject("child3_1_1"), new BracketObject("child3_1_2"));
    const parent3_2 = new BracketObject("parent3_2", new BracketObject("child3_2_1"), new BracketObject("child3_2_2"));
    const parent3_3 = new BracketObject("parent2_1", parent3_1, parent3_2);
    const parent3_4 = new BracketObject("parent2_2", new BracketObject("child2_2_1"), new BracketObject("child2_2_2"));
    const parent2_1 = new BracketObject("parent1", parent3_1, parent3_2);
    const parent2_2 = new BracketObject("parent2", parent3_3, parent3_4);
    return new BracketObject("parent", parent2_1, parent2_2);

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

  get children2(): BracketObject | undefined{
    return this._children2;
  }


}

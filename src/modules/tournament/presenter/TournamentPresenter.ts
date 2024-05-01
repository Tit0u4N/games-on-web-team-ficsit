import { Scene } from '@babylonjs/core';
import { DicePresenter } from '../../dice/presenter/DicePresenter.ts';
import { TournamentModel } from '../model/TournamentModel.ts';
import { TournamentManagerPresenter } from './TournamentManagerPresenter.ts';
import { Character } from '../../character/model/Character.ts';

export class TournamentPresenter {
  private readonly _scene: Scene;
  private readonly _dicePresenter: DicePresenter;
  private readonly _tournamentModel: TournamentModel;
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;

  constructor(scene: Scene, tournamentManagerPresenter: TournamentManagerPresenter, tournamentModel: TournamentModel) {
    this._scene = scene;
    this._dicePresenter = new DicePresenter(scene);
    this._tournamentModel = tournamentModel;
    this._tournamentManagerPresenter = tournamentManagerPresenter;
  }

  get scene(): Scene {
    return this._scene;
  }

  get dicePresenter(): DicePresenter {
    return this._dicePresenter;
  }

  get tournamentModel(): TournamentModel {
    return this._tournamentModel;
  }

  get tournamentManagerPresenter(): TournamentManagerPresenter {
    return this._tournamentManagerPresenter;
  }

  startTournament(presentCharacters: Character[]) {
    const participants = this._tournamentManagerPresenter.generateNPCs(
      presentCharacters,
      this._tournamentModel.numberRound,
    );
    const participantsShuffle = [...participants];
    for (let i = participantsShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantsShuffle[i], participantsShuffle[j]] = [participantsShuffle[j], participantsShuffle[i]]; // Échange des éléments
    }
    this.tournamentModel.characters = participantsShuffle;
    this.tournamentModel.initTournament();
  }
}

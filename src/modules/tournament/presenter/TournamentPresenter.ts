import { Scene } from '@babylonjs/core';
import { DiceHandler, DicePresenter } from '../../dice/presenter/DicePresenter.ts';
import { TournamentModel } from '../model/TournamentModel.ts';
import { TournamentManagerPresenter } from './TournamentManagerPresenter.ts';
import { Character } from '../../character/model/Character.ts';
import { ModalManager } from '../../../core/singleton/ModalManager.ts';

export class TournamentPresenter implements DiceHandler {
  private readonly _scene: Scene;
  private readonly _dicePresenter: DicePresenter;
  private readonly _tournamentModel: TournamentModel;
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;

  constructor(scene: Scene, tournamentManagerPresenter: TournamentManagerPresenter, tournamentModel: TournamentModel) {
    this._scene = scene;
    this._dicePresenter = new DicePresenter(scene, this);
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

  get isTournamentStarted(): boolean {
    return this._tournamentModel.isTournamentStarted;
  }

  startTournament(presentCharacters: Character[]) {
    const participants = this._tournamentManagerPresenter.generateNPCs(
      presentCharacters,
      Math.pow(2, this._tournamentModel.numberRound - 1) * 8,
      this._tournamentModel.difficulty,
    );
    const participantsShuffle = [...participants];
    for (let i = participantsShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantsShuffle[i], participantsShuffle[j]] = [participantsShuffle[j], participantsShuffle[i]]; // Échange des éléments
    }
    this.tournamentModel.characters = participantsShuffle;
    this.tournamentModel.initTournament();
  }

  handleRollDice(diceValue: number) {
    console.log('TournamentPresenter handleRollDice ' + diceValue);
  }

  get isInPool() {
    return this._tournamentModel.isInPool;
  }

  playNextRound() {
    this._tournamentModel.playNextRound();
    ModalManager.getInstance().updateCurrentModal();
  }
}

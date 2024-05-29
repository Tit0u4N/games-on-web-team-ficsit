import { Character } from '@character/model/Character.ts';
import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import { animals, uniqueNamesGenerator } from 'unique-names-generator';

export class OlympicsModel {
  private readonly _teams: { color: string; candidats: Character[]; name: string }[];
  public readonly olympicsPresenter: OlympicsPresenter;
  private static colorCounter = 0;
  private static colors = [
    '#22c55e',
    '#dc2626',
    '#f97316',
    '#ec4899',
    '#7c2d12',
    '#a16207',
    '#84cc16',
    '#10b981',
    '#4c1d95',
    '#14b8a6',
    '#7e22ce',
    '#3b82f6',
    '#166534',
    '#6366f1',
    '#78716c',
    '#8b5cf6',
    '#facc15',
    '#d946ef',
    '#f43f5e',
    '#06b6d4',
    '#047857',
    '#1e40af',
    '#6b7280',
  ];

  constructor(playerCharacters: Character[], olympicsPresenter: OlympicsPresenter) {
    this.olympicsPresenter = olympicsPresenter;
    this._teams = this.createTeams(playerCharacters);
  }

  private createTeams(playerCharacters: Character[]) {
    const teams = [];
    const userTeams = {
      color: this.getNextColor(),
      candidats: playerCharacters,
      name: uniqueNamesGenerator({
        dictionaries: [animals],
      }),
    };
    teams.push(userTeams);
    for (let i = 1; i < 22; i++) {
      const team = {
        color: this.getNextColor(),
        candidats: this.createNPCs(),
        name: uniqueNamesGenerator({
          dictionaries: [animals],
        }),
      };
      teams.push(team);
    }
    return teams;
  }

  private createNPCs(): Character[] {
    return this.olympicsPresenter.gameCorePresenter.TournamentManagerPresenter.generateNPCsForOlympics(3);
  }

  private getNextColor() {
    const color = OlympicsModel.colors[OlympicsModel.colorCounter];
    OlympicsModel.colorCounter = (OlympicsModel.colorCounter + 1) % OlympicsModel.colors.length;
    return color;
  }

  get teams() {
    return this._teams;
  }
}

import { Character } from '@character/model/Character.ts';
import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import { animals, uniqueNamesGenerator } from 'unique-names-generator';
import { ModalManager } from '@core/singleton/ModalManager.ts';

export enum OlympicsState {
  STANDINGS,
  TOURNAMENT,
  FINISHED,
}

export class OlympicsModel {
  private readonly _teams: { color: string; candidats: Character[]; name: string; isPlayer: boolean }[];
  private readonly _candidats: { candidat: Character; points: number }[];
  public readonly olympicsPresenter: OlympicsPresenter;
  private _state: OlympicsState = OlympicsState.STANDINGS;
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
    this._candidats = [];
    for (const playerCharacter of playerCharacters) {
      this._candidats.push({
        candidat: playerCharacter,
        points: 0,
      });
    }
    for (let i = this._candidats.length; i < 16; i++) {
      this._candidats.push({
        candidat: this.createNPCs(),
        points: 0,
      });
    }
    this._teams = this.createTeams(playerCharacters);
  }

  private createTeams(playerCharacters: Character[]) {
    const teams = [];
    const userTeamName = uniqueNamesGenerator({
      dictionaries: [animals],
    });
    const userTeams = {
      color: this.getNextColor(),
      candidats: playerCharacters,
      name: userTeamName[0].toUpperCase() + userTeamName.slice(1),
      isPlayer: true,
    };
    teams.push(userTeams);
    const userLists: Character[][] = [];
    let userList = [];
    for (let i = 3; i < this._candidats.length; i++) {
      userList.push(this._candidats[i].candidat);
      if (userList.length % 3 === 0) {
        userLists.push(userList);
        userList = [];
      }
    }
    userLists.push(userList);
    for (const userList of userLists) {
      const name = uniqueNamesGenerator({
        dictionaries: [animals],
      });
      const team = {
        color: this.getNextColor(),
        candidats: userList,
        name: name[0].toUpperCase() + name.slice(1),
        isPlayer: false,
      };
      teams.push(team);
    }
    return teams;
  }

  private createNPCs(): Character {
    return this.olympicsPresenter.gameCorePresenter.tournamentManagerPresenter.generateNPCsForOlympics();
  }

  private getNextColor() {
    const color = OlympicsModel.colors[OlympicsModel.colorCounter];
    OlympicsModel.colorCounter = (OlympicsModel.colorCounter + 1) % OlympicsModel.colors.length;
    return color;
  }

  getPointsOfTeam(index: number) {
    let total = 0;
    for (const candidat of this._teams[index].candidats) {
      total += this.getPointsOfCandidat(candidat);
    }
    return total;
  }

  private getPointsOfCandidat(candidat: Character) {
    for (const candidatPoints of this._candidats) {
      if (candidatPoints.candidat === candidat) {
        return candidatPoints.points;
      }
    }
    return 0;
  }

  get teams() {
    const teams: { color: string; candidats: Character[]; name: string; points: number; isPlayer: boolean }[] = [];
    for (const team of this._teams) {
      teams.push({
        color: team.color,
        candidats: team.candidats,
        name: team.name,
        isPlayer: team.isPlayer,
        points: this.getPointsOfTeam(this._teams.indexOf(team)),
      });
    }
    return teams;
  }

  get candidats() {
    const candidats: {
      candidat: Character;
      points: number;
      team: { color: string; name: string; isPlayer: boolean };
    }[] = [];
    for (const candidat of this._candidats) {
      for (const team of this._teams) {
        if (team.candidats.includes(candidat.candidat)) {
          candidats.push({
            candidat: candidat.candidat,
            points: candidat.points,
            team: { color: team.color, name: team.name, isPlayer: team.isPlayer },
          });
        }
      }
    }
    return candidats;
  }

  get state() {
    return this._state;
  }

  nextTournament() {
    this._state = OlympicsState.TOURNAMENT;
    const candidats: Character[] = [];
    for (const candidat of this._candidats) {
      candidats.push(candidat.candidat);
    }
    this.olympicsPresenter.getCurrentTournamentPresenter().startTournament(candidats);
    ModalManager.getInstance().updateCurrentModal();
  }

  private getPointsFromRank(rank: number) {
    //20 places in the ranking
    const points = [20, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0];
    return points[rank];
  }

  endTournament() {
    this._state = OlympicsState.STANDINGS;
    const finalRanking = this.olympicsPresenter.getCurrentTournamentPresenter().tournamentModel.finalRankings;
    for (const ranking of finalRanking) {
      const candidat = ranking.character;
      this._candidats.find((c) => c.candidat.id === candidat.id)!.points += this.getPointsFromRank(ranking.rank);
    }
    this.olympicsPresenter.incrementTournamentNb();
    if (this.olympicsPresenter.isLastTournament()) {
      this._state = OlympicsState.FINISHED;
    }
    ModalManager.getInstance().updateCurrentModal();
  }

  getTeamRank() {
    let rank = 1;
    const teams = this.teams.sort((a, b) => b.points - a.points);
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].isPlayer) {
        return rank;
      }
      rank++;
    }
    return rank;
  }
}

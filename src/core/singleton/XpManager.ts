export class XpManager {
  private static _instance: XpManager;
  private static GAIN_XP_CONST: number = 17.5;

  private _levelList: { level: number; xp: number }[];

  private constructor() {
    this._levelList = XpManager.makeLevels();
  }

  private static makeLevels(): { level: number; xp: number }[] {
    const levels: { level: number; xp: number }[] = [];
    levels.push({ level: 0, xp: 0 });
    for (let i = 1; i <= 20; i++) {
      const xp = Math.floor((i + 1) * Math.log10(i + 1) * 1.5 * 100);
      levels.push({ level: i, xp: xp });
    }
    levels.sort((a, b) => a.level - b.level);
    return levels;
  }

  public getLevelFromXp(xp: number): number {
    let level = 0;
    while (level < this._levelList.length - 1 && this._levelList[level].xp <= xp) {
      level++;
    }
    if (this._levelList[level].xp <= xp) return level;
    return level - 1;
  }

  public getXpFromLevel(level: number): number {
    level = Math.min(level, 20);
    return this._levelList[level].xp;
  }

  static getInstance(): XpManager {
    if (!XpManager._instance) {
      XpManager._instance = new XpManager();
    }
    return XpManager._instance;
  }

  public getCurrentLevel(xp: number): { percentageFilled: number; xpNextLevel: number } {
    const level = this.getLevelFromXp(xp);
    if (level === 20) return { percentageFilled: 100, xpNextLevel: 0 };
    const xpCurrentLevel = this._levelList[level].xp;
    const xpNextLevel = this._levelList[level + 1].xp;
    const percentageFilled = ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100;
    return { percentageFilled, xpNextLevel };
  }

  public gainXp(force: number): number {
    return Math.floor(XpManager.GAIN_XP_CONST * force * Math.log10(force * force * 2) + XpManager.GAIN_XP_CONST * 2);
  }

  public addLevelToXp(xp: number, level: number) {
    level = Math.min(level, 20);
    const levelFromXp = this.getLevelFromXp(xp);
    const remainingXp = xp - this.getXpFromLevel(levelFromXp);
    return this.getXpFromLevel(levelFromXp + level) + remainingXp;
  }

  getUpdatePercentage(xp: number, gainedXp: number) {
    return this.getCurrentLevel(xp + gainedXp);
  }
}

export class UsableObject {
  private readonly _name: string;
  private readonly _image: string;

  constructor(name: string, image: string) {
    this._name = name;
    this._image = image;
  }

  public get name(): string {
    return this._name;
  }

  public get image(): string {
    return this._image;
  }
}

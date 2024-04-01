import { FreeCamera, ICameraInput, Matrix, Nullable, UniversalCamera, Vector3 } from '@babylonjs/core';

const ECameraMovement = {
  KEYS: 0,
  MOUSE: 1,
};

export class FreeCameraKeyboardInputs implements ICameraInput<FreeCamera> {
  private _keys: string[] = [];
  // arrowUp, z
  public _keysUp: string[] = ['arrowUp', 'z'];
  // arrowDown, s
  public _keysDown: string[] = ['arrowDown', 's'];
  // arrowLeft, q
  public _keysLeft: string[] = ['arrowLeft', 'q'];
  // arrowRight, d
  public _keysRight: string[] = ['arrowRight', 'd'];
  // q
  public rotateKeysLeft: string[] = ['q'];
  // e
  public rotateKeysRight: string[] = ['e'];
  private _onKeyUp: ((evt: KeyboardEvent) => void) | null | undefined;
  private _onKeyDown: ((evt: KeyboardEvent) => void) | null | undefined;
  public camera: Nullable<FreeCamera>;

  constructor(camera: UniversalCamera) {
    this.camera = camera;
  }

  public attachControl(noPreventDefault?: boolean): void {
    const _this = this;
    const engine = this.camera!.getEngine();
    const element = engine.getInputElement();
    if (!element) return;
    if (!this._onKeyDown) {
      element.tabIndex = 1;
      this._onKeyDown = function (evt: KeyboardEvent) {
        if (
          _this._keysUp.indexOf(evt.key) !== -1 ||
          _this._keysDown.indexOf(evt.key) !== -1 ||
          _this._keysLeft.indexOf(evt.key) !== -1 ||
          _this.rotateKeysLeft.indexOf(evt.key) !== -1 ||
          _this.rotateKeysRight.indexOf(evt.key) !== -1 ||
          _this._keysRight.indexOf(evt.key) !== -1
        ) {
          const index = _this._keys.indexOf(evt.key);
          if (index === -1) {
            _this._keys.push(evt.key);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
          if (_this.camera!.metadata.movedBy === null) {
            _this.camera!.metadata.movedBy = ECameraMovement.KEYS;
          }
        }
      };
      this._onKeyUp = function (evt: KeyboardEvent) {
        if (
          _this._keysUp.indexOf(evt.key) !== -1 ||
          _this._keysDown.indexOf(evt.key) !== -1 ||
          _this._keysLeft.indexOf(evt.key) !== -1 ||
          _this.rotateKeysLeft.indexOf(evt.key) !== -1 ||
          _this.rotateKeysRight.indexOf(evt.key) !== -1 ||
          _this._keysRight.indexOf(evt.key) !== -1
        ) {
          const index = _this._keys.indexOf(evt.key);
          if (index >= 0) {
            _this._keys.splice(index, 1);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      element.addEventListener('keydown', this._onKeyDown, false);
      element.addEventListener('keyup', this._onKeyUp, false);
    }
  }

  public detachControl(): void {
    const engine = this.camera!.getEngine();
    const element = engine.getInputElement();
    if (!element) return;
    if (this._onKeyDown) {
      element.removeEventListener('keydown', this._onKeyDown);
      this._keys = [];
      this._onKeyDown = null;
    }
    if (this._onKeyUp) {
      element.removeEventListener('keyup', this._onKeyUp);
      this._keys = [];
      this._onKeyUp = null;
    }
  }

  public checkInputs(): void {
    if (this._onKeyDown) {
      const camera = this.camera;
      const speed = camera!.speed;
      const mdata = camera!.metadata;
      // move camera for all keys pressed
      for (let index = 0; index < this._keys.length; index++) {
        const key = this._keys[index];
        if (this._keysUp.indexOf(key) !== -1) {
          mdata.targetPosition.addInPlace(
            Vector3.TransformCoordinates(new Vector3(0, 0, speed), Matrix.RotationY(camera!.rotation.y)),
          );
        } else if (this._keysDown.indexOf(key) !== -1) {
          mdata.targetPosition.addInPlace(
            Vector3.TransformCoordinates(new Vector3(0, 0, -speed), Matrix.RotationY(camera!.rotation.y)),
          );
        } else if (this._keysLeft.indexOf(key) !== -1) {
          mdata.targetPosition.addInPlace(
            Vector3.TransformCoordinates(new Vector3(-speed, 0, 0), Matrix.RotationY(camera!.rotation.y)),
          );
        } else if (this._keysRight.indexOf(key) !== -1) {
          mdata.targetPosition.addInPlace(
            Vector3.TransformCoordinates(new Vector3(speed, 0, 0), Matrix.RotationY(camera!.rotation.y)),
          );
        } else {
          if (this.rotateKeysLeft.indexOf(key) !== -1) {
            mdata.rotation += mdata.rotationSpeed;
          } else if (this.rotateKeysRight.indexOf(key) !== -1) {
            mdata.rotation -= mdata.rotationSpeed;
          }
          const tx = camera!.target.x;
          const tz = camera!.target.z;
          const x = tx + mdata.radius * Math.sin(mdata.rotation);
          const z = tz + mdata.radius * Math.cos(mdata.rotation);
          camera!.position = new Vector3(x, camera!.position.y, z);
          camera!.setTarget(new Vector3(tx, 0, tz));
          mdata.targetPosition = new Vector3(camera!.position.x, camera!.position.y, camera!.position.z);
        }
      }
      // TODO: x/z limit check

      // distance check
      let lengthDiff = mdata.targetPosition.subtract(camera!.position).length();

      // moving
      if (lengthDiff > 0 && mdata.movedBy === ECameraMovement.KEYS) {
        let t = lengthDiff < 0.01 ? 1.0 : 0.02;
        camera!.position = Vector3.Lerp(camera!.position, mdata.targetPosition, t);
        if (t === 1.0) {
          mdata.movedBy = null;
        }
      }
    }
  }

  getTypeName(): string {
    return 'FreeCameraKeyboardInputs';
  }

  getSimpleName(): string {
    return 'keyboard';
  }

  getClassName(): string {
    return 'FreeCameraKeyboardWalkInput';
  }
}

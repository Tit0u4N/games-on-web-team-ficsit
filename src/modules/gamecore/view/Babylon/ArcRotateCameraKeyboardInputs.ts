import {
  ArcRotateCamera,
  ICameraInput,
  Matrix,
  Nullable,
  Vector3,
} from '@babylonjs/core';

export class ArcRotateCameraKeyboardInputs implements ICameraInput<ArcRotateCamera> {
  private _keys: string[] = [];
  // arrowUp, z
  public _keysUp: string[] = ['arrowUp', 'z'];
  // arrowDown, s
  public _keysDown: string[] = ['arrowDown', 's'];
  // arrowLeft, q
  public _keysLeft: string[] = ['arrowLeft', 'q'];
  // arrowRight, d
  public _keysRight: string[] = ['arrowRight', 'd'];
  private _activeMove: boolean = true;
  private _activeRotate: boolean = false;
  private _onKeyUp: ((evt: KeyboardEvent) => void) | null | undefined;
  private _onKeyDown: ((evt: KeyboardEvent) => void) | null | undefined;
  public camera: Nullable<ArcRotateCamera>;

  constructor(camera: ArcRotateCamera) {
    this.camera = camera;
  }

  public attachControl(noPreventDefault?: boolean): void {
    const _this = this;
    const engine = this.camera!.getEngine();
    const element = engine.getInputElement();
    if (!this._onKeyDown) {
      element!.tabIndex = 1;
      this._onKeyDown = function(evt) {
        if (
          ArcRotateCameraKeyboardInputs.isCameraMoveKey(_this, evt)
        ) {
          const index = _this._keys.indexOf(evt.key);
          if (index === -1) {
            _this._keys.push(evt.key);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      this._onKeyUp = function(evt) {
        if (
          ArcRotateCameraKeyboardInputs.isCameraMoveKey(_this, evt)
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
      element!.addEventListener('keydown', this._onKeyDown, false);
      element!.addEventListener('keyup', this._onKeyUp, false);
    }
  }

  static isCameraMoveKey(_this: ArcRotateCameraKeyboardInputs, evt: KeyboardEvent) {
    return _this._keysUp.indexOf(evt.key) !== -1 ||
      _this._keysDown.indexOf(evt.key) !== -1 ||
      _this._keysLeft.indexOf(evt.key) !== -1 ||
      _this._keysRight.indexOf(evt.key) !== -1;
  }

  public checkInputs(): void {
    if (this._onKeyDown) {
      // This boolean should be true for the overhead view and will pan
      if (this._activeMove) {
        const speed = 2 * this.camera!._computeLocalCameraSpeed();
        let transformMatrix = Matrix.Zero();
        let localDirection = Vector3.Zero();
        let transformedDirection = Vector3.Zero();
        // Keyboard
        for (let index = 0; index < this._keys.length; index++) {
          const keyCode = this._keys[index];
          if (this._keysLeft.indexOf(keyCode) !== -1) {
            localDirection.copyFromFloats(-speed, 0, 0);
          }
          else if (this._keysRight.indexOf(keyCode) !== -1) {
            localDirection.copyFromFloats(speed, 0, 0);
          }
          else if (this._keysUp.indexOf(keyCode) !== -1) {
            // change the zoom to stay at the same height
            localDirection.copyFromFloats(0, speed, speed);
          }
          else if (this._keysDown.indexOf(keyCode) !== -1) {
            // change the zoom to stay at the same height
            localDirection.copyFromFloats(0, -speed, -speed);
          }

          // While we don't need this complex of a solution to pan on the X and Z axis, this is a good
          // way to handle movement when the camera angle isn't fixed like ours is.
          this.camera!.getViewMatrix().invertToRef(transformMatrix);
          Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);
          this.camera!.position.addInPlace(transformedDirection);
          this.camera!.target.addInPlace(transformedDirection);
        }
      }
      // This should only be active when zoomed in, it uses the existing camera rotation code to rotate with keyboard input
      else if (this._activeRotate) {
        for (let index = 0; index < this._keys.length; index++) {
          const keyCode = this._keys[index];
          if (this._keysLeft.indexOf(keyCode) !== -1) {
            this.camera!.inertialAlphaOffset -= 3 / 1000;
          }
          else if (this._keysRight.indexOf(keyCode) !== -1) {
            this.camera!.inertialAlphaOffset -= -3 / 1000;
          }
          else if (this._keysUp.indexOf(keyCode) !== -1) {
            this.camera!.inertialBetaOffset -= 3 / 1000;
          }
          else if (this._keysDown.indexOf(keyCode) !== -1) {
            this.camera!.inertialBetaOffset -= -3 / 1000;
          }
        }
      }
    }
  }

  public detachControl(): void {
    console.log('detachControl');
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

  getSimpleName(): string {
    return 'KeyboardPan';
  }

  getClassName(): string {
    return 'ArcRotateCameraKeyboardPanInput';
  }
}

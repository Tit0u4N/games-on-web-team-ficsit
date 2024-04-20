import { ArcRotateCamera, ICameraInput, Matrix, Nullable, Vector3 } from '@babylonjs/core';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';

export class ArcRotateCameraKeyboardInputs implements ICameraInput<ArcRotateCamera> {
  private _keys: string[] = [];
  public _keysUp: string[] = ['z'];
  public _keysDown: string[] = ['s'];
  public _keysLeft: string[] = ['q'];
  public _keysRight: string[] = ['d'];
  public _keysZoomIn: string[] = ['+'];
  public _keysZoomOut: string[] = ['-'];
  private _activeMove: boolean = true;
  private _onKeyUp: ((evt: KeyboardEvent) => void) | null | undefined;
  private _onKeyDown: ((evt: KeyboardEvent) => void) | null | undefined;
  private _onKeyZoomIn: ((evt: KeyboardEvent) => void) | null | undefined;
  private _onKeyZoomOut: ((evt: KeyboardEvent) => void) | null | undefined;
  public camera: Nullable<ArcRotateCamera>;
  private _gameCorePresenter: GameCorePresenter;

  constructor(camera: ArcRotateCamera, gameCorePresenter: GameCorePresenter) {
    this.camera = camera;
    this._gameCorePresenter = gameCorePresenter;
  }

  public attachControl(noPreventDefault?: boolean): void {
    const _this = this;
    const engine = this.camera!.getEngine();
    const element = engine.getInputElement();
    if (!this._onKeyDown) {
      element!.tabIndex = 1;
      this._onKeyDown = function (evt) {
        if (ArcRotateCameraKeyboardInputs.isCameraMoveKey(_this, evt)) {
          const index = _this._keys.indexOf(evt.key);
          if (index === -1) {
            _this._keys.push(evt.key);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      this._onKeyUp = function (evt) {
        if (ArcRotateCameraKeyboardInputs.isCameraMoveKey(_this, evt)) {
          const index = _this._keys.indexOf(evt.key);
          if (index >= 0) {
            _this._keys.splice(index, 1);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      this._onKeyZoomIn = function (evt) {
        if (ArcRotateCameraKeyboardInputs.isCameraMoveKey(_this, evt)) {
          const index = _this._keys.indexOf(evt.key);
          if (index === -1) {
            _this._keys.push(evt.key);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      this._onKeyZoomOut = function (evt) {
        if (ArcRotateCameraKeyboardInputs.isCameraMoveKey(_this, evt)) {
          const index = _this._keys.indexOf(evt.key);
          if (index === -1) {
            _this._keys.push(evt.key);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      element!.addEventListener('keydown', this._onKeyDown, false);
      element!.addEventListener('keyup', this._onKeyUp, false);
      element!.addEventListener('keydown', this._onKeyZoomIn, false);
      element!.addEventListener('keydown', this._onKeyZoomOut, false);
    }
  }

  static isCameraMoveKey(_this: ArcRotateCameraKeyboardInputs, evt: KeyboardEvent) {
    return (
      _this._keysUp.indexOf(evt.key) !== -1 ||
      _this._keysDown.indexOf(evt.key) !== -1 ||
      _this._keysLeft.indexOf(evt.key) !== -1 ||
      _this._keysRight.indexOf(evt.key) !== -1 ||
      _this._keysZoomIn.indexOf(evt.key) !== -1 ||
      _this._keysZoomOut.indexOf(evt.key) !== -1
    );
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
          } else if (this._keysRight.indexOf(keyCode) !== -1) {
            localDirection.copyFromFloats(speed, 0, 0);
          } else if (this._keysUp.indexOf(keyCode) !== -1) {
            localDirection.copyFromFloats(0, speed, speed);
          } else if (this._keysDown.indexOf(keyCode) !== -1) {
            localDirection.copyFromFloats(0, -speed, -speed);
          } else if (this._keysZoomIn.indexOf(keyCode) !== -1) {
            const newTargetPosition = this.camera!.target.add(new Vector3(0, 0, speed));
            if (newTargetPosition.y >= -136) {
              localDirection.copyFromFloats(0, 0, speed * 2);
              this.checkTargetIsWithinMapLimits(newTargetPosition);
            }
          } else if (this._keysZoomOut.indexOf(keyCode) !== -1) {
            const newTargetPosition = this.camera!.target.add(new Vector3(0, 0, -speed));
            if (newTargetPosition.y <= 0) {
              localDirection.copyFromFloats(0, 0, -speed * 2);
              this.checkTargetIsWithinMapLimits(newTargetPosition);
            }
          }
          this.checkMovementIsPossible(transformedDirection, transformMatrix, localDirection);
        }
      }
    }
  }

  private checkTargetIsWithinMapLimits(newTargetPosition: Vector3) {
    const mapLimits = this._gameCorePresenter.getMapLimits();

    if (
      newTargetPosition.x >= mapLimits.left &&
      newTargetPosition.x <= mapLimits.right &&
      newTargetPosition.z >= mapLimits.top &&
      newTargetPosition.z <= mapLimits.bottom &&
      newTargetPosition.y >= -136 &&
      newTargetPosition.y <= 0
    ) {
      this.camera!.target = newTargetPosition;
    }
  }

  private checkMovementIsPossible(transformedDirection: Vector3, transformMatrix: Matrix, localDirection: Vector3) {
    // While we don't need this complex of a solution to pan on the X and Z axis, this is a good
    // way to handle movement when the camera angle isn't fixed like ours is.
    const mapLimits = this._gameCorePresenter.getMapLimits();

    // Update the camera position after checking the limits
    const newPosition = this.camera!.position.add(transformedDirection);
    console.log('newPosition', newPosition, localDirection, transformedDirection);
    // Check if the new position is within the map limits
    if (newPosition.x >= mapLimits.left && newPosition.x <= mapLimits.right) {
      this.camera!.getViewMatrix().invertToRef(transformMatrix);
      Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);
      this.camera!.position.addInPlace(transformedDirection);
      this.camera!.target.addInPlace(transformedDirection);
    } else if (newPosition.x < mapLimits.left) {
      this.camera!.position.x = mapLimits.left;
      this.camera!.target.x = mapLimits.left;
    } else if (newPosition.x > mapLimits.right) {
      this.camera!.position.x = mapLimits.right;
      this.camera!.target.x = mapLimits.right;
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

  public resetPositionCamera(): void {
    this.camera!.position = new Vector3(90, 150, -50);
    this.camera!.setTarget(new Vector3(90, 0, 50));
  }
}
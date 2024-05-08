import { ArcRotateCamera, ICameraInput, Matrix, Nullable, Vector3 } from '@babylonjs/core';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { config, debugConfig } from '../../../../core/Interfaces.ts';

/**
 * This class represents the keyboard input controls for the ArcRotateCamera in the Babylon.js engine.
 * It handles camera movement, zooming, and rotation based on user key presses.
 */
export class ArcRotateCameraKeyboardInputs implements ICameraInput<ArcRotateCamera> {
  private _keys: string[] = [];
  public _keysUp: string[] = config.arcRotateCameraKeyboardInputs.controls.keys.keysUp;
  public _keysDown: string[] = config.arcRotateCameraKeyboardInputs.controls.keys.keysDown;
  public _keysLeft: string[] = config.arcRotateCameraKeyboardInputs.controls.keys.keysLeft;
  public _keysRight: string[] = config.arcRotateCameraKeyboardInputs.controls.keys.keysRight;
  public _keysZoomIn: string[] = config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomIn;
  public _keysZoomOut: string[] = config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomOut;
  private _activeMove: boolean = true;
  private _onKeyUp: ((evt: KeyboardEvent) => void) | null | undefined;
  private _onKeyDown: ((evt: KeyboardEvent) => void) | null | undefined;
  public camera: Nullable<ArcRotateCamera>;
  private _gameCorePresenter: GameCorePresenter;
  private _currentHeightPosition: number = config.arcRotateCameraKeyboardInputs.config.defaultPositionHeight;
  private _currentHeightTarget: number = config.arcRotateCameraKeyboardInputs.config.defaultTargetHeight;

  /**
   * Creates a new instance of the ArcRotateCameraKeyboardInputs class.
   * @param camera - The ArcRotateCamera instance to control.
   * @param gameCorePresenter - The GameCorePresenter instance.
   */
  constructor(camera: ArcRotateCamera, gameCorePresenter: GameCorePresenter) {
    this.camera = camera;
    this._gameCorePresenter = gameCorePresenter;
  }

  /**
   * Attaches the keyboard input controls to the camera.
   * @param noPreventDefault - If set to true, the default behavior of the keyboard events won't be prevented.
   */
  public attachControl(noPreventDefault?: boolean): void {
    const _this = this;
    const engine = this.camera!.getEngine();
    const element = engine.getInputElement();
    if (!this._onKeyDown) {
      element!.tabIndex = 1;
      this._onKeyDown = function(evt) {
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
      this._onKeyUp = function(evt) {
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
      element!.addEventListener('keydown', this._onKeyDown, false);
      element!.addEventListener('keyup', this._onKeyUp, false);
      element!.addEventListener('keypress', function(evt) {
        if (config.arcRotateCameraKeyboardInputs.controls.keys.resetPosition.indexOf(evt.key) !== -1) {
          _this.resetPositionCamera();
        }
      });
      element!.addEventListener('blur', function() {
        _this._keys = [];
      });
      // Add event listener for mouse wheel
      element!.addEventListener('wheel', function(evt) {
        _this.onMouseWheel(evt);
      });
    }
  }

  /**
   * Handles the mouse wheel event for zooming in and out.
   * @param evt - The WheelEvent object containing the mouse wheel event data.
   */
  private onMouseWheel(evt: WheelEvent) {
    // Prevent the default behavior of the wheel event
    evt.preventDefault();
    // Zoom in when the wheel is scrolled upwards
    if (evt.deltaY < 0) {
      this.zoomIn();
    }
    // Zoom out when the wheel is scrolled downwards
    else if (evt.deltaY > 0) {
      this.zoomOut();
    }
  }

  /**
   * Checks if the pressed key is a camera movement key.
   * @param _this - The ArcRotateCameraKeyboardInputs instance.
   * @param evt - The KeyboardEvent object containing the key press event data.
   * @returns A boolean indicating whether the pressed key is a camera movement key.
   */
  static isCameraMoveKey(_this: ArcRotateCameraKeyboardInputs, evt: KeyboardEvent) {
    if (debugConfig.logs.arcRotateCameraKeyboardInputs.isCameraMoveKey)
      console.log(
        'isCameraMoveKey',
        evt.key,
        _this._keysUp,
        _this._keysDown,
        _this._keysLeft,
        _this._keysRight,
        _this._keysZoomIn,
        _this._keysZoomOut,
      );
    return (
      _this._keysUp.indexOf(evt.key) !== -1 ||
      _this._keysDown.indexOf(evt.key) !== -1 ||
      _this._keysLeft.indexOf(evt.key) !== -1 ||
      _this._keysRight.indexOf(evt.key) !== -1 ||
      _this._keysZoomIn.indexOf(evt.key) !== -1 ||
      _this._keysZoomOut.indexOf(evt.key) !== -1
    );
  }

  /**
   * Checks and processes the user's keyboard input for camera movement.
   */
  public checkInputs(): void {
    if (this._onKeyDown && this._activeMove) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkInputs)
        console.log(
          'checkInputs',
          this._keys,
          this._keysUp,
          this._keysDown,
          this._keysLeft,
          this._keysRight,
          this._keysZoomIn,
          this._keysZoomOut,
        );
      const speed = 2 * this.camera!._computeLocalCameraSpeed();
      let transformMatrix = Matrix.Zero();
      let localDirection = Vector3.Zero();
      let transformedDirection = Vector3.Zero();

      const keys = [
        ...this._keysUp,
        ...this._keysDown,
        ...this._keysLeft,
        ...this._keysRight,
        ...this._keysZoomIn,
        ...this._keysZoomOut,
      ];
      const pressedKeys = this._keys.filter((key) => keys.includes(key));

      for (const key of pressedKeys) {
        if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkInputs)
          console.log('key', key, this._keys, pressedKeys);
        this.checkKeyInput(key, localDirection, speed);
        this.checkMovementIsPossible(transformedDirection, transformMatrix, localDirection, key);
      }
    }
  }

  /**
   * Checks the user's key press and updates the camera's local direction accordingly.
   * @param keyCode - The key code of the pressed key.
   * @param localDirection - The local direction of the camera.
   * @param speed - The camera's movement speed.
   */
  private checkKeyInput(keyCode: string, localDirection: Vector3, speed: number) {
    if (this._keysLeft.indexOf(keyCode) !== -1) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkKeyInputs)
        console.log('_keysLeft', keyCode, this.camera!.target, this.camera!.position);
      localDirection.copyFromFloats(-speed, 0, 0);
    } else if (this._keysRight.indexOf(keyCode) !== -1) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkKeyInputs)
        console.log('_keysRight', keyCode, this.camera!.target, this.camera!.position);
      localDirection.copyFromFloats(speed, 0, 0);
    } else if (this._keysUp.indexOf(keyCode) !== -1) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkKeyInputs)
        console.log('keyUp', keyCode, this.camera!.target, this.camera!.position);
      localDirection.copyFromFloats(0, speed, speed);
    } else if (this._keysDown.indexOf(keyCode) !== -1) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkKeyInputs)
        console.log('_keysDown', keyCode, this.camera!.target, this.camera!.position);
      localDirection.copyFromFloats(0, -speed, -speed);
    } else if (this._keysZoomIn.indexOf(keyCode) !== -1) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkKeyInputs)
        console.log('_keysZoomIn', keyCode, this.camera!.target, this.camera!.position);
      const newTargetPosition = this.camera!.target.add(new Vector3(0, 0, speed));
      if (newTargetPosition.y >= config.arcRotateCameraKeyboardInputs.config.maxYZoomIn) {
        localDirection.copyFromFloats(0, 0, speed * 2);
        this.checkTargetIsWithinMapLimits(newTargetPosition);
      }
    } else if (this._keysZoomOut.indexOf(keyCode) !== -1) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkKeyInputs)
        console.log('_keysZoomOut', keyCode, this.camera!.target, this.camera!.position);
      const newTargetPosition = this.camera!.target.add(new Vector3(0, 0, -speed));
      if (newTargetPosition.y <= config.arcRotateCameraKeyboardInputs.config.maxYZoomOut) {
        localDirection.copyFromFloats(0, 0, -speed * 2);
        this.checkTargetIsWithinMapLimits(newTargetPosition);
      }
    }
  }

  /**
   * Checks if the new target position is within the map limits.
   * @param newTargetPosition - The new target position of the camera.
   */
  private checkTargetIsWithinMapLimits(newTargetPosition: Vector3) {
    const mapLimits = this._gameCorePresenter.getMapLimits();
    const zoomAdjustment =
      this.camera!.position.y == config.arcRotateCameraKeyboardInputs.config.defaultPositionHeight
        ? 0
        : config.arcRotateCameraKeyboardInputs.config.defaultPositionHeight - this.camera!.position.y;
    if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkTargetIsWithinMapLimits)
      console.log('newTargetPosition', newTargetPosition, mapLimits);
    if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkTargetIsWithinMapLimits)
      console.log(
        'condition',
        newTargetPosition.x >= mapLimits.left,
        newTargetPosition.x <= mapLimits.right,
        newTargetPosition.z <= mapLimits.top - 100 + zoomAdjustment,
        newTargetPosition.z >= -90,
        newTargetPosition.y >= config.arcRotateCameraKeyboardInputs.config.maxYZoomIn,
        newTargetPosition.y <= config.arcRotateCameraKeyboardInputs.config.maxYZoomOut,
      );
    if (
      newTargetPosition.x >= mapLimits.left &&
      newTargetPosition.x <= mapLimits.right &&
      newTargetPosition.z <= mapLimits.top - 100 + zoomAdjustment &&
      newTargetPosition.z >= -90 &&
      newTargetPosition.y >= config.arcRotateCameraKeyboardInputs.config.maxYZoomIn &&
      newTargetPosition.y <= config.arcRotateCameraKeyboardInputs.config.maxYZoomOut
    ) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkTargetIsWithinMapLimits)
        console.log('inside if', newTargetPosition, this.camera!.target, this.camera!.position);
      this.camera!.target = newTargetPosition;
      this._currentHeightTarget = newTargetPosition.y;
    }
  }

  /**
   * Checks if the camera movement is possible within the map limits.
   * @param transformedDirection - The transformed direction of the camera.
   * @param transformMatrix - The transformation matrix of the camera.
   * @param localDirection - The local direction of the camera.
   * @param keyCode - The key code of the pressed key.
   */
  private checkMovementIsPossible(
    transformedDirection: Vector3,
    transformMatrix: Matrix,
    localDirection: Vector3,
    keyCode: string,
  ) {
    // While we don't need this complex of a solution to pan on the X and Z axis, this is a good
    // way to handle movement when the camera angle isn't fixed like ours is.
    const mapLimits = this._gameCorePresenter.getMapLimits();
    const zoomAdjustment =
      this.camera!.position.y == config.arcRotateCameraKeyboardInputs.config.defaultPositionHeight
        ? 0
        : config.arcRotateCameraKeyboardInputs.config.defaultPositionHeight - this.camera!.position.y;

    if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkMovementIsPossible)
      console.log('this.camera!.position', this.camera!.position, this.camera!.target);

    // Update the camera position after checking the limits
    const newPosition = this.camera!.position.add(transformedDirection);
    if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkMovementIsPossible)
      console.log('newPosition', newPosition, localDirection, transformedDirection, mapLimits);
    // Check if the new position is within the map limits

    if (
      newPosition.x >= mapLimits.left &&
      newPosition.x <= mapLimits.right &&
      newPosition.z <= mapLimits.top - 100 + zoomAdjustment + 0.3 &&
      newPosition.z >= -90
    ) {
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkMovementIsPossible)
        console.log('Move the camera', newPosition, this.camera!.position, this.camera!.target);
      this.camera!.getViewMatrix().invertToRef(transformMatrix);
      Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);
      this.camera!.position.addInPlace(transformedDirection);
      this.camera!.target.addInPlace(transformedDirection);
      if (config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomIn.includes(keyCode) || config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomOut.includes(keyCode)) {
        this._currentHeightPosition = this.camera!.position.y;
        this._currentHeightTarget = this.camera!.target.y;
      } else {
        this.camera!.position.y = this._currentHeightPosition;
        this.camera!.target.y = this._currentHeightTarget;
      }
      if (debugConfig.logs.arcRotateCameraKeyboardInputs.checkMovementIsPossible)
        console.log('newPosition', newPosition, this.camera!.position, this.camera!.target);
    } else if (newPosition.x < mapLimits.left) {
      this.camera!.position.x = mapLimits.left;
      this.camera!.target.x = mapLimits.left;
    } else if (newPosition.x > mapLimits.right) {
      this.camera!.position.x = mapLimits.right - 0.5;
      this.camera!.target.x = mapLimits.right - 0.5;
    } else if (newPosition.z > mapLimits.top - 100 + zoomAdjustment) {
      this.camera!.position.z = mapLimits.top - 100 + zoomAdjustment - 0.5;
      this.camera!.target.z = mapLimits.top;
    } else if (newPosition.z < -90) {
      this.camera!.position.z = -90;
      this.camera!.target.z = 10;
    }
  }

  /**
   * Detaches the keyboard input controls from the camera.
   */
  public detachControl(): void {
    if (debugConfig.logs.arcRotateCameraKeyboardInputs.detachControl) console.log('detachControl');
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
    // Remove event listener for mouse wheel
    if (this.onMouseWheel) {
      element.removeEventListener('wheel', this.onMouseWheel);
    }
  }

  /**
   * Zooms the camera in.
   */
  public zoomIn(): void {
    for (let i = 0; i < 5; i++) {
      // i increase the zoom speed
      setTimeout(() => {
        this._keys.push(config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomIn[0]);
        this.checkInputs();
        this._keys = [];
      }, i * 50); // 50ms delay between each iteration
    }
  }

  /**
   * Zooms the camera out.
   */
  public zoomOut(): void {
    for (let i = 0; i < 5; i++) {
      // i increase the zoom speed
      setTimeout(() => {
        this._keys.push(config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomOut[0]);
        this.checkInputs();
        this._keys = [];
      }, i * 50); // 50ms delay between each iteration
    }
  }

  /**
   * Returns the simple name of the input.
   * @returns The simple name of the input.
   */
  getSimpleName(): string {
    return 'KeyboardPan';
  }

  /**
   * Returns the class name of the input.
   * @returns The class name of the input.
   */
  getClassName(): string {
    return 'ArcRotateCameraKeyboardPanInput';
  }

  /**
   * Resets the camera's position to the default position.
   */
  public resetPositionCamera(): void {
    this.detachControl();
    this._keys = [];
    this.camera!.setPosition(
      new Vector3(
        config.arcRotateCameraKeyboardInputs.resetPositionCamera.direction.x,
        config.arcRotateCameraKeyboardInputs.resetPositionCamera.direction.y,
        config.arcRotateCameraKeyboardInputs.resetPositionCamera.direction.z,
      ),
    );
    this.camera!.setTarget(
      new Vector3(
        config.arcRotateCameraKeyboardInputs.resetPositionCamera.target.x,
        config.arcRotateCameraKeyboardInputs.resetPositionCamera.target.y,
        config.arcRotateCameraKeyboardInputs.resetPositionCamera.target.z,
      ),
    );
    this._currentHeightPosition = this.camera!.position.y;
    this._currentHeightTarget = this.camera!.target.y;
    this.attachControl();
  }
}

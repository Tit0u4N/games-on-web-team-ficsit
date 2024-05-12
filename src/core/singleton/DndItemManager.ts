import { UsableObject } from '../../modules/object/model/UsableObject.ts';

type UseStateItem = (item: UsableObject | null) => void;

export class DnDItemManager {
  private static instance: DnDItemManager;
  private draggedItem: UsableObject | null = null;
  private startDragCaseUseState: UseStateItem | null = null;

  private constructor() {}

  static getInstance(): DnDItemManager {
    if (!DnDItemManager.instance) {
      DnDItemManager.instance = new DnDItemManager();
    }
    return DnDItemManager.instance;
  }

  getDraggedItem() {
    if (this.startDragCaseUseState && this.draggedItem) {
      this.startDragCaseUseState(null);
    }
    return this.draggedItem;
  }

  setDraggedItem(item: UsableObject | null, useStateItem: UseStateItem) {
    this.draggedItem = item;
    this.startDragCaseUseState = useStateItem;
  }
}

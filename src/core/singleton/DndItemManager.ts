import { UsableObject } from '../../modules/object/model/UsableObject.ts';
import { Inventory } from '../../modules/inventory/model/Inventory.ts';
import { EquippedObjectSlot } from '../../modules/inventory/model/EquippedObjects.ts';

type ItemHandlerUseState = (newItem: UsableObject | null) => void;

export class DnDItemManager {
  private static instance: DnDItemManager;
  private draggedItem: UsableObject | null = null;
  private startDragItemHandler: ItemHandlerUseState | null = null;
  private startDragInventory: Inventory | null = null;

  private constructor() {}

  static getInstance(): DnDItemManager {
    if (!DnDItemManager.instance) {
      DnDItemManager.instance = new DnDItemManager();
    }
    return DnDItemManager.instance;
  }

  dropItem(
    endDragItem: UsableObject | null,
    endDragItemHandler: ItemHandlerUseState,
    endDragItemInventory: Inventory,
    slot?: EquippedObjectSlot,
  ): void {
    if (!this.draggedItem || !this.startDragItemHandler || !this.startDragInventory) return;
    if (slot) {
      if (!endDragItemInventory.equippedItems.canBePlacedInSlot(slot, this.draggedItem)) return;
      // Replace the item in the slot
      endDragItemInventory.equippedItems.equip(this.draggedItem, slot);
      endDragItemHandler(this.draggedItem);

      this.startDragInventory.removeItem(this.draggedItem);
      endDragItem && this.startDragInventory.addItem(endDragItem);
      this.startDragItemHandler(endDragItem);
    } else {
      // Add the item to the new inventory and remove it from the old one
      this.startDragItemHandler(endDragItem);
      this.startDragInventory.removeItem(this.draggedItem);
      endDragItem && this.startDragInventory.addItem(endDragItem);

      // If there was an item in the new inventory, remove it from there
      endDragItemHandler(this.draggedItem);
      endDragItem && endDragItemInventory.removeItem(endDragItem);
      endDragItemInventory.addItem(this.draggedItem);
    }

    this.clearDraggedItem();
  }

  setDraggedItem(item: UsableObject | null, itemHandler: ItemHandlerUseState, inventory: Inventory): void {
    this.draggedItem = item;
    this.startDragItemHandler = itemHandler;
    this.startDragInventory = inventory;
  }

  private clearDraggedItem() {
    this.draggedItem = null;
    this.startDragItemHandler = null;
    this.startDragInventory = null;
  }
}

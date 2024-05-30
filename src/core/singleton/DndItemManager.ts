import { UsableObject } from '../../modules/object/model/UsableObject.ts';
import { Inventory } from '../../modules/inventory/model/Inventory.ts';
import { EquippedObjectSlot } from '../../modules/inventory/model/EquippedObjects.ts';

type ItemHandlerUseState = (newItem: UsableObject | null) => void;

export class DnDItemManager {
  private static instance: DnDItemManager;
  private draggedItem: UsableObject | null = null;
  private startDragItemHandler: ItemHandlerUseState | null = null;
  private startDragInventory: Inventory | null = null;
  private startDragPosition: number | null = null;
  private startDragSlot: EquippedObjectSlot | null = null;

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
    position?: number,
    slot?: EquippedObjectSlot,
  ): void {
    if (slot || this.startDragSlot) {
      this.dropItemInSlot(endDragItem, endDragItemHandler, endDragItemInventory, slot, position);
    } else if (position) {
      this.dropClassicItem(endDragItem, endDragItemHandler, endDragItemInventory, position);
    }
    this.clearDraggedItem();
  }

  private dropItemInSlot(
    endDragItem: UsableObject | null,
    endDragItemHandler: ItemHandlerUseState,
    endDragItemInventory: Inventory,
    endDragSlot: EquippedObjectSlot | undefined,
    endDragPosition: number | undefined,
  ) {
    if (!this.draggedItem || !this.startDragItemHandler || !this.startDragInventory) return;
    // When the item is dropped in a slot from another slot
    if (
      endDragSlot &&
      this.startDragSlot &&
      endDragItemInventory.equippedItems.canBePlacedInSlot(endDragSlot, this.draggedItem) &&
      this.startDragInventory.equippedItems.canBePlacedInSlot(this.startDragSlot, endDragItem)
    ) {
      endDragItemInventory.equipItem(this.draggedItem, endDragSlot);
      endDragItemHandler(this.draggedItem);

      this.startDragInventory.equipItem(endDragItem, this.startDragSlot);
      this.startDragItemHandler(endDragItem);
      // When the item is dropped in a slot
    } else if (
      endDragSlot &&
      !this.startDragSlot &&
      endDragItemInventory.equippedItems.canBePlacedInSlot(endDragSlot, this.draggedItem)
    ) {
      endDragItemInventory.equipItem(this.draggedItem, endDragSlot);
      endDragItemHandler(this.draggedItem);

      this.startDragInventory.removeItem(this.draggedItem);
      endDragItem && this.startDragInventory.addItem(endDragItem);
      this.startDragItemHandler(endDragItem);

      // When the item is dropped from a slot in the inventory
    } else if (
      this.startDragSlot &&
      endDragItem &&
      this.startDragInventory.equippedItems.canBePlacedInSlot(this.startDragSlot, endDragItem) &&
      !endDragSlot
    ) {
      // Replace the item in the slot
      this.startDragInventory.equipItem(endDragItem, this.startDragSlot);
      this.startDragItemHandler(endDragItem);

      endDragItemInventory.removeItem(endDragItem);
      this.startDragInventory.addItem(this.draggedItem);
      endDragItemHandler(this.draggedItem);
    } else if (
      this.startDragSlot &&
      !endDragItem &&
      endDragPosition !== null &&
      endDragPosition !== undefined &&
      !endDragSlot
    ) {
      this.startDragInventory.unEquipItem(this.startDragSlot);
      this.startDragItemHandler(null);

      endDragItemInventory.addItem(this.draggedItem, endDragPosition);
      endDragItemHandler(this.draggedItem);
    }
  }

  private dropClassicItem(
    endDragItem: UsableObject | null,
    endDragItemHandler: ItemHandlerUseState,
    endDragItemInventory: Inventory,
    position: number,
  ) {
    if (!this.draggedItem || !this.startDragItemHandler || !this.startDragInventory) return;
    // Add the item to the new inventory and remove it from the old one
    this.startDragItemHandler(endDragItem);
    this.startDragInventory.removeItem(this.draggedItem);
    endDragItem && this.startDragInventory.addItem(endDragItem, this.startDragPosition || undefined);

    // If there was an item in the new inventory, remove it from there
    endDragItemHandler(this.draggedItem);
    endDragItem && endDragItemInventory.removeItem(endDragItem);
    endDragItemInventory.addItem(this.draggedItem, position);
  }

  setDraggedItem(
    item: UsableObject | null,
    itemHandler: ItemHandlerUseState,
    inventory: Inventory,
    position?: number,
    slot?: EquippedObjectSlot,
  ): void {
    this.draggedItem = item;
    this.startDragItemHandler = itemHandler;
    this.startDragInventory = inventory;
    this.startDragPosition = position || null;
    this.startDragSlot = slot || null;
  }

  private clearDraggedItem() {
    this.draggedItem = null;
    this.startDragItemHandler = null;
    this.startDragInventory = null;
    this.startDragPosition = null;
    this.startDragSlot = null;
  }
}

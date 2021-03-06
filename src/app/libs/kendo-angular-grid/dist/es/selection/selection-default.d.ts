import { EventEmitter } from '@angular/core';
import { GridComponent } from "../grid.component";
import { Subscription } from "rxjs/Subscription";
import { RowArgs } from "../rendering/common/row-class";
import { SelectionEvent } from "./selection.service";
/**
 * @hidden
 */
export declare class Selection {
    protected grid: GridComponent;
    /**
     * Defines the collection that will store the selected item keys.
     */
    selectedKeys: any[];
    /**
     * Defines the item key that will be stored in the `selectedKeys` collection.
     */
    selectionKey: string | ((context: RowArgs) => any);
    /**
     * Fires when the `selectedKeys` collection has been updated.
     */
    selectedKeysChange: EventEmitter<any[]>;
    protected selectionChangeSubscription: Subscription;
    constructor(grid: GridComponent);
    protected init(): void;
    /**
     * @hidden
     */
    destroy(): void;
    /**
     * @hidden
     */
    reset(): void;
    protected getItemKey(row: RowArgs): any;
    protected onSelectionChange(selection: SelectionEvent): void;
}

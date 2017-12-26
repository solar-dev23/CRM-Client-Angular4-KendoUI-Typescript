import { EventEmitter, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
/**
 * @hidden
 */
export declare type Entity = {
    index: number;
    group: any;
};
/**
 * @hidden
 */
export declare type CommandAction = 'edit' | 'remove' | 'cancel' | 'save' | 'add';
/**
 * @hidden
 */
export declare type CommandEvent = {
    action: CommandAction;
    formGroup?: FormGroup;
    isNew?: boolean;
    rowIndex?: number;
};
/**
 * @hidden
 */
export declare class EditService {
    ngZone: NgZone;
    changes: EventEmitter<CommandEvent>;
    private editedIndices;
    private newItemGroup;
    private keepEditCell;
    private keepCellTimeout;
    private column;
    private closingCell;
    constructor(ngZone: NgZone);
    editRow(index: number, group?: any): void;
    addRow(group: any): void;
    editCell(rowIndex: number, column: any, group?: any): void;
    readonly hasNewItem: boolean;
    readonly newDataItem: any;
    close(index?: number): void;
    closeCell(originalEvent?: any): boolean;
    cancelCell(): void;
    shouldCloseCell(): boolean;
    preventCellClose(): void;
    context(index?: number): Entity;
    columnContext(index: number, column: any): Entity;
    isEdited(index: number): boolean;
    hasEdited(index: number): boolean;
    isEditedColumn(index: number, column: any): boolean;
    beginEdit(rowIndex: number): void;
    beginAdd(): void;
    endEdit(rowIndex?: number): void;
    save(rowIndex?: number): void;
    remove(rowIndex: number): void;
    private findByIndex(index);
}

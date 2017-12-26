import { ColumnBase } from '../columns/column-base';
/**
 * The returned type of the `columnResize` event.
 */
export interface ColumnResizeArgs {
    /**
     * The resized column.
     */
    column: ColumnBase;
    /**
     * The new width of the column.
     */
    newWidth?: number;
    /**
     * The actual width of the column prior to resizing.
     */
    oldWidth: number;
}
/**
 * @hidden
 */
export declare type ActionType = 'start' | 'resizeColumn' | 'resizeTable' | 'end';
/**
 * @hidden
 */
export interface ColumnResizeAction {
    columns: Array<ColumnBase>;
    delta?: number;
    deltaPercent?: number;
    locked?: boolean;
    resizedColumns?: Array<ColumnResizeArgs>;
    type: ActionType;
}

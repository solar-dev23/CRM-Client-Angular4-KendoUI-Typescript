import { EventEmitter } from '@angular/core';
import { ColumnBase } from '../columns/column-base';
import { ColumnResizeAction, ColumnResizeArgs } from './column-resize.interface';
/**
 * @hidden
 */
export declare class ColumnResizingService {
    changes: EventEmitter<ColumnResizeAction>;
    private column;
    private resizedColumns;
    start(column: ColumnBase): void;
    resizeColumns(deltaPercent: number): void;
    resizeTable(delta: number): void;
    resizedColumn(state: ColumnResizeArgs): void;
    end(): void;
}

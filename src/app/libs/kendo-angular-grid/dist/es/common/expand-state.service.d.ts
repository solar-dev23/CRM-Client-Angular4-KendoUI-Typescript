import { EventEmitter } from '@angular/core';
/**
 * @hidden
 */
export declare abstract class ExpandStateService {
    protected isInitiallyCollapsed: boolean;
    changes: EventEmitter<{
        dataItem: any;
        expand: boolean;
        index: number;
    }>;
    protected rowState: number[];
    constructor(isInitiallyCollapsed: boolean);
    toggleRow(index: any, dataItem: any): void;
    isExpanded(index: any): boolean;
    reset(): void;
}

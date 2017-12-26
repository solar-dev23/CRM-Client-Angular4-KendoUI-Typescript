import { ElementRef, OnDestroy } from '@angular/core';
import { ColumnComponent } from '../columns/column.component';
/**
 * @hidden
 */
export declare class DraggableDirective implements OnDestroy {
    kendoGridDraggable: ColumnComponent;
    kendo: any;
    column: ColumnComponent;
    private draggable;
    constructor(element: ElementRef);
    ngOnDestroy(): void;
}

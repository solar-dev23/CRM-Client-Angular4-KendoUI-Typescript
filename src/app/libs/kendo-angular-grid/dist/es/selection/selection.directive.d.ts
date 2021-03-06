import { OnInit, OnDestroy } from '@angular/core';
import { GridComponent } from '../grid.component';
import { Selection } from "./selection-default";
/**
 * A directive which stores the row selection state of the Grid in memory.
 */
export declare class SelectionDirective extends Selection implements OnInit, OnDestroy {
    protected grid: GridComponent;
    constructor(grid: GridComponent);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}

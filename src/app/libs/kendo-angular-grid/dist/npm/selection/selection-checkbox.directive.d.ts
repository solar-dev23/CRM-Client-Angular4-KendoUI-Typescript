import { AfterContentChecked, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { SelectionService } from './selection.service';
/**
 * Represents the row selection checkbox of the Grid.
 * The directive expects the index of the current row as an input parameter. For more information, refer to the example below.
 *
 * Apply the directive to an `input` element inside the
 * [`CheckboxColumnComponent`]({% slug api_grid_checkboxcolumncomponent_kendouiforangular %}).
 *
 * When the user clicks the checkbox that is associated with the directive,
 * a [`selectionChange`]({% slug api_grid_gridcomponent_kendouiforangular %}#toc-selectionChange) event is triggered.
 *
 * @example
 * ```ts-no-run
 * <kendo-grid>
 *   <kendo-grid-checkbox-column title="Custom checkbox">
 *     <ng-template kendoGridCellTemplate let-idx="rowIndex">
 *       <input [kendoGridSelectionCheckbox]="idx" />
 *     </ng-template>
 *   </kendo-grid-checkbox-column>
 * </kendo-grid>
 * ```
 */
export declare class SelectionCheckboxDirective implements AfterContentChecked, OnDestroy {
    private selectionService;
    private el;
    private renderer;
    /**
     * The current index of the `dataItem` that will be selected.
     */
    itemIndex: number;
    type: string;
    private destroyClick;
    ngAfterContentChecked(): void;
    constructor(selectionService: SelectionService, el: ElementRef, renderer: Renderer2);
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    onClick(): void;
    private setCheckedState();
}

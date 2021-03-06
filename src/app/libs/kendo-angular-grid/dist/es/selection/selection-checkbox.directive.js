/* tslint:disable:no-input-rename */
import { Directive, HostBinding, ElementRef, Input, Renderer2 } from '@angular/core';
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
var SelectionCheckboxDirective = (function () {
    function SelectionCheckboxDirective(selectionService, el, renderer) {
        this.selectionService = selectionService;
        this.el = el;
        this.renderer = renderer;
        this.type = "checkbox";
        this.destroyClick = this.renderer.listen(this.el.nativeElement, "click", this.onClick.bind(this));
    }
    SelectionCheckboxDirective.prototype.ngAfterContentChecked = function () {
        this.setCheckedState();
    };
    SelectionCheckboxDirective.prototype.ngOnDestroy = function () {
        if (this.destroyClick) {
            this.destroyClick();
        }
    };
    /**
     * @hidden
     */
    SelectionCheckboxDirective.prototype.onClick = function () {
        if (this.selectionService.options.enabled) {
            var ev = this.selectionService.toggleByIndex(this.itemIndex);
            ev.ctrlKey = false;
            //Setting the deprecated `index` and `selected` properties
            ev.index = this.itemIndex;
            ev.selected = ev.selectedRows.length > ev.deselectedRows.length;
            this.selectionService.changes.emit(ev);
        }
    };
    /*
     * @hidden
     */
    SelectionCheckboxDirective.prototype.setCheckedState = function () {
        this.renderer.setProperty(this.el.nativeElement, "checked", this.selectionService.isSelected(this.itemIndex));
    };
    return SelectionCheckboxDirective;
}());
export { SelectionCheckboxDirective };
SelectionCheckboxDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoGridSelectionCheckbox]'
            },] },
];
/** @nocollapse */
SelectionCheckboxDirective.ctorParameters = function () { return [
    { type: SelectionService, },
    { type: ElementRef, },
    { type: Renderer2, },
]; };
SelectionCheckboxDirective.propDecorators = {
    'itemIndex': [{ type: Input, args: ["kendoGridSelectionCheckbox",] },],
    'type': [{ type: HostBinding, args: ['attr.type',] },],
};

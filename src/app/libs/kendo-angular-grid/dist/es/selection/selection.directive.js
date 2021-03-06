import * as tslib_1 from "tslib";
import { Directive } from '@angular/core';
import { GridComponent } from '../grid.component';
import { Selection } from "./selection-default";
/**
 * A directive which stores the row selection state of the Grid in memory.
 */
var SelectionDirective = (function (_super) {
    tslib_1.__extends(SelectionDirective, _super);
    function SelectionDirective(grid) {
        var _this = _super.call(this, grid) || this;
        _this.grid = grid;
        return _this;
    }
    /**
     * @hidden
     */
    SelectionDirective.prototype.ngOnInit = function () {
        if (this.grid.selectable === false) {
            this.grid.selectable = true;
        }
        this.grid.selectionDirective = true;
    };
    /**
     * @hidden
     */
    SelectionDirective.prototype.ngOnDestroy = function () {
        _super.prototype.destroy.call(this);
    };
    return SelectionDirective;
}(Selection));
export { SelectionDirective };
SelectionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoGridSelectBy]'
            },] },
];
/** @nocollapse */
SelectionDirective.ctorParameters = function () { return [
    { type: GridComponent, },
]; };

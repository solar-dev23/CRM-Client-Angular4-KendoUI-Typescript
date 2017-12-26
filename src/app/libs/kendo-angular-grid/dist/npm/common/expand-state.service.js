"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * @hidden
 */
var ExpandStateService = (function () {
    function ExpandStateService(isInitiallyCollapsed) {
        this.isInitiallyCollapsed = isInitiallyCollapsed;
        this.changes = new core_1.EventEmitter();
        this.rowState = [];
    }
    ExpandStateService.prototype.toggleRow = function (index, dataItem) {
        var rowIndex = this.rowState.indexOf(index);
        var found = rowIndex === -1;
        this.rowState = found ? this.rowState.concat([index]) : this.rowState.slice(0, rowIndex).concat(this.rowState.slice(rowIndex + 1));
        this.changes.emit({ dataItem: dataItem, expand: this.isInitiallyCollapsed ? found : !found, index: index });
    };
    ExpandStateService.prototype.isExpanded = function (index) {
        var found = this.rowState.indexOf(index) >= 0;
        return this.isInitiallyCollapsed ? found : !found;
    };
    ExpandStateService.prototype.reset = function () {
        this.rowState = [];
    };
    return ExpandStateService;
}());
exports.ExpandStateService = ExpandStateService;

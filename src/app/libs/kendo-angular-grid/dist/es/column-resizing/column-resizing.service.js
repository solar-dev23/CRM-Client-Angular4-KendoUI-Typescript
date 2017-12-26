import { Injectable, EventEmitter } from '@angular/core';
import { leafColumns, children } from '../columns/column-common';
/**
 * @hidden
 */
var isLocked = function (column) { return column.parent ? isLocked(column.parent) : !!column.locked; };
/**
 * @hidden
 */
var resizeArgs = function (column, extra) { return Object.assign({
    columns: column.isColumnGroup ? leafColumns(children(column)) : [column],
    locked: isLocked(column)
}, extra); }; // tslint:disable-line:align
/**
 * @hidden
 */
var ColumnResizingService = (function () {
    function ColumnResizingService() {
        this.changes = new EventEmitter();
    }
    ColumnResizingService.prototype.start = function (column) {
        this.column = column;
        this.resizedColumns = [];
        var columns = this.column.isColumnGroup ? leafColumns(children(column)) : [];
        this.changes.emit({
            columns: [column].concat(columns),
            locked: isLocked(this.column),
            type: 'start'
        });
    };
    ColumnResizingService.prototype.resizeColumns = function (deltaPercent) {
        var action = resizeArgs(this.column, {
            deltaPercent: deltaPercent,
            type: 'resizeColumn'
        });
        this.changes.emit(action);
    };
    ColumnResizingService.prototype.resizeTable = function (delta) {
        var action = resizeArgs(this.column, {
            delta: delta,
            type: 'resizeTable'
        });
        this.changes.emit(action);
    };
    ColumnResizingService.prototype.resizedColumn = function (state) {
        this.resizedColumns.push(state);
    };
    ColumnResizingService.prototype.end = function () {
        this.changes.emit({
            columns: [],
            resizedColumns: this.resizedColumns,
            type: 'end'
        });
    };
    return ColumnResizingService;
}());
export { ColumnResizingService };
ColumnResizingService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ColumnResizingService.ctorParameters = function () { return []; };

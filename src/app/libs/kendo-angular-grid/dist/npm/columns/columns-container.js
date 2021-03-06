"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var column_group_component_1 = require("./column-group.component");
var reset = function () {
    var lists = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lists[_i] = arguments[_i];
    }
    var diff = false;
    for (var idx = 0; idx < lists.length; idx++) {
        var _a = lists[idx], list = _a[0], columns = _a[1];
        diff = diff || list.length !== columns.length;
        list.reset(columns);
    }
    return diff;
};
/**
 * @hidden
 */
var ColumnsContainer = (function () {
    function ColumnsContainer(columns) {
        this.columns = columns;
        this.allColumns = new core_1.QueryList();
        this.leafColumns = new core_1.QueryList();
        this.lockedColumns = new core_1.QueryList();
        this.nonLockedColumns = new core_1.QueryList();
        this.lockedLeafColumns = new core_1.QueryList();
        this.nonLockedLeafColumns = new core_1.QueryList();
        this.totalLevels = 0;
        this.changes = new core_1.EventEmitter();
    }
    ColumnsContainer.prototype.refresh = function () {
        var _this = this;
        var currentLevels = this.totalLevels;
        var leafColumns = new Array();
        var lockedLeafColumns = new Array();
        var nonLockedLeafColumns = new Array();
        var lockedColumns = new Array();
        var nonLockedColumns = new Array();
        var allColumns = new Array();
        this.totalLevels = 0;
        this.columns().forEach(function (column) {
            var containerLeafColumns = column.isLocked === true ? lockedLeafColumns : nonLockedLeafColumns;
            var containerColumns = column.isLocked === true ? lockedColumns : nonLockedColumns;
            if (!column_group_component_1.isColumnGroupComponent(column)) {
                containerLeafColumns.push(column);
                leafColumns.push(column);
            }
            containerColumns.push(column);
            allColumns.push(column);
            _this.totalLevels = column.level > _this.totalLevels ? column.level : _this.totalLevels;
        });
        var changes = reset([this.leafColumns, leafColumns], [this.lockedLeafColumns, lockedLeafColumns], [this.nonLockedLeafColumns, nonLockedLeafColumns], [this.lockedColumns, lockedColumns], [this.allColumns, allColumns], [this.nonLockedColumns, nonLockedColumns]) || currentLevels !== this.totalLevels;
        if (changes) {
            this.changes.emit();
        }
    };
    return ColumnsContainer;
}());
exports.ColumnsContainer = ColumnsContainer;

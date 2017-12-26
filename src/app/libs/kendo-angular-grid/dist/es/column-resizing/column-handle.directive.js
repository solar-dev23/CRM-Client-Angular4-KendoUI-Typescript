import { Directive, ElementRef, Host, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import { isBlank, isPresent } from '../utils';
import { DraggableDirective } from '../common/draggable.directive';
import { ColumnResizingService } from './column-resizing.service';
/**
 * @hidden
 */
var fromPercentage = function (value, percent) {
    var sign = percent < 0 ? -1 : 1;
    return Math.ceil((Math.abs(percent) / 100) * value) * sign;
};
/**
 * @hidden
 */
var toPercentage = function (value, whole) { return (value / whole) * 100; };
/**
 * @hidden
 */
var headerWidth = function (handle) { return handle.nativeElement.parentElement.offsetWidth; };
/**
 * @hidden
 */
var flatHeaderColumns = function (columns) {
    return columns.reduce(function (acc, column) {
        if (column.isSpanColumn) {
            acc = acc.concat(column.childColumns.toArray());
        }
        else if (!column.isColumnGroup) {
            acc.push(column);
        }
        return acc;
    }, []); // tslint:disable-line:align
};
/**
 * @hidden
 */
var stopPropagation = function (_a) {
    var event = _a.originalEvent;
    event.stopPropagation();
    event.preventDefault();
};
/**
 * @hidden
 */
var createMoveStream = function (service, draggable) { return function (mouseDown) {
    return draggable.kendo.drag
        .takeUntil(draggable.kendo.release
        .do(function (_) { return service.end(); }))
        .map(function (_a) {
        var pageX = _a.pageX;
        return ({
            originalX: mouseDown.pageX,
            pageX: pageX
        });
    });
}; };
/**
 * @hidden
 */
var ColumnHandleDirective = (function () {
    function ColumnHandleDirective(draggable, element, service) {
        this.draggable = draggable;
        this.element = element;
        this.service = service;
        this.columns = [];
        this.subscriptions = new Subscription();
    }
    Object.defineProperty(ColumnHandleDirective.prototype, "visible", {
        get: function () {
            return this.column.resizable ? 'block' : 'none';
        },
        enumerable: true,
        configurable: true
    });
    ColumnHandleDirective.prototype.ngOnInit = function () {
        var _this = this;
        var service = this.service.changes
            .filter(function () { return _this.column.resizable; })
            .filter(function (e) { return isPresent(e.columns.find(function (column) { return column === _this.column; })); });
        this.subscriptions.add(service.filter(function (e) { return e.type === 'start'; })
            .subscribe(this.initState.bind(this)));
        this.subscriptions.add(service.filter(function (e) { return e.type === 'resizeColumn'; })
            .subscribe(this.resize.bind(this)));
        this.subscriptions.add(this.service.changes
            .filter(function (e) { return e.type === 'start'; })
            .filter(this.shouldUpdate.bind(this))
            .take(1) //on first resize only
            .subscribe(this.initColumnWidth.bind(this)));
        this.subscriptions.add(this.draggable.kendo.press
            .do(stopPropagation)
            .do(function (_) { return _this.service.start(_this.column); })
            .switchMap(createMoveStream(this.service, this.draggable))
            .subscribe(function (_a) {
            var pageX = _a.pageX, originalX = _a.originalX;
            var delta = pageX - originalX;
            var percent = toPercentage(delta, _this.originalWidth);
            _this.service.resizeColumns(percent);
        }));
    };
    ColumnHandleDirective.prototype.ngOnDestroy = function () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    };
    ColumnHandleDirective.prototype.shouldUpdate = function () {
        return !flatHeaderColumns(this.columns)
            .map(function (column) { return column.width; })
            .some(isBlank);
    };
    ColumnHandleDirective.prototype.initColumnWidth = function () {
        this.column.width = headerWidth(this.element);
    };
    ColumnHandleDirective.prototype.initState = function () {
        this.originalWidth = headerWidth(this.element);
        this.service.resizedColumn({
            column: this.column,
            oldWidth: this.originalWidth
        });
    };
    ColumnHandleDirective.prototype.resize = function (_a) {
        var deltaPercent = _a.deltaPercent;
        var delta = fromPercentage(this.originalWidth, deltaPercent);
        var newWidth = Math.max(this.originalWidth + delta, this.column.minResizableWidth);
        this.column.width = newWidth;
        var tableDelta = newWidth > this.column.minResizableWidth ?
            delta : this.column.minResizableWidth - this.originalWidth;
        this.service.resizeTable(tableDelta);
    };
    return ColumnHandleDirective;
}());
export { ColumnHandleDirective };
ColumnHandleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoGridColumnHandle]'
            },] },
];
/** @nocollapse */
ColumnHandleDirective.ctorParameters = function () { return [
    { type: DraggableDirective, decorators: [{ type: Host },] },
    { type: ElementRef, },
    { type: ColumnResizingService, },
]; };
ColumnHandleDirective.propDecorators = {
    'columns': [{ type: Input },],
    'column': [{ type: Input },],
    'visible': [{ type: HostBinding, args: ['style.display',] },],
};

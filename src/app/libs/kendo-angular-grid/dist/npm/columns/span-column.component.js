"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var cell_template_directive_1 = require("../rendering/cell-template.directive");
var edit_template_directive_1 = require("../editing/edit-template.directive");
var column_base_1 = require("./column-base");
var column_component_1 = require("./column.component");
var utils_1 = require("../utils");
/**
 * @hidden
 */
function isSpanColumnComponent(column) {
    return column.isSpanColumn;
}
exports.isSpanColumnComponent = isSpanColumnComponent;
/**
 * Represents a column which can be spanned over multiple data cells while the individual header and footer cells are retained.
 * This behavior enables you to achieve more flexible layout and, at the same time,
 * keep the built-in UI element for sorting, filtering, and grouping.
 * The columns that will be merged have to be wrapped inside the `<kendo-grid-span-column>` tag.
 *
 * @example
 * ```ts-preview
 *
 * _@Component({
 *    selector: 'my-app',
 *    template: `
 *        <kendo-grid
 *              [sortable]="true"
 *              [filterable]="true"
 *              [kendoGridBinding]="products">
 *          <kendo-grid-column field="ProductID" title="Product ID" width="120">
 *          </kendo-grid-column>
 *          <kendo-grid-span-column>
 *              <kendo-grid-column field="ProductName" title="Product Name">
 *              </kendo-grid-column>
 *              <kendo-grid-column field="UnitPrice" title="Unit Price" filter="numeric" width="180" format="{0:c}">
 *              </kendo-grid-column>
 *          </kendo-grid-span-column>
 *          <kendo-grid-column field="Discontinued" width="120" filter="boolean">
 *              <ng-template kendoGridCellTemplate let-dataItem>
 *                  <input type="checkbox" [checked]="dataItem.Discontinued" disabled/>
 *              </ng-template>
 *          </kendo-grid-column>
 *        </kendo-grid>
 *    `
 * })
 *
 * class AppComponent {
 *   public products = [{
 *      "ProductID": 1,
 *      "ProductName": "Chai",
 *      "UnitPrice": 18.0000,
 *      "Discontinued": true
 *    }, {
 *      "ProductID": 2,
 *      "ProductName": "Chang",
 *      "UnitPrice": 19.0000,
 *      "Discontinued": false
 *    }
 *   ];
 * }
 *
 * ```
 *
 * By default, the data cell displays the data for the specified fields.
 * To further customize the spanned-column functionality,
 * you can use a [cell template]({% slug api_grid_celltemplatedirective_kendouiforangular %}).
 *
 * ```html-no-run
 * <kendo-grid-span-column>
 *  <kendo-grid-column field="field1" title="Field 1"></kendo-grid-column>
 *  <kendo-grid-column field="field2" title="Field 2"></kendo-grid-column>
 *    <ng-template kendoGridCellTemplate let-dataItem>
 *        <h5>{{ dataItem.field1 }}</h5>
 *        <p>{{ dataItem.field2 }}</p>
 *    </ng-template>
 *  </kendo-grid-span-column>
 * ```
 */
var SpanColumnComponent = (function (_super) {
    tslib_1.__extends(SpanColumnComponent, _super);
    function SpanColumnComponent(parent) {
        var _this = _super.call(this, parent) || this;
        /*
         * @hidden
         */
        _this.isSpanColumn = true;
        _this.template = new core_1.QueryList();
        _this.editTemplate = new core_1.QueryList();
        /**
         * @hidden
         */
        _this.childColumns = new core_1.QueryList();
        _this._editable = true;
        _this._hidden = false;
        _this._locked = false;
        if (parent && parent.isSpanColumn) {
            throw new Error('SpanColumn cannot be nested inside another SpanColumn');
        }
        return _this;
    }
    Object.defineProperty(SpanColumnComponent.prototype, "hidden", {
        get: function () {
            return this._hidden || this.childColumns.toArray().every(function (x) { return x.hidden; });
        },
        /**
         * Sets the visibility of the column.
         *
         * @default false
         */
        set: function (value) {
            this._hidden = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanColumnComponent.prototype, "editable", {
        get: function () {
            return utils_1.isPresent(this.editTemplateRef) && this._editable;
        },
        /**
         * Defines whether the edit template of the column will be rendered. The default value is `false`.
         *
         * > To enable the editing functionality for a spanned column, set an edit template for it.
         *
         * @example
         * ```ts-no-run
         * <kendo-grid>
         *    <kendo-grid-span-column [editable]="false">
         *      <kendo-grid-column field="UnitPrice">
         *      </kendo-grid-column>
         *      <kendo-grid-column field="ProductName">
         *      </kendo-grid-column>
         *      <ng-template kendoGridEditTemplate>
         *         .....
         *      </ng-template>
         *    </kendo-grid-span-column>
         * </kendo-grid>
         * ```
         */
        set: function (value) {
            this._editable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanColumnComponent.prototype, "templateRef", {
        /**
         * @hidden
         */
        get: function () {
            var template = this.template.first;
            return template ? template.templateRef : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanColumnComponent.prototype, "editTemplateRef", {
        /**
         * @hidden
         */
        get: function () {
            var editTemplate = this.editTemplate.first;
            return editTemplate ? editTemplate.templateRef : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanColumnComponent.prototype, "colspan", {
        /**
         * @hidden
         */
        get: function () {
            return this.childColumns.filter(function (c) { return !c.hidden; }).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanColumnComponent.prototype, "locked", {
        get: function () {
            return this._locked || this.childColumns.some(function (c) { return c.locked; });
        },
        /**
         * Toggles the locked (frozen) state of the columns.
         * Locked columns are visible at all times during the horizontal scrolling of the Grid.
         * For the option to work properly, make sure that the Grid is configured to meet the following requirements:
         * - Scrolling is enabled.
         * - The `height` option of the Grid is set.
         * - The widths of all Grid columns are explicitly set in pixels.
         * In this way, the Grid adjusts the layout of the locked and unlocked columns.
         *
         * @default false
         *
         * @example
         * ```ts
         * _@Component({
         *    selector: 'my-app',
         *    template: `
         *        <kendo-grid [data]="gridData" [scrollable]="scrollable" style="height: 200px">
         *          <kendo-grid-span-column [locked]="true">
         *             <kendo-grid-column field="ProductID" title="Product ID" width="120">
         *             </kendo-grid-column>
         *             <kendo-grid-column field="ProductName" title="Product Name" width="200">
         *             </kendo-grid-column>
         *          <kendo-grid-span-column>
         *          <kendo-grid-column field="UnitPrice" title="Unit Price" width="230">
         *          </kendo-grid-column>
         *        </kendo-grid>
         *    `
         * })
         *
         * class AppComponent {
         *    private gridData: any[];
         *
         *    constructor() {
         *        this.gridData = products;
         *    }
         * }
         *
         * const products = [{
         *    "ProductID": 1,
         *    "ProductName": "Chai",
         *    "UnitPrice": 18.0000,
         *    "Discontinued": true
         *  }, {
         *    "ProductID": 2,
         *    "ProductName": "Chang",
         *    "UnitPrice": 19.0000,
         *    "Discontinued": false
         *  }
         * ];
         *
         * ```
         */
        set: function (value) {
            this._locked = value;
        },
        enumerable: true,
        configurable: true
    });
    return SpanColumnComponent;
}(column_base_1.ColumnBase));
SpanColumnComponent.decorators = [
    { type: core_1.Component, args: [{
                providers: [
                    {
                        provide: column_base_1.ColumnBase,
                        useExisting: core_1.forwardRef(function () { return SpanColumnComponent; }) // tslint:disable-line:no-forward-ref
                    }
                ],
                selector: 'kendo-grid-span-column',
                template: ""
            },] },
];
/** @nocollapse */
SpanColumnComponent.ctorParameters = function () { return [
    { type: column_base_1.ColumnBase, decorators: [{ type: core_1.SkipSelf }, { type: core_1.Host }, { type: core_1.Optional },] },
]; };
SpanColumnComponent.propDecorators = {
    'template': [{ type: core_1.ContentChildren, args: [cell_template_directive_1.CellTemplateDirective, { descendants: false },] },],
    'editTemplate': [{ type: core_1.ContentChildren, args: [edit_template_directive_1.EditTemplateDirective, { descendants: false },] },],
    'childColumns': [{ type: core_1.ContentChildren, args: [column_component_1.ColumnComponent,] },],
    'hidden': [{ type: core_1.Input },],
    'editable': [{ type: core_1.Input },],
    'locked': [{ type: core_1.Input },],
};
exports.SpanColumnComponent = SpanColumnComponent;

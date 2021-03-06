import { Component, Input, ContentChildren, QueryList, Optional, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { saveAs } from '@progress/kendo-file-saver';
import { toDataURL, workbookOptions, ColumnBase } from '@progress/kendo-angular-excel-export';
import { RTL } from '@progress/kendo-angular-l10n';
import { ExcelService } from './excel.service';
import { ExcelExportEvent } from './excel-export-event';
/* tslint:disable object-literal-sort-keys */
var fetchComponentData = function (component) {
    return {
        data: component.view.map(function (item) { return item; }),
        group: component.group
    };
};
/**
 * Configures the Excel export settings of the Kendo UI Grid.
 */
var ExcelComponent = (function () {
    function ExcelComponent(excelService, rtl) {
        this.rtl = rtl;
        /**
         * Specifies the file name of the exported Excel file.
         * @default "Export.xlsx"
         */
        this.fileName = 'Export.xlsx';
        /**
         * @hidden
         */
        this.columns = new QueryList();
        this.saveSubscription = excelService.saveToExcel.subscribe(this.save.bind(this));
        this.saveFile = this.saveFile.bind(this);
    }
    ExcelComponent.prototype.ngOnDestroy = function () {
        this.saveSubscription.unsubscribe();
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    };
    ExcelComponent.prototype.save = function (component) {
        var _this = this;
        var data = (this.fetchData || fetchComponentData)(component);
        var exportData = function (result) {
            delete _this.dataSubscription;
            _this.exportData(component, result);
        };
        if (data instanceof Promise) {
            data.then(exportData);
        }
        else if (data instanceof Observable) {
            this.dataSubscription = data.take(1).subscribe(exportData);
        }
        else {
            exportData(data);
        }
    };
    ExcelComponent.prototype.exportData = function (component, result) {
        var options = workbookOptions({
            columns: this.columns.length ? this.columns : component.columns,
            data: result.data,
            group: result.group,
            filterable: this.filterable,
            creator: this.creator,
            date: this.date,
            paddingCellOptions: this.paddingCellOptions,
            headerPaddingCellOptions: this.headerPaddingCellOptions,
            rtl: this.rtl
        });
        var args = new ExcelExportEvent(options);
        component.excelExport.emit(args);
        if (!args.isDefaultPrevented()) {
            toDataURL(options).then(this.saveFile);
        }
    };
    ExcelComponent.prototype.saveFile = function (dataURL) {
        saveAs(dataURL, this.fileName, {
            forceProxy: this.forceProxy,
            proxyURL: this.proxyURL
        });
    };
    return ExcelComponent;
}());
export { ExcelComponent };
ExcelComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-grid-excel',
                template: ""
            },] },
];
/** @nocollapse */
ExcelComponent.ctorParameters = function () { return [
    { type: ExcelService, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
]; };
ExcelComponent.propDecorators = {
    'fileName': [{ type: Input },],
    'filterable': [{ type: Input },],
    'creator': [{ type: Input },],
    'date': [{ type: Input },],
    'forceProxy': [{ type: Input },],
    'proxyURL': [{ type: Input },],
    'fetchData': [{ type: Input },],
    'paddingCellOptions': [{ type: Input },],
    'headerPaddingCellOptions': [{ type: Input },],
    'columns': [{ type: ContentChildren, args: [ColumnBase, { descendants: true },] },],
};

import * as tslib_1 from "tslib";
import { Component, Input, ContentChild, ContentChildren, ElementRef, NgZone, QueryList } from '@angular/core';
import { SuspendService } from '../scrolling/suspend.service';
import { PDFService } from './pdf.service';
import { PDFMarginComponent } from './pdf-margin.component';
import { PDFTemplateDirective } from './pdf-template.directive';
import { exportElement } from './export-element';
import { GridQuery } from './grid-query';
import { ColumnBase } from '../columns/column-base';
import { PDFExportComponent } from '../../../../kendo-angular-pdf-export/dist/es/main';
// import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';


var createElement = function (tagName, className) {
    var element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    return element;
};
var createDiv = function (className) {
    return createElement('div', className);
};
/**
 * Configures the PDF export settings of the Kendo UI Grid.
 */
var PDFComponent = (function (_super) {
    tslib_1.__extends(PDFComponent, _super);
    function PDFComponent(pdfService, suspendService, ngZone, element) {
        var _this = _super.call(this, element) || this;
        _this.pdfService = pdfService;
        _this.suspendService = suspendService;
        _this.ngZone = ngZone;
        _this.columns = new QueryList();
        _this.saveSubscription = pdfService.savePDF.subscribe(_this.savePDF.bind(_this));
        _this.exportSubscription = pdfService.exportPDF.subscribe(_this.exportPDF.bind(_this));
        _this.reset = _this.reset.bind(_this);
        _this.draw = _this.draw.bind(_this);
        _this.export = _this.export.bind(_this);
        return _this;
    }
    PDFComponent.prototype.ngOnDestroy = function () {
        this.saveSubscription.unsubscribe();
        this.exportSubscription.unsubscribe();
        this.reset();
    };
    PDFComponent.prototype.savePDF = function (component) {
        console.log(component, 'pdf.component.js', 'savePDF component');
        var pageSize = component.pageSize;
        var total = component.view.total;
        var columns = this.columns.toArray();
        console.log(columns, 'pdf.component.js', 'savePDF columns');
        if (columns.length) {
            this.originalColumns = component.columns.toArray();
        }
        this.component = component;
        this.suspendService.scroll = true;
        this.initProgress();
        this.renderAllPages = this.allPages && pageSize < total;
        if (this.renderAllPages) {
            console.log('renderAllPages', 'pdf.component.js', 'savePDF');
            this.skip = component.skip;
            this.pageSize = pageSize;
            this.changePage(0, total, this.draw, columns);
        }
        else if (columns.length) {
            this.changeColumns(columns, this.draw);
        }
        else {
            this.draw();
        }
    };
    PDFComponent.prototype.exportPDF = function (component) {
        var pageSize = component.pageSize;
        var total = component.view.total;
        var columns = this.columns.toArray();
        if (columns.length) {
            this.originalColumns = component.columns.toArray();
        }
        this.component = component;
        this.suspendService.scroll = true;
        this.initProgress();
        this.renderAllPages = this.allPages && pageSize < total;
        if (this.renderAllPages) {
            this.skip = component.skip;
            this.pageSize = pageSize;
            this.changePage(0, total, this.export, columns);
        }
        else if (columns.length) {
            this.changeColumns(columns, this.export);
        }
        else {
            this.export();
        }
    };
    PDFComponent.prototype.initProgress = function () {
        var wrapperElement = this.component.wrapper.nativeElement;
        var progress = this.progress = createDiv('k-loading-pdf-mask');
        var overlay = wrapperElement.cloneNode(true);
        progress.appendChild(overlay);
        progress.appendChild(createDiv('k-loading-color'));
        progress.appendChild(createElement('span', 'k-i-loading k-icon'));
        this.originalHeight = wrapperElement.style.height;
        this.originalOverflow = wrapperElement.style.overflow;
        wrapperElement.style.height = wrapperElement.offsetHeight + 'px';
        wrapperElement.style.overflow = 'hidden';
        wrapperElement.appendChild(progress);
        this.applyScroll(overlay);
    };
    PDFComponent.prototype.applyScroll = function (overlay) {
        var query = new GridQuery(this.component.wrapper.nativeElement);
        var content = query.content();
        if (content) {
            var overlayQuery = new GridQuery(overlay);
            var overlayContent = overlayQuery.content();
            overlayContent.scrollTop = content.scrollTop;
            overlayContent.scrollLeft = content.scrollLeft;
            overlayQuery.header().scrollLeft = query.header().scrollLeft;
            var footer = query.footer();
            if (footer) {
                overlayQuery.footer().scrollLeft = footer.scrollLeft;
            }
            var lockedContent = query.content(true);
            if (lockedContent) {
                var overlayLockedContent = overlayQuery.content(true);
                overlayLockedContent.scrollTop = lockedContent.scrollTop;
                overlayLockedContent.scrollLeft = lockedContent.scrollLeft;
            }
        }
    };
    PDFComponent.prototype.draw = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            var container = _this.container = createDiv('k-grid-pdf-export-element');
            var element = exportElement(_this.component.wrapper.nativeElement);
            container.appendChild(element);
            document.body.appendChild(container);
            _this.save(element, _this.fileName);
        });
    };
    PDFComponent.prototype.export = function () {
        var _this = this;
        _this.ngZone.runOutsideAngular(function () {
            var container = _this.container = createDiv('k-grid-pdf-export-element');
            var element = exportElement(_this.component.wrapper.nativeElement);
            container.appendChild(element);
            document.body.appendChild(container);
            
            const pdfString = _this.exportAsString(element);
            _this.pdfService.exportDone.emit(pdfString);
        });
    };
    PDFComponent.prototype.drawOptions = function () {
        console.log('drawOptions')
        var options = _super.prototype.drawOptions.call(this);
        options._destructive = true;
        return options;
    };
    PDFComponent.prototype.cleanup = function () {
        _super.prototype.cleanup.call(this);
        if (this.component) {
            var originalColumns = this.originalColumns;
            delete this.originalColumns;
            if (this.renderAllPages) {
                this.changePage(this.skip, this.pageSize, this.reset, originalColumns);
            }
            else if (originalColumns) {
                this.changeColumns(originalColumns, this.reset);
            }
            else {
                this.reset();
            }
        }
        else {
            this.reset();
        }
        this.removeContainer();
    };
    PDFComponent.prototype.removeContainer = function () {
        if (this.container) {
            document.body.removeChild(this.container);
            delete this.container;
        }
    };
    PDFComponent.prototype.changePage = function (skip, take, callback, columns) {
        var _this = this;
        this.ngZone.run(function () {
            _this.pdfService.dataChanged.take(1).subscribe(function () {
                if (columns && columns.length) {
                    _this.changeColumns(columns, callback);
                }
                else {
                    _this.onStable(callback);
                }
            });
            _this.component.notifyPageChange('pdf', { skip: skip, take: take });
        });
    };
    PDFComponent.prototype.changeColumns = function (columns, callback) {
        var _this = this;
        this.ngZone.run(function () {
            _this.onStable(callback);
            _this.component.columns.reset(columns);
        });
    };
    PDFComponent.prototype.reset = function () {
        this.suspendService.scroll = false;
        this.renderAllPages = false;
        if (!this.component) {
            return;
        }
        var wrapperElement = this.component.wrapper.nativeElement;
        wrapperElement.removeChild(this.progress);
        wrapperElement.style.height = this.originalHeight;
        wrapperElement.style.overflow = this.originalOverflow;
        delete this.progress;
        delete this.component;
    };
    PDFComponent.prototype.onStable = function (callback) {
        var _this = this;
        // not sure if it is an actual scenario. occurs in the tests.
        // onStable is triggered in the same pass without the change detection
        // thus the callback is called before the changes are applied without the timeout
        setTimeout(function () {
            _this.ngZone.onStable.asObservable().take(1).subscribe(callback);
        }, 0); // tslint:disable-line: align
    };
    return PDFComponent;
}(PDFExportComponent));
export { PDFComponent };
PDFComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-grid-pdf',
                template: ''
            },] },
];
/** @nocollapse */
PDFComponent.ctorParameters = function () { return [
    { type: PDFService, },
    { type: SuspendService, },
    { type: NgZone, },
    { type: ElementRef, },
]; };
PDFComponent.propDecorators = {
    'allPages': [{ type: Input },],
    'columns': [{ type: ContentChildren, args: [ColumnBase,] },],
    'marginComponent': [{ type: ContentChild, args: [PDFMarginComponent,] },],
    'pageTemplateDirective': [{ type: ContentChild, args: [PDFTemplateDirective,] },],
};

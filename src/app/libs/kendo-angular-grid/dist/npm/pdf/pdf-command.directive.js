"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var pdf_service_1 = require("./pdf.service");
/**
 * Represents the **Export to PDF** command of the Grid.
 *
 * You can apply this directive to any `button` element inside a
 * [`ToolbarTemplate`]({% slug api_grid_commandcolumncomponent_kendouiforangular %}).
 *
 * When the user clicks a button associated with the directive, the
 * [`pdfExport`]({% slug api_grid_gridcomponent_kendouiforangular %}#toc-pdfexport) event
 * fires. For more information, refer to the [PDF export example]({% slug pdfexport_grid_kendouiforangular %}).
 *
 * @example
 * ```ts-no-run
 * <kendo-grid>
 *      <ng-template kendoGridToolbarTemplate>
 *          <button kendoGridPDFCommand>Export to PDF</button>
 *      </ng-template>
 *      <kendo-grid-pdf fileName="Grid.pdf">
 *      </kendo-grid-pdf>
 * </kendo-grid>
 * ```
 */
var PDFCommandDirective = (function () {
    function PDFCommandDirective(pdfService) {
        this.pdfService = pdfService;
    }
    /**
     * @hidden
     */
    PDFCommandDirective.prototype.click = function () {
        this.pdfService.exportClick.emit();
    };
    Object.defineProperty(PDFCommandDirective.prototype, "buttonClass", {
        /**
         * @hidden
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PDFCommandDirective.prototype, "pdfClass", {
        /**
         * @hidden
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return PDFCommandDirective;
}());
PDFCommandDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoGridPDFCommand]'
            },] },
];
/** @nocollapse */
PDFCommandDirective.ctorParameters = function () { return [
    { type: pdf_service_1.PDFService, },
]; };
PDFCommandDirective.propDecorators = {
    'click': [{ type: core_1.HostListener, args: ['click',] },],
    'buttonClass': [{ type: core_1.HostBinding, args: ['class.k-button',] },],
    'pdfClass': [{ type: core_1.HostBinding, args: ['class.k-grid-pdf',] },],
};
exports.PDFCommandDirective = PDFCommandDirective;

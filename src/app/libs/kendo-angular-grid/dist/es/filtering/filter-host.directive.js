import { Directive, Input, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { StringFilterCellComponent } from './string-filter-cell.component';
import { isNullOrEmptyString, anyChanged } from '../utils';
import { filterComponentFactory } from './filter-cell-component.factory';
/**
 * @hidden
 */
var FilterHostDirective = (function () {
    function FilterHostDirective(host, resolver) {
        this.host = host;
        this.resolver = resolver;
    }
    FilterHostDirective.prototype.ngOnInit = function () {
        this.component = this.host.createComponent(this.resolver.resolveComponentFactory(this.componentType()));
        this.initComponent({
            column: this.column,
            filter: this.filter
        });
    };
    FilterHostDirective.prototype.ngOnDestroy = function () {
        if (this.component) {
            this.component.destroy();
            this.component = null;
        }
    };
    FilterHostDirective.prototype.ngOnChanges = function (changes) {
        if (anyChanged(["column", "filter"], changes)) {
            this.initComponent({
                column: this.column,
                filter: this.filter
            });
        }
    };
    FilterHostDirective.prototype.componentType = function () {
        if (!isNullOrEmptyString(this.column.filter)) {
            return filterComponentFactory(this.column.filter);
        }
        return StringFilterCellComponent;
    };
    FilterHostDirective.prototype.initComponent = function (_a) {
        var column = _a.column, filter = _a.filter;
        var instance = this.component.instance;
        instance.column = column;
        instance.filter = filter;
    };
    return FilterHostDirective;
}());
export { FilterHostDirective };
FilterHostDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoFilterHost]'
            },] },
];
/** @nocollapse */
FilterHostDirective.ctorParameters = function () { return [
    { type: ViewContainerRef, },
    { type: ComponentFactoryResolver, },
]; };
FilterHostDirective.propDecorators = {
    'column': [{ type: Input },],
    'filter': [{ type: Input },],
};

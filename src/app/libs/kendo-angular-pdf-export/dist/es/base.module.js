import { NgModule } from '@angular/core';
import { BaseComponent } from './base.component';
var COMPONENT_DIRECTIVES = [BaseComponent];
/**
 * Base module
 */
var BaseModule = (function () {
    function BaseModule() {
    }
    return BaseModule;
}());
export { BaseModule };
BaseModule.decorators = [
    { type: NgModule, args: [{
                declarations: [COMPONENT_DIRECTIVES],
                exports: [COMPONENT_DIRECTIVES]
            },] },
];
/** @nocollapse */
BaseModule.ctorParameters = function () { return []; };

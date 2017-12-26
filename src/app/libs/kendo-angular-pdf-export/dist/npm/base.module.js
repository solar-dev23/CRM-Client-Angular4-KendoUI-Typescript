"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var base_component_1 = require("./base.component");
var COMPONENT_DIRECTIVES = [base_component_1.BaseComponent];
/**
 * Base module
 */
var BaseModule = (function () {
    function BaseModule() {
    }
    return BaseModule;
}());
BaseModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [COMPONENT_DIRECTIVES],
                exports: [COMPONENT_DIRECTIVES]
            },] },
];
/** @nocollapse */
BaseModule.ctorParameters = function () { return []; };
exports.BaseModule = BaseModule;

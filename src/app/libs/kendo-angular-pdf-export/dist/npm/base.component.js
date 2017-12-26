"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("./util");
var util_2 = require("./sub/util");
/**
 * A sample component
 *
 */
var BaseComponent = (function () {
    function BaseComponent() {
        this.util = util_1.util;
        this.subUtil = util_2.util;
    }
    Object.defineProperty(BaseComponent.prototype, "className", {
        get: function () {
            return "k-widget";
        },
        enumerable: true,
        configurable: true
    });
    return BaseComponent;
}());
BaseComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'kendo-component',
                template: "<div class=\"my-class\">A Kendo UI angular component {{util}} {{subUtil}}</div>"
            },] },
];
/** @nocollapse */
BaseComponent.ctorParameters = function () { return []; };
BaseComponent.propDecorators = {
    'className': [{ type: core_1.HostBinding, args: ["class",] },],
};
exports.BaseComponent = BaseComponent;

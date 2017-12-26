import { Component, HostBinding } from '@angular/core';
import { util } from "./util";
import { util as subUtil } from "./sub/util";
/**
 * A sample component
 *
 */
var BaseComponent = (function () {
    function BaseComponent() {
        this.util = util;
        this.subUtil = subUtil;
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
export { BaseComponent };
BaseComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-component',
                template: "<div class=\"my-class\">A Kendo UI angular component {{util}} {{subUtil}}</div>"
            },] },
];
/** @nocollapse */
BaseComponent.ctorParameters = function () { return []; };
BaseComponent.propDecorators = {
    'className': [{ type: HostBinding, args: ["class",] },],
};

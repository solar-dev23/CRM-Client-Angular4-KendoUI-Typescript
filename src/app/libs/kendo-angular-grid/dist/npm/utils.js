"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/from");
require("rxjs/add/observable/merge");
/**
 * @hidden
 */
exports.isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
exports.isBlank = function (value) { return value === null || value === undefined; };
/**
 * @hidden
 */
exports.isArray = function (value) { return Array.isArray(value); };
/**
 * @hidden
 */
exports.isTruthy = function (value) { return !!value; };
/**
 * @hidden
 */
exports.isNullOrEmptyString = function (value) { return exports.isBlank(value) || (value.trim && value.trim().length === 0); };
/**
 * @hidden
 */
exports.isChanged = function (propertyName, changes, skipFirstChange) {
    if (skipFirstChange === void 0) { skipFirstChange = true; }
    return (changes[propertyName] && (!changes[propertyName].isFirstChange() || !skipFirstChange) &&
        changes[propertyName].previousValue !== changes[propertyName].currentValue);
};
/**
 * @hidden
 */
exports.anyChanged = function (propertyNames, changes, skipFirstChange) {
    if (skipFirstChange === void 0) { skipFirstChange = true; }
    return propertyNames.some(function (name) { return exports.isChanged(name, changes, skipFirstChange); });
};
/**
 * @hidden
 */
exports.observe = function (list) { return Observable_1.Observable.from([list]).merge(list.changes); };
/**
 * @hidden
 */
exports.isUniversal = function () { return typeof document === 'undefined'; };
/**
 * @hidden
 */
exports.extractFormat = function (format) {
    if (!exports.isNullOrEmptyString(format) && format.startsWith('{0:')) {
        return format.slice(3, format.length - 1);
    }
    return format;
};
/**
 * @hidden
 */
exports.not = function (fn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return !fn.apply(null, args);
}; };
/**
 * @hidden
 */
exports.or = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (value) { return conditions.reduce(function (acc, x) { return x(value) || acc; }, false); };
};
/**
 * @hidden
 */
exports.and = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (value) { return conditions.reduce(function (acc, x) { return x(value) && acc; }, true); };
};
/**
 * @hidden
 */
exports.Skip = new core_1.InjectionToken("Skip"); // tslint:disable-line:variable-name

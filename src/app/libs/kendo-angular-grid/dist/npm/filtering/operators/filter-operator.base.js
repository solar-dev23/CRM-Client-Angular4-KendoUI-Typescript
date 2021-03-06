"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("../../utils");
var localizeOperators = function (operators) { return function (localization) {
    return Object.keys(operators).reduce(function (acc, key) {
        acc[operators[key]] = localization.get(key);
        return acc;
    }, {});
}; }; // tslint:disable-line:align
var operatorTexts = localizeOperators({
    "filterEqOperator": "eq",
    "filterNotEqOperator": "neq",
    // tslint:disable-next-line:object-literal-sort-keys
    "filterGteOperator": "gte",
    "filterGtOperator": "gt",
    "filterLteOperator": "lte",
    "filterLtOperator": "lt",
    "filterIsNullOperator": "isnull",
    "filterIsNotNullOperator": "isnotnull",
    "filterIsEmptyOperator": "isempty",
    "filterIsNotEmptyOperator": "isnotempty",
    "filterContainsOperator": "contains",
    "filterNotContainsOperator": "doesnotcontain",
    "filterStartsWithOperator": "startswith",
    "filterEndsWithOperator": "endswith"
});
/**
 * @hidden
 */
exports.toJSON = function (xs) { return xs.map(function (x) { return x.toJSON(); }); };
/**
 * @hidden
 */
var FilterOperatorBase = (function () {
    function FilterOperatorBase(operator, localization) {
        this.operator = operator;
        this.localization = localization;
        this.messages = operatorTexts(this.localization);
        this._text = this.messages[this.operator];
    }
    Object.defineProperty(FilterOperatorBase.prototype, "text", {
        /**
         * The text to be displayed in the DropDownList.
         * @readonly
         * @type {string}
         * @memberOf FilterOperatorBase
         */
        get: function () {
            return this._text;
        },
        /**
         *
         */
        set: function (value) {
            this._text = utils_1.isNullOrEmptyString(value) ? this.messages[this.operator] : value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    FilterOperatorBase.prototype.toJSON = function () {
        return {
            text: this.text,
            value: this.operator
        };
    };
    return FilterOperatorBase;
}());
FilterOperatorBase.propDecorators = {
    'text': [{ type: core_1.Input },],
};
exports.FilterOperatorBase = FilterOperatorBase;

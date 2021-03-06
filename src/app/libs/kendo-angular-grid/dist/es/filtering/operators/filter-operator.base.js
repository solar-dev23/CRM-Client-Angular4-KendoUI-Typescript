import { Input } from '@angular/core';
import { isNullOrEmptyString } from '../../utils';
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
export var toJSON = function (xs) { return xs.map(function (x) { return x.toJSON(); }); };
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
            this._text = isNullOrEmptyString(value) ? this.messages[this.operator] : value;
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
export { FilterOperatorBase };
FilterOperatorBase.propDecorators = {
    'text': [{ type: Input },],
};

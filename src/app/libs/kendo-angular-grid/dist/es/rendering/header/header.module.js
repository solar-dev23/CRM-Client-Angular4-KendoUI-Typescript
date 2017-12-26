import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { GroupModule } from "../../grouping/group.module";
import { SharedModule } from "../../shared.module";
import { RowFilterModule } from '../../filtering/filtering.module';
import { HeaderTemplateDirective } from "./header-template.directive";
import { ColumnHandleDirective } from './../../column-resizing/column-handle.directive';
import { SelectAllCheckboxDirective } from "../../selection/selectall-checkbox.directive";
var exportedModules = [
    HeaderComponent,
    HeaderTemplateDirective,
    ColumnHandleDirective,
    SelectAllCheckboxDirective
];
var importedModules = [
    CommonModule,
    GroupModule,
    RowFilterModule,
    SharedModule
];
/**
 * @hidden
 */
var HeaderModule = (function () {
    function HeaderModule() {
    }
    HeaderModule.exports = function () {
        return [
            HeaderTemplateDirective,
            SelectAllCheckboxDirective
        ];
    };
    return HeaderModule;
}());
export { HeaderModule };
HeaderModule.decorators = [
    { type: NgModule, args: [{
                declarations: [exportedModules],
                exports: [exportedModules],
                imports: importedModules.slice()
            },] },
];
/** @nocollapse */
HeaderModule.ctorParameters = function () { return []; };

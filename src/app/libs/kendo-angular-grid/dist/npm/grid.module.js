"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var grid_component_1 = require("./grid.component");
var list_component_1 = require("./rendering/list.component");
var kendo_angular_intl_1 = require("@progress/kendo-angular-intl");
var databinding_directive_1 = require("./databinding.directive");
var selection_directive_1 = require("./selection/selection.directive");
var localized_messages_directive_1 = require("./localization/localized-messages.directive");
var custom_messages_component_1 = require("./localization/custom-messages.component");
var filtering_module_1 = require("./filtering/filtering.module");
var pager_module_1 = require("./pager/pager.module");
var group_module_1 = require("./grouping/group.module");
var header_module_1 = require("./rendering/header/header.module");
var body_module_1 = require("./rendering/body.module");
var footer_module_1 = require("./rendering/footer/footer.module");
var shared_module_1 = require("./shared.module");
var toolbar_template_directive_1 = require("./rendering/toolbar/toolbar-template.directive");
var toolbar_component_1 = require("./rendering/toolbar/toolbar.component");
var kendo_angular_resize_sensor_1 = require("@progress/kendo-angular-resize-sensor");
var template_editing_directive_1 = require("./editing-directives/template-editing.directive");
var reactive_editing_directive_1 = require("./editing-directives/reactive-editing.directive");
var in_cell_editing_directive_1 = require("./editing-directives/in-cell-editing.directive");
var group_scroll_binding_directive_1 = require("./grouping/group-scroll-binding.directive");
var exportedModules = [
    grid_component_1.GridComponent,
    toolbar_template_directive_1.ToolbarTemplateDirective,
    toolbar_component_1.ToolbarComponent,
    databinding_directive_1.DataBindingDirective,
    selection_directive_1.SelectionDirective,
    custom_messages_component_1.CustomMessagesComponent,
    group_scroll_binding_directive_1.GroupBindingDirective,
    template_editing_directive_1.TemplateEditingDirective,
    reactive_editing_directive_1.ReactiveEditingDirective,
    in_cell_editing_directive_1.InCellEditingDirective
].concat(group_module_1.GroupModule.exports(), shared_module_1.SharedModule.exports(), body_module_1.BodyModule.exports(), header_module_1.HeaderModule.exports(), footer_module_1.FooterModule.exports(), pager_module_1.PagerModule.exports(), filtering_module_1.RowFilterModule.exports());
var declarations = [
    grid_component_1.GridComponent,
    list_component_1.ListComponent,
    toolbar_component_1.ToolbarComponent,
    localized_messages_directive_1.LocalizedMessagesDirective,
    custom_messages_component_1.CustomMessagesComponent,
    databinding_directive_1.DataBindingDirective,
    toolbar_template_directive_1.ToolbarTemplateDirective,
    selection_directive_1.SelectionDirective,
    template_editing_directive_1.TemplateEditingDirective,
    reactive_editing_directive_1.ReactiveEditingDirective,
    in_cell_editing_directive_1.InCellEditingDirective,
    group_scroll_binding_directive_1.GroupBindingDirective
];
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the Grid component.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Grid module
 * import { GridModule } from '@progress/kendo-angular-grid';
 *
 * // The browser platform with a compiler
 * import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *
 * import { NgModule } from '@angular/core';
 *
 * // Import the app component
 * import { AppComponent } from './app.component';
 *
 * // Define the app module
 * _@NgModule({
 *     declarations: [AppComponent], // declare app component
 *     imports:      [BrowserModule, GridModule], // import Grid module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var GridModule = (function () {
    function GridModule() {
    }
    return GridModule;
}());
GridModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [declarations],
                exports: [exportedModules],
                imports: [
                    common_1.CommonModule,
                    group_module_1.GroupModule,
                    shared_module_1.SharedModule,
                    body_module_1.BodyModule,
                    header_module_1.HeaderModule,
                    footer_module_1.FooterModule,
                    pager_module_1.PagerModule,
                    filtering_module_1.RowFilterModule,
                    kendo_angular_resize_sensor_1.ResizeSensorModule
                ],
                providers: [
                    { provide: kendo_angular_intl_1.IntlService, useClass: kendo_angular_intl_1.CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
GridModule.ctorParameters = function () { return []; };
exports.GridModule = GridModule;

import { AfterContentInit, AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, Renderer2, QueryList, SimpleChange, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { SortDescriptor, GroupDescriptor, GroupResult, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DetailTemplateDirective } from './rendering/details/detail-template.directive';
import { ScrollMode } from './scrolling/scrollmode';
import { SortSettings } from './columns/sort-settings';
import { PagerSettings } from './pager/pager-settings';
import { BrowserSupportService } from './layout/browser-support.service';
import { GridDataResult, DataCollection } from './data/data.collection';
import { SelectionService, SelectionEvent } from './selection/selection.service';
import { EditService } from './editing/edit.service';
import { PageChangeEvent, DataStateChangeEvent } from './data/change-event-args.interface';
import { DetailsService } from './rendering/details/details.service';
import { GroupsService } from './grouping/groups.service';
import { ColumnsContainer } from './columns/columns-container';
import { GroupInfoService } from './grouping/group-info.service';
import { GroupableSettings } from './grouping/group-settings';
import { SelectableSettings } from "./selection/selectable-settings";
import { ChangeNotificationService } from './data/change-notification.service';
import { NoRecordsTemplateDirective } from './rendering/no-records-template.directive';
import { ColumnBase } from './columns/column-base';
import { FilterService } from './filtering/filter.service';
import { PagerTemplateDirective } from './pager/pager-template.directive';
import { PDFService } from './pdf/pdf.service';
import { PDFExportEvent } from './pdf/pdf-export-event';
import { ResponsiveService } from "./layout/responsive.service";
import { ExcelService } from './excel/excel.service';
import { ExcelExportEvent } from './excel/excel-export-event';
import { ColumnList } from './columns/column-list';
import { RowClassFn, RowSelectedFn } from './rendering/common/row-class';
import { ToolbarTemplateDirective } from "./rendering/toolbar/toolbar-template.directive";
import { EditEvent } from "./editing/edit-event-args.interface";
import { RemoveEvent } from "./editing/remove-event-args.interface";
import { SaveEvent } from "./editing/save-event-args.interface";
import { CancelEvent } from "./editing/cancel-event-args.interface";
import { AddEvent } from "./editing/add-event-args.interface";
import { CellCloseEvent } from './editing/cell-close-event';
import { CellClickEvent } from './common/cell-click-event-args.interface';
import { ScrollSyncService } from "./scrolling/scroll-sync.service";
import { DomEventsService } from './common/dom-events.service';
import { ColumnResizingService } from "./column-resizing/column-resizing.service";
import { ColumnResizeArgs } from './column-resizing/column-resize.interface';
/**
 * Represents the Kendo UI Grid component for Angular.
 *
 * @example
 * ```ts-preview
 * _@Component({
 *    selector: 'my-app',
 *    template: `
 *        <kendo-grid [data]="gridData">
 *        </kendo-grid>
 *    `
 * })
 * class AppComponent {
 *    private gridData: any[] = products;
 * }
 *
 * const products = [{
 *    "ProductID": 1,
 *    "ProductName": "Chai",
 *    "UnitPrice": 18.0000,
 *    "Discontinued": true
 *  }, {
 *    "ProductID": 2,
 *    "ProductName": "Chang",
 *    "UnitPrice": 19.0000,
 *    "Discontinued": false
 *  }
 * ];
 * ```
 */
export declare class GridComponent implements AfterContentInit, AfterViewInit, OnDestroy, OnChanges {
    private selectionService;
    wrapper: ElementRef;
    private groupInfoService;
    private groupsService;
    private changeNotification;
    private detailsService;
    private editService;
    private filterService;
    private pdfService;
    private responsiveService;
    private renderer;
    private excelService;
    private ngZone;
    private scrollSyncService;
    private domEvents;
    private rtl;
    private columnResizingService;
    /**
     * Sets the data of the Grid. If an array is provided, the Grid automatically gets the total count.
     */
    data: Array<any> | GridDataResult;
    /**
     * Defines the page size used by the Grid pager.
     * Required by the [paging]({% slug paging_grid_kendouiforangular %}) functionality.
     */
    pageSize: number;
    /**
     * Defines the height (in pixels) that is used when the `scrollable` option of the Grid is set.
     * To set the height of the Grid, you can also use `style.height`. The `style.height`
     * option supports units such as `px`, `%`, `em`, `rem`, and others.
     */
    height: number;
    /**
     * Defines the row height that is used when the `scrollable` option of the Grid is set to `virtual`.
     * Required by the [virtual scrolling functionality]({% slug scrollmmodes_grid_kendouiforangular %}).
     */
    rowHeight: number;
    /**
     * Defines the detail row height that is used when the `scrollable` option of the Grid is set to `virtual`.
     * Required by the [virtual scrolling functionality]({% slug scrollmmodes_grid_kendouiforangular %}).
     */
    detailRowHeight: number;
    /**
     * Defines the number of records to be skipped by the pager.
     * Required by the [paging]({% slug paging_grid_kendouiforangular %}) functionality.
     */
    skip: number;
    /**
     * Defines the scroll mode used by the Grid.
     *
     * The available options are:
     *  - `none`&mdash;Renders no scrollbar.
     *  - `scrollable`&mdash;This is the default scroll mode. It requires the setting of the `height` option.
     *  - `virtual`&mdash;Displays no pager and renders a portion of the data (optimized rendering) while the user is scrolling the content.
     */
    scrollable: ScrollMode;
    /**
     * Enables the single-row [selection]({% slug selection_grid_kendouiforangular %}) of the Grid.
     */
    selectable: SelectableSettings | boolean;
    /**
     */
    /**
     * The descriptors by which the data will be sorted.
     */
    sort: Array<SortDescriptor>;
    /**
     * The descriptor by which the data will to be filtered.
     */
    filter: CompositeFilterDescriptor;
    /**
     */
    /**
     * The descriptors by which the data will to be grouped.
     */
    group: Array<GroupDescriptor>;
    /**
     * @hidden
     */
    readonly showTopToolbar: boolean;
    /**
     * @hidden
     */
    readonly showBottomToolbar: boolean;
    /**
     * @hidden
     */
    readonly isLocked: boolean;
    /**
     * @hidden
     */
    readonly showPager: boolean;
    /**
     * @hidden
     */
    readonly showGroupPanel: boolean;
    /**
     * Enables the [filtering]({% slug filtering_grid_kendouiforangular %}) of the Grid columns that have their `field` option set.
     */
    filterable: boolean;
    /**
     * Enables the [sorting]({% slug sorting_grid_kendouiforangular %}) of the Grid columns that have their `field` option set.
     */
    sortable: SortSettings;
    /**
     * Configures the pager of the Grid.
     *
     * The available options are:
     *
     * - `buttonCount: Number`&mdash;Sets the maximum numeric buttons count before the buttons are collapsed.
     * - `info: Boolean`&mdash;Toggles the information about the current page and the total number of records.
     * - `type: PagerType`&mdash;Accepts the `numeric` (buttons with numbers) and `input` (input for typing the page number) values.
     * - `pageSizes: Boolean` or `Array<number>`&mdash;Shows a menu for selecting the page size.
     * - `previousNext: Boolean`&mdash;Toggles the **Previous** and **Next** buttons.
     */
    pageable: PagerSettings | boolean;
    /**
     * If set to `true`, the user can group the Grid by dragging the column header cells.
     * By default, grouping is disabled.
     */
    groupable: GroupableSettings | boolean;
    /**
     * Defines a function that is executed for every data row in the component.
     *
     * @example
     * ```ts-preview
     * import { Component, ViewEncapsulation } from '@angular/core';
     * import { RowClassArgs } from '@progress/kendo-angular-grid';
     *
     * _@Component({
     *    selector: 'my-app',
     *    encapsulation: ViewEncapsulation.None,
     *    styles: [`
     *        .k-grid tr.even { background-color: #f45c42; }
     *        .k-grid tr.odd { background-color: #41f4df; }
     *    `],
     *    template: `
     *        <kendo-grid [data]="gridData" [rowClass]="rowCallback">
     *        </kendo-grid>
     *    `
     * })
     * class AppComponent {
     *    private gridData: any[] = products;
     *
     *    rowCallback(context: RowClassArgs) {
     *        const isEven = context.index % 2 == 0;
     *        return {
     *            even: isEven,
     *            odd: !isEven
     *        };
     *    }
     * }
     *
     * const products = [{
     *    "ProductID": 1,
     *    "ProductName": "Chai",
     *    "UnitPrice": 18.0000,
     *    "Discontinued": true
     *  }, {
     *    "ProductID": 2,
     *    "ProductName": "Chang",
     *    "UnitPrice": 19.0000,
     *    "Discontinued": false
     *  }
     * ];
     * ```
     */
    rowClass: RowClassFn;
    /**
     * Defines a Boolean function that is executed for each data row in the component.
     * It determines whether the row will be selected.
     */
    rowSelected: RowSelectedFn;
    /**
     * If set to `true`, the user can resize columns by dragging the edges (resize handles) of their header cells.
     * @default false
     */
    resizable: boolean;
    /**
     * Fires when the Grid filter is modified through the UI.
     * You have to handle the event yourself and filter the data.
     */
    filterChange: EventEmitter<CompositeFilterDescriptor>;
    /**
     * Fires when the page of the Grid is changed.
     * You have to handle the event yourself and page the data.
     */
    pageChange: EventEmitter<PageChangeEvent>;
    /**
     * Fires when the grouping of the Grid is changed.
     * You have to handle the event yourself and group the data.
     */
    groupChange: EventEmitter<Array<GroupDescriptor>>;
    /**
     * Fires when the sorting of the Grid is changed.
     * You have to handle the event yourself and sort the data.
     */
    sortChange: EventEmitter<Array<SortDescriptor>>;
    /**
     * Fires when the user selects a Grid row.
     * Emits the [`SelectionEvent`]({% slug api_grid_selectionevent_kendouiforangular %}#toc-selectionchange).
     */
    selectionChange: EventEmitter<SelectionEvent>;
    /**
     * Fires when the data state of the Grid is changed.
     */
    dataStateChange: EventEmitter<DataStateChangeEvent>;
    /**
     * Fires when the user expands a group header.
     */
    groupExpand: EventEmitter<{
        group: GroupResult;
        groupIndex: string;
    }>;
    /**
     * Fires when the user collapses a group header.
     */
    groupCollapse: EventEmitter<{
        group: GroupResult;
        groupIndex: string;
    }>;
    /**
     * Fires when the user expands a master row.
     */
    detailExpand: EventEmitter<{
        index: number;
        dataItem: any;
    }>;
    /**
     * Fires when the user collapses a master row.
     */
    detailCollapse: EventEmitter<{
        index: number;
        dataItem: any;
    }>;
    /**
     * Fires when the user clicks the **Edit** command button to edit a row.
     */
    edit: EventEmitter<EditEvent>;
    /**
     * Fires when the user clicks the **Cancel** command button to close a row.
     */
    cancel: EventEmitter<CancelEvent>;
    /**
     * Fires when the user clicks the **Save** command button to save changes in a row.
     */
    save: EventEmitter<SaveEvent>;
    /**
     * Fires when the user clicks the **Remove** command button to remove a row.
     */
    remove: EventEmitter<RemoveEvent>;
    /**
     * Fires when the user clicks the **Add** command button to add a new row.
     */
    add: EventEmitter<AddEvent>;
    /**
     * Fires when the user leaves an edited cell.
     */
    cellClose: EventEmitter<CellCloseEvent>;
    /**
     * Fires when the user clicks a cell.
     */
    cellClick: EventEmitter<CellClickEvent>;
    /**
     * Fires when the user clicks the **Export to PDF** command button.
     */
    pdfExport: EventEmitter<PDFExportEvent>;
    /**
     * Fires when the user clicks the **Export to Excel** command button.
     */
    excelExport: EventEmitter<ExcelExportEvent>;
    /**
     * Fires when the user completes the resizing of the column.
     */
    columnResize: EventEmitter<Array<ColumnResizeArgs>>;
    columns: QueryList<ColumnBase>;
    readonly dir: string;
    readonly hostClasses: boolean;
    readonly lockedClasses: boolean;
    readonly virtualClasses: boolean;
    readonly columnResizing: boolean;
    detailTemplate: DetailTemplateDirective;
    noRecordsTemplate: NoRecordsTemplateDirective;
    pagerTemplate: PagerTemplateDirective;
    toolbarTemplate: ToolbarTemplateDirective;
    lockedHeader: any;
    header: any;
    footer: QueryList<any>;
    scrollbarWidth: number;
    readonly headerPadding: any;
    columnList: ColumnList;
    selectionDirective: boolean;
    columnsContainer: ColumnsContainer;
    view: DataCollection;
    readonly showGroupFooters: boolean;
    readonly showFooter: boolean;
    private shouldGenerateColumns;
    private direction;
    private _sort;
    private _group;
    private cachedWindowWidth;
    private defaultSelection;
    private _rowSelected;
    private columnResizingInProgress;
    readonly isVirtual: boolean;
    readonly isScrollable: boolean;
    readonly visibleColumns: QueryList<ColumnBase>;
    readonly lockedColumns: QueryList<ColumnBase>;
    readonly nonLockedColumns: QueryList<ColumnBase>;
    readonly lockedLeafColumns: QueryList<ColumnBase>;
    readonly nonLockedLeafColumns: QueryList<ColumnBase>;
    readonly leafColumns: QueryList<ColumnBase>;
    readonly totalColumnLevels: number;
    readonly lockedWidth: number;
    readonly nonLockedWidth: number;
    readonly selectableSettings: SelectableSettings;
    private selectionSubscription;
    private stateChangeSubscription;
    private groupExpandCollapseSubscription;
    private detailsServiceSubscription;
    private editServiceSubscription;
    private filterSubscription;
    private columnsChangeSubscription;
    private pdfSubscription;
    private resizeSubscription;
    private orientationSubscription;
    private excelSubscription;
    private columnsContainerChangeSubscription;
    private documentClickSubscription;
    private windowBlurSubscription;
    private cellClickSubscription;
    private footerChangeSubscription;
    private columnResizingSubscription;
    constructor(supportService: BrowserSupportService, selectionService: SelectionService, wrapper: ElementRef, groupInfoService: GroupInfoService, groupsService: GroupsService, changeNotification: ChangeNotificationService, detailsService: DetailsService, editService: EditService, filterService: FilterService, pdfService: PDFService, responsiveService: ResponsiveService, renderer: Renderer2, excelService: ExcelService, ngZone: NgZone, scrollSyncService: ScrollSyncService, domEvents: DomEventsService, rtl: boolean, columnResizingService: ColumnResizingService);
    /**
     * Expands the specified master row.
     *
     * @param {number} index - The absolute index of the master row.
     */
    expandRow(index: number): void;
    /**
     * Collapses the specified master row.
     *
     * @param {number} index - The absolute index of the master row.
     */
    collapseRow(index: number): void;
    /**
     * Expands a group header item for the given index.
     * For example, `0_1` expands the second inner group of the first master group.
     *
     * @param {string} index - The underscore separated hierarchical index of the group.
     */
    expandGroup(index: string): void;
    /**
     * Collapses a group header item for the given index.
     * For example, `0_1` collapses the second inner group of the first master group.
     *
     * @param {string} index - The underscore separated hierarchical index of the group.
     */
    collapseGroup(index: string): void;
    /**
     * @hidden
     */
    resetGroupsState(): void;
    /**
     * @hidden
     */
    expandGroupChildren(groupIndex: string): void;
    /**
     * @hidden
     */
    onDataChange(): void;
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): void;
    ngAfterViewInit(): void;
    ngAfterContentChecked(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    attachScrollSync(): void;
    /**
     * Switches the specified table row in the edit mode.
     *
     * @param {number} index - The row index that will be switched in the edit mode.
     * @param {FormGroup} group - The [`FormGroup`](https://angular.io/docs/ts/latest/api/forms/index/FormGroup-class.html)
     * that describes the edit form.
     */
    editRow(index: number, group?: any): void;
    /**
     * Closes the editor for a given row.
     *
     * @param {number} index - The row index that will be switched out of the edit mode. If no index is provided, it is assumed
     * that the new item editor will be closed.
     */
    closeRow(index?: number): void;
    /**
     * Creates a new row editor.
     *
     * @param {FormGroup} group - The [`FormGroup`](https://angular.io/docs/ts/latest/api/forms/index/FormGroup-class.html) that describes
     * the edit form. If called with a data item, it will build the `FormGroup` from the data item fields.
     */
    addRow(group: any): void;
    /**
     * Puts the cell that is specified by the table row and column in edit mode.
     *
     * @param {number} rowIndex - The row index that will be switched in the edit mode.
     * @param {number|string|any} column - The leaf column index, or the field name or the column instance that should be edited.
     * @param {FormGroup} group - The [`FormGroup`](https://angular.io/docs/ts/latest/api/forms/index/FormGroup-class.html)
     * that describes the edit form.
     */
    editCell(rowIndex: number, column: number | string | any, group?: any): void;
    /**
     * Closes the current cell in edit mode and fires the `cellClose` event.
     */
    closeCell(): void;
    /**
     * Closes the current cell in edit mode.
     */
    cancelCell(): void;
    /**
     * Initiates the PDF export.
     */
    saveAsPDF(): void;
    /**
     * Initiates the Excel export.
     */
    saveAsExcel(): void;
    /**
     * @hidden
     */
    notifyPageChange(source: string, event: any): void;
    /**
     * @hidden
     */
    focusEditElement(containerSelector: string): void;
    private initSelectionService();
    private setEditFocus(element);
    private columnInstance(column);
    private verifySettings();
    private autoGenerateColumns();
    private attachStateChangesEmitter();
    private attachEditHandlers();
    private emitCRUDEvent(args);
    private attachDomEventHandlers();
    private isHidden(c);
    private matchesMedia(c);
    private resizeCheck();
    private emitPDFExportEvent();
    private columnsContainerChange();
    private notifyResize(e);
    private _rowClass;
}

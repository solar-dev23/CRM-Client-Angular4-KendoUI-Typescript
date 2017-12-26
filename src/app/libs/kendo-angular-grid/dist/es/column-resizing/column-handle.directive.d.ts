import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import { ColumnBase } from '../columns/column-base';
import { DraggableDirective } from '../common/draggable.directive';
import { ColumnResizingService } from './column-resizing.service';
/**
 * @hidden
 */
export declare class ColumnHandleDirective implements OnInit, OnDestroy {
    draggable: DraggableDirective;
    private element;
    private service;
    columns: Array<ColumnBase>;
    column: ColumnBase;
    readonly visible: string;
    private originalWidth;
    private subscriptions;
    constructor(draggable: DraggableDirective, element: ElementRef, service: ColumnResizingService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private shouldUpdate();
    private initColumnWidth();
    private initState();
    private resize({deltaPercent});
}

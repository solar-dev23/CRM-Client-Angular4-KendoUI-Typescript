import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { ColumnResizingService } from './column-resizing.service';
/**
 * @hidden
 */
export declare class TableDirective implements OnInit, OnDestroy {
    private element;
    private renderer;
    private service;
    locked: boolean;
    readonly minWidth: number | null;
    private originalWidth;
    private firstResize;
    private subscription;
    constructor(element: ElementRef, renderer: Renderer2, service: ColumnResizingService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private initState();
    private resize(deltas);
    private updateWidth(width);
}

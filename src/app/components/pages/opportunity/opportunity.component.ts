import { Component, OnInit, HostListener, ViewEncapsulation, ElementRef, Renderer2, NgZone, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from "lodash";
import { OpportunityService, StatusService, ReminderService, EventEmitterService } from "../../../core";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
// import { CONFIG } from '../../config';

var gridSize: number = 0;

@Component({
  selector: 'opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss', './pdf-styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpportunityComponent implements OnInit {
  @ViewChild('opportunityGrid') opportunityGridComponent: any;
  @ViewChild('criteria') criteriaView: ElementRef;

  public dragColumn: boolean = true;
  public dragWidget: boolean = true;
  public containers: any = [];
  public activeColumnId: number = -1;
  public widgetId: string = '';
  public newColumn: string = '';
  public addColumn: boolean = false;
  public newColumnName: string = '';
  public opportunities: any = [];
  public temp_opportunities: any = [];
  public currencies: any = ['USD', 'EUR'];
  public isOpened: boolean = false;
  public newOpportunityName: string = '';
  public qColumnId: number = -1;
  public isNewOpportunity: boolean = false;
  public isRemoved: boolean = false;
  public isArchived: boolean = false;
  public isArchivedAll: boolean = false;
  public isRemoveAll: boolean = false;
  public isShowAlert: boolean = false;
  public isArchivedAll2: boolean = false;

  public o_name: string = '';
  public o_company: string = '';
  public o_contact: string = '';
  public o_value: number = 0;
  public o_currency: string = 'USD';
  public o_description: string = '';
  public o_status: number = 0;
  public o_old_status: number = 0;
  public o_rating: number = 3;
  public o_id: string = '';
  public o_order: number = 0;
  public o_isActive: boolean = true;
  public o_notify: boolean = false;
  public o_reminder: Object = {id: '', name: ''};
  public removeObj: Object = {id:'', status_id:''};
  public archiveObj: Object;

  public viewOpt: string = 'card';
  public gridView: GridDataResult;
  public state: State = {
    skip: 0,
    take: 10
  };
  public searchStr: string = '';
  public filter: string = '';
  public filter_default: Object={id: 0, name:"All"};
  public criterias: any = [];
  public grid_criterias: any = [];
  public card_criterias: any = [];
  public sort: SortDescriptor[] = [];
  public enablePop: boolean = false;
  // public userId: string = CONFIG.CURRENT_USER_ID;
  public userId: string = '1';

  public grid_quick_filter_options: any = [];
  // public card_quick_filter_options: any = ['My Opportunities', 'More than 30 days old'];
  public sColumnId: number = -1;
  public archiveColumnId: number = 0;
  public alert_message: string = '';
  public removeColumnName: string = '';

  // Multi-check list in card view.
  public cardQuickFilterModel: any = [];
  public card_quick_filter_options: IMultiSelectOption[];
  public card_quick_filter_settings: IMultiSelectSettings = {
      enableSearch: false,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  public card_quick_filter_texts: IMultiSelectTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Unselect all',
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select',
      allSelected: 'All selected',
  };
  public isShowFilterSearch = false;

  // Notify and Reminder variables
  public reminder_list: any = [];
  public reminder: string = '';
  public specific_date: Date = new Date();

  public navIsFixed: boolean = false;
  public navFixed: any = [];
  public scrollTop: number = 0;
  public scrollLeft: number = 0;
  public menuWidth: number = 0;

  public headerHeight: number = 100;
  public columnPadding: number = 15;
  public defaultCriteriaHeight: number = 30;
  public cardViewStyle: any;

  constructor(
    private opportunityService: OpportunityService, 
    private statusService: StatusService,
    private reminderService: ReminderService,
    private _eventEmitter: EventEmitterService,
    private renderer: Renderer2, 
    private el: ElementRef, 
    private _ngZone: NgZone) 
  {
      this.allData = this.allData.bind(this);

      this._eventEmitter.changeEmitted$.subscribe(
        data => {
            if(data == 'expanded')
              this.menuWidth = 250;
            else
              this.menuWidth = 58;

            this._fixColumnHeader();
        });
  }

  ngOnInit() {
    this._getContainer();

    this.card_quick_filter_options = [
        { id: 1, name: 'My Opportunities' },
        { id: 2, name: 'More than 30 days old' },
    ];

    this.reminder_list = [
      { id: 'no',   name: 'Don\'t remind me' },
      { id: '1h',   name: '1 hour' },
      { id: '12h',  name: '12 hours' },
      { id: '1d',   name: '1 day' },
      { id: '1w',   name: '1 week' },
      { id: '2w',   name: '2 weeks' },
      { id: '3w',   name: '3 weeks' },
      { id: '1m',   name: '1 month' },
      { id: 'sd',   name: 'Specific Date' }
    ];

    this.o_reminder = this.reminder_list[0];
  }

  _getContainer() {
    let that = this;
    this.statusService.getStatuses().subscribe (
          res => {
              that.containers = that.grid_quick_filter_options = _.toArray(res);

              that.containers = that.containers.filter(function(container){
                if(container.is_active)
                  return container;
              })

              that.opportunityService.read().subscribe(
                    res => {
                        that.opportunities = _.toArray(res);

                        // Set notify value to opportunities for current user.
                        _.forEach(that.opportunities, function(oppo){
                          oppo.notify = false;

                          if(oppo.notify_users && oppo.notify_users.length > 0){
                            let notify_list = oppo.notify_users.split(',');
                            if(notify_list.indexOf(that.userId) !== -1){
                              oppo.notify = true;
                            }
                          }
                        });

                        _.forEach(that.containers, function(val) {
                            val.widgets = that.opportunities.filter(function(opp){
                              if(val.id == opp.status_id)
                                return opp;
                            });

                            val.widgets = _.orderBy(val.widgets, 'order');
                        })

                        // Filter container with active opportunities
                        that.temp_opportunities = that.opportunities.filter(function(oppo){
                          if(oppo.is_active)
                            return oppo;
                        })
                        that._getContainerByOppo(that.temp_opportunities);

                        _.forEach(that.temp_opportunities, function(opportunity) {
                          _.forEach(that.containers, function(container) {
                            if(opportunity.status_id == container.id){
                              opportunity.status_name = container.name;
                            }
                          })
                        });

                        that._getGridOpportunities();
                    },
                    err => console.log(err, 'getting opportunities error')
                )
          },
          err => console.log(err, 'getting statuses error')
      )
  }

  _getGridOpportunities() {
      let that = this;
      gridSize = this.temp_opportunities.length;
      this.gridView = {
          data: this.temp_opportunities.slice(this.state.skip, this.state.skip + this.state.take),
          total: this.temp_opportunities.length
      };
  }

  _getContainerByOppo(opportunities) {
    _.forEach(this.containers, function(val) {
        val.widgets = opportunities.filter(function(opp){
          if(val.id == opp.status_id)
            return opp;
        });

        val.widgets = _.orderBy(val.widgets, 'order');
    })
  }

  pageChange(event: PageChangeEvent) {
      this.state = event;
      this._getGridOpportunities();
  }

  sortChange(sort: SortDescriptor[]): void {
      this.sort = sort;
      this.temp_opportunities = orderBy(this.temp_opportunities, this.sort);
      this._getGridOpportunities();
  }

  allData(): ExcelExportData {
    const result: ExcelExportData =  {
        data: this.temp_opportunities
    };

    return result;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    // if(!_.includes(event.target.classList, 'add-column-text')){
    //   this.onAddNewColumn();
    // }

    // if(!_.includes(event.target.classList, 'add-column-text') && !_.includes(event.target.classList, 'add-column-button-icon')){
    //   this.addColumn = false;
    // }

    // if(!_.includes(event.target.classList, 'column-name')){
    //   this.onUpdateColumn();
    // }

    // if(!_.includes(event.target.classList, 'column-popup')){
    //   this.sColumnId = -1;
    // }

    // if(!_.includes(event.target.classList, 'card-popup')){
    //   this.widgetId = '';
    // }

    // if(_.includes(event.target.classList, 'dropdown-toggle')){
    //   this.isShowFilterSearch = !this.isShowFilterSearch;
    // }
  }

  onScroll(event) {
    if(!_.includes(event.target.classList, 'column-grid'))
      return;

    this.scrollTop = event.target.scrollTop;
    this.scrollLeft = event.target.scrollLeft;

    this._fixColumnHeader();
  }

  _fixColumnHeader() {
    let that = this;

    if(this.scrollTop > 60){
      this.navIsFixed = true;

      _.forEach(this.containers, function(container, index) {
        that.navFixed[index] = {
          left: (that.menuWidth + that.columnPadding + 300 * parseInt(index) - that.scrollLeft) + 'px'
        }
      })
    }
    else
      this.navIsFixed = false;
  }

  onDragStart(event) {
    if(_.includes(event.target.classList, 'column')){
      this.dragColumn = true;
      this.dragWidget = false;
    }
    else{
      this.dragColumn = false;
      this.dragWidget = true;
    }
  }

  onDragEnd(val, event) {
    let that = this;
    this.dragColumn = true;
    this.dragWidget = true;

    if(val == 'opportunity'){
      // Because of checking notify
      this.opportunityService.save(event).subscribe(
          res => {
            this._reorder(val);
          }
        )
    }else{
      this._reorder(val);
    }

    _.forEach(this.containers, function(container) {
      _.forEach(container.widgets, function(widget) {
        widget.status_id = container.id;

        // Update temp_opportunities and opportunities
        var i = that.temp_opportunities.findIndex(opportunity => opportunity.id === widget.id);
        if (that.temp_opportunities[i]) {
          that.temp_opportunities[i].status_id = container.id;
          that.temp_opportunities[i].status_name = container.name;

          if(that.o_isActive){
            that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
                return obj.is_active;
            });
          }else {
            that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
                return !obj.is_active;
            });
          }
        }

        var j = that.opportunities.findIndex(opportunity => opportunity.id === widget.id);
        if (that.opportunities[j]) {
          that.opportunities[j].status_id = container.id;
          that.opportunities[j].status_name = container.name;
        }
      })
    })
  }

  onPopup(columnIndex, widgetIndex) {
    if(this.widgetId == 'widget_'+columnIndex+'_'+widgetIndex)
      this.widgetId = '';
    else
      this.widgetId = 'widget_'+columnIndex+'_'+widgetIndex;
  }

  onChangeBg(opportunity, bgColor) {
    let params={
      id: opportunity.id,
      status_id: opportunity.status_id,
      name: opportunity.name,
      order: opportunity.order,
      bgColor: bgColor
    }
    this.opportunityService.save(params).subscribe(
        res => {
            opportunity.bgColor = bgColor;
            this.widgetId = '';
        },
        err => console.log(err, 'opportunity update error')
      )
  }

  onCollapse(columnIndex, event) {
    if(event.target == event.currentTarget) {
      this.containers[columnIndex].isCollapse = true;
    }
  }

  onExpand(columnIndex, event) {
    // if(event.target == event.currentTarget) {
      this.containers[columnIndex].isCollapse = false;
    // }
  }

  onClear() {
    // this.containers = containers;
    // this.addColumn = false;
  }

  onAddNewColumn() {
    if(!this.newColumn.length){
      return;
    }

    let params = {
      name: this.newColumn,
      order: this.containers.length+1
    }
    this.statusService.createStatus(params).subscribe(
        res => {
          let tmp_containers = this.containers.filter(function(container) {
            if(container.name.toLowerCase() === res.name.toLowerCase())
              return container;
          })

          this.containers.push({
            id: res.id,
            name: res.name,
            order: res.order,
            widgets: []
          });

          // For quick filter in grid view.
          let index = this.grid_quick_filter_options.length - 1;
          this.grid_quick_filter_options.splice(index, 0, {
            id: res.id,
            name: res.name,
            order: res.order,
            widgets: []
          });

          this.newColumn = '';
        },
        err => {
          if(JSON.parse(err._body).errors[0].message){
            this.alert_message = "Column name already exists.";
            this.isShowAlert = true;
            this.newColumn = '';
          }
        }
      )
  }

  onUpdateColumn() {
    if(this.activeColumnId == -1 || !this.newColumnName.length)
      return;

    let params = {
      id: this.activeColumnId,
      name: this.newColumnName
    }
    this.statusService.updateStatus(params).subscribe(
        res => {
          _.forEach(this.containers, function(val) {
            if(val.id == res.id)
              val.name = res.name;
          })
          this.activeColumnId = -1;
        },
        err => console.log(err, 'status update error')
      )
  }

  _reorder(type) {
      if(type == 'status'){
          this.statusService.reorderStatus(this.containers).subscribe(
              res => {
                console.log(res);
              },
              err => console.log(err, 'status reorder error')
            )
      }else if (type == 'opportunity') {
          this.opportunityService.reorderOpportunity(this.containers).subscribe(
              res => {
                console.log(res);
              },
              err => console.log(err, 'opportunity reorder error')
            )
      }
  }

  onFormSubmit(opportunityForm: NgForm) {
    let that = this;
    if(!opportunityForm.valid)
       return;

    let status;
    _.forEach(this.containers, function(container){
        if(container.id == opportunityForm.controls['status'].value){
          status = container;
        }
    })

    if(this.isNewOpportunity){
        let params = {
          name: opportunityForm.controls['name'].value,
          company: opportunityForm.controls['company'].value,
          contact: opportunityForm.controls['contact'] .value,
          value: opportunityForm.controls['value'].value,
          currency: opportunityForm.controls['currency'].value,
          description: opportunityForm.controls['description'].value,
          status_id: opportunityForm.controls['status'].value,
          order: 1,
          rating: this.o_rating,
          user_id: this.userId
        }

        this.opportunityService.save(params).subscribe(
            res => {
              that.isOpened = false;
              _.forEach(that.containers, function(container){
                  if(container.id == res.status_id){
                    container.widgets.unshift(res);
                  }
              })
              that._reorder('opportunity');
            },
            err => {
              if(JSON.parse(err._body).errors[0].message){
                this.alert_message = "Card name already exists.";
                this.isShowAlert = true;
              }
            }
          )
    }else {
        let params = {};
        if(opportunityForm.controls['status'].value == 100) {
          this.alert_message = "Please choose the opportunity status.";
          this.isShowAlert = true;
        }else {
          params = {
            id: this.o_id,
            name: opportunityForm.controls['name'].value,
            company: opportunityForm.controls['company'].value,
            contact: opportunityForm.controls['contact'] .value,
            value: opportunityForm.controls['value'].value,
            currency: opportunityForm.controls['currency'].value,
            description: opportunityForm.controls['description'].value,
            status_id: opportunityForm.controls['status'].value,
            rating: this.o_rating,
            is_active: true
          }

          if(this.o_old_status == opportunityForm.controls['status'].value){
            params['order'] = this.o_order;
          }else {
            params['order'] = 1;
          }

          if(opportunityForm.controls['notify'].value != undefined){
            params['notify'] = {
              id: this.userId,
              value: opportunityForm.controls['notify'].value
            }
          }

          this.opportunityService.save(params).subscribe(
              res => {
                that.isOpened = false;

                // Update reminder if exist.
                if(that.o_reminder['id']){
                  let reminder_date = that._getReminderDate(that.o_reminder['id']);
                  let params = {
                    user_id: that.userId,
                    opportunity_id: res.id,
                    reminder_id: that.o_reminder['id'],
                    reminder_date: reminder_date
                  }

                  that.reminderService.updateReminder(params).subscribe(
                      res => {
                        console.log(res);
                      }, err => console.log(err, 'reminder update error')
                    )
                }

                // Update notify value for container and opportunities
                res.notify = false;
                if(res.notify_users && res.notify_users.length > 0){
                  let notify_list = res.notify_users.split(',');
                  if(notify_list.indexOf(that.userId) !== -1){
                    res.notify = true;
                  }
                }

                // Update containers for card view.
                _.forEach(that.containers, function(container){
                    if(container.id == res.status_id){
                      var i = container.widgets.findIndex(widget => widget.id === res.id);
                      if (container.widgets[i]) {
                        container.widgets[i] = res;
                      }else {
                        container.widgets.unshift(res);
                      }
                    }else {
                      var j = container.widgets.findIndex(widget => widget.id === res.id);
                      if (container.widgets[j]) {
                        container.widgets.splice(j, 1);
                      }
                    }
                });

                that._reorder('opportunity');

                // Update temp opportunites for grid view.
                var k = that.temp_opportunities.findIndex(opportunity => opportunity.id === res.id);

                if (that.temp_opportunities[k] && that.o_isActive) {
                  that.temp_opportunities[k] = res;
                  _.forEach(that.containers, function(container) {
                    if(that.temp_opportunities[k].status_id == container.id){
                      that.temp_opportunities[k].status_name = container.name;
                    }
                  })

                  that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
                      return obj.is_active;
                  });
                }else if (that.temp_opportunities[k] && !that.o_isActive) {
                  that.temp_opportunities[k].is_active = true;
                  that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
                      return !obj.is_active;
                  });
                }

                // Update opportunites for grid view.
                var o_index = that.opportunities.findIndex(opportunity => opportunity.id === res.id);

                if (that.opportunities[o_index] && that.o_isActive) {
                  that.opportunities[o_index] = res;
                }else if (that.opportunities[o_index] && !that.o_isActive) {
                  that.opportunities[o_index] = res;
                  that.opportunities[o_index].is_active = true;
                }

                that._getGridOpportunities();
              },
              err => console.log(err, 'opportunity update error')
            )
        }
    }
  }

  _getReminderDate(id){
      let reminder_date = new Date();
      switch (id) {
        case "no":
          reminder_date = new Date(reminder_date.getTime() - 10 * 60 * 1000);
          break;
        case "1h":
          reminder_date.setHours(reminder_date.getHours() + 1);
          break;
        case "12h":
          reminder_date.setHours(reminder_date.getHours() + 12);
          break;
        case "1d":
          reminder_date.setDate(reminder_date.getDate() + 1);
          break;
        case "1w":
          reminder_date = new Date(reminder_date.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case "2w":
          reminder_date = new Date(reminder_date.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
          break;
        case "3w":
          reminder_date = new Date(reminder_date.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
          break;
        case "1m":
          reminder_date = new Date(reminder_date.getFullYear(), reminder_date.getMonth()+1, reminder_date.getDate());
          break;
        default:
          reminder_date = this.specific_date;
          break;
      }

      return reminder_date;
  }

  onCreate() {
    this.isNewOpportunity = true;
    this.isOpened = true;
    this.o_name = '';
    this.o_company = '';
    this.o_contact = '';
    this.o_value = 0;
    this.o_currency = 'USD';
    this.o_status = 1;
    this.o_description = '';
    this.o_rating = 3;
    this.o_isActive = true;
  }

  onEdit(opportunity, event) {
    if(event.target != event.currentTarget)
      return;

    this.isNewOpportunity = false;
    this.isOpened = true;
    this.widgetId = '';
    this.o_id = opportunity.id;
    this.o_name = opportunity.name;
    this.o_company = opportunity.company;
    this.o_contact = opportunity.contact;
    this.o_value = opportunity.value;
    this.o_currency = opportunity.currency;
    this.o_status = this.o_old_status = opportunity.status_id;
    this.o_description = opportunity.description;
    this.o_rating = opportunity.rating;
    this.o_order = opportunity.order;
    this.o_isActive = opportunity.is_active;
    this.o_notify = opportunity.notify;
    this.o_reminder = {}

    this.reminderService.getReminder({user_id: this.userId, opportunity_id: opportunity.id}).subscribe(
        res => {
          this.o_reminder = _.find(this.reminder_list, {id: res.reminder_id});

          if(res.reminder_id == 'sd')
            this.specific_date = new Date(res.reminder_date);
        },
        err => {
          console.log(err._body);
          this.o_reminder = this.reminder_list[0];
        }
      )
  }

  onQuickAddOpportunity(status) {
    let that = this;

    if(!this.newOpportunityName.length)
      return;

    let statusId = status.id;
    let order = status.widgets.length + 1;

    let params = {
      name: this.newOpportunityName,
      status_id: statusId,
      order: order,
      user_id: this.userId
    }

    this.opportunityService.save(params).subscribe(
        res => {
          that.newOpportunityName = '';
          that.qColumnId = -1;

          _.forEach(that.containers, function(container){
              if(container.id == res.status_id){
                container.widgets.unshift(res);
              }
          })

          that._reorder('opportunity');
        },
        err => {
          if(JSON.parse(err._body).errors[0].message){
            this.alert_message = "Card name already exists.";
            this.isShowAlert = true;
          }
        }
      )
  }

  onOpenRemoveDlg(opportunity, event) {
    this.removeObj = {
      id: opportunity.id,
      status_id: opportunity.status_id
    }
    this.isRemoved = true;
    this.widgetId = '';
  }

  onRemove() {
    let that = this;
    let params = {
      id: this.removeObj['id']
    }

    this.opportunityService.remove(params).subscribe(
        res => {
            _.forEach(that.containers, function(container){
                if(container.id == that.removeObj['status_id']){
                  var i = container.widgets.findIndex(widget => widget.id === that.removeObj['id']);
                  container.widgets.splice(i, 1);
                }
            })

            var j = that.temp_opportunities.findIndex(opportunity => opportunity.id === that.removeObj['id']);
            that.temp_opportunities.splice(j, 1);
            that._getGridOpportunities();

            that.removeObj = {};
            that.isRemoved = false;
        },
        err => console.log(err, 'opportunity delete error')
      )
  }

  onSearch(event) {
    let that = this;
    that.searchStr = that.searchStr.toLowerCase();

    if(this.viewOpt == 'grid'){
        this.temp_opportunities = this.opportunities;
        this.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
            return (obj.is_active) && (
              (obj.name && obj.name.toLowerCase().indexOf(that.searchStr) > -1) ||
              (obj.company && obj.company.toLowerCase().indexOf(that.searchStr) > -1) ||
              (obj.contact && obj.contact.toLowerCase().indexOf(that.searchStr) > -1) ||
              (obj.status_name && obj.status_name.toLowerCase().indexOf(that.searchStr) > -1) ||
              (obj.description && obj.description.toLowerCase().indexOf(that.searchStr) > -1)
            );
        });

        this._getGridOpportunities();
    }else {
        _.forEach(that.containers, function(val) {
            val.widgets = that.opportunities.filter(function(opp){
              if(val.id == opp.status_id)
                return opp;
            });

            val.widgets = _.orderBy(val.widgets, 'order');
        })

        this.containers = _.filter(that.containers, function(container) {
            container.widgets = _.filter(container.widgets, function(obj) {
                return (obj.is_active) && (
                  (obj.name && obj.name.toLowerCase().indexOf(that.searchStr) > -1) ||
                  (obj.company && obj.company.toLowerCase().indexOf(that.searchStr) > -1) ||
                  (obj.contact && obj.contact.toLowerCase().indexOf(that.searchStr) > -1) ||
                  (obj.status_name && obj.status_name.toLowerCase().indexOf(that.searchStr) > -1) ||
                  (obj.description && obj.description.toLowerCase().indexOf(that.searchStr) > -1)
                );
            })

            return container;
        });
    }
  }

  onFilter(event) {
    let that = this;

    if(this.viewOpt == 'grid'){
      this.temp_opportunities = this.opportunities;

      if(this.filter != '0' && this.filter != '100'){
        this.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
            return (obj.status_id && obj.status_id == that.filter && obj.is_active);
        });
      }else if(this.filter != '0' && this.filter == '100'){
        this.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
            return !obj.is_active;
        });
      }else {
        this.temp_opportunities = _.filter(that.opportunities, function(obj) {
            return obj.is_active;
        });
      }

      _.forEach(this.temp_opportunities, function(opportunity) {
        _.forEach(that.containers, function(container) {
          if(opportunity.status_id == container.id){
            opportunity.status_name = container.name;
          }
        })
      });

      this.state.skip = 0;
      this._getGridOpportunities();
    }else {
      if(this.filter == 'Archive'){
        this.statusService.getStatuses().subscribe (
          res => {
              that.containers = _.toArray(res);

              let archive_opportunities = that.opportunities.filter(function(oppo){
                if(!oppo.is_active)
                  return oppo;
              })
              that._getContainerByOppo(archive_opportunities);
          }, err => console.log(err)
        )
      }else {
        this.statusService.getStatuses().subscribe (
          res => {
              that.containers = _.toArray(res);

              that.containers = that.containers.filter(function(container) {
                if(container.is_active)
                  return container;
              })

              let active_opportunities = that.opportunities.filter(function(oppo){
                if(oppo.is_active)
                  return oppo;
              })
              that._getContainerByOppo(active_opportunities);
          }, err => console.log(err)
        )

      }
    }
  }

  onAddCriteria() {
    if(this.searchStr.length > 0){
      this.criterias.push(this.searchStr);
      if(this.viewOpt == 'grid'){
        this.grid_criterias = this.criterias;
      }else{
        this.card_criterias = this.criterias;
        this._fixCardViewHeight();
      }

      this.searchStr = '';
      this._customFilter();
    }
  }

  onDeleteCriteria(i) {
    this.criterias.splice(i, 1);
    if(this.viewOpt == 'grid')
      this.grid_criterias = this.criterias;
    else{
      this.card_criterias = this.criterias;
      this._fixCardViewHeight();
    }
    this._customFilter();
  }

  onDeleteLastCriteria() {
    if(this.searchStr.length > 0)
      this.enablePop = false;

    if(this.criterias.length > 0 && this.enablePop){
      this.criterias.pop();
      if(this.viewOpt == 'grid')
        this.grid_criterias = this.criterias;
      else{
        this.card_criterias = this.criterias;
        this._fixCardViewHeight();
      }

      this._customFilter();
    }

    if(this.searchStr.length == 0)
      this.enablePop = true;
    else
      this.enablePop = false;
  }

  _fixCardViewHeight() {
    let that = this;
    setTimeout(function() {
      let height;
      let criteriaHeight = that.criteriaView.nativeElement.offsetHeight;

      if(criteriaHeight > that.defaultCriteriaHeight){
        height = that.headerHeight + criteriaHeight - that.defaultCriteriaHeight;
      } else{
        height = that.headerHeight;
      }
      
      that.cardViewStyle = {
        'height': 'calc(100vh - '+height+'px)'
      }
    }, 100);
  }

  _customFilter() {
    let that = this;

    if(this.viewOpt == 'grid'){
        this.temp_opportunities = [];
        let active_opportunities = this.opportunities.filter(function(oppo){
          if(oppo.is_active)
            return oppo;
        });

        if(this.criterias.length > 0){
          _.forEach(active_opportunities, function(obj) {
            _.forEach(that.criterias, function(criteria) {
                let criteria_ary = criteria.split(" ");
                let val;
                let combined_str = that._combineString(obj);

                if(criteria_ary.length > 1){
                  _.forEach(criteria_ary, function(substr) {
                    if(combined_str.indexOf(substr.toLowerCase()) <= -1){
                       val = -1;
                    }
                  })

                  if(val != -1){
                    val = 0;
                  }

                }else{
                  criteria = criteria.toLowerCase();
                  val = combined_str.indexOf(criteria);
                }

                if(val > -1){
                  if(!_.find(that.temp_opportunities, {id: obj.id})) {
                    that.temp_opportunities.push(obj);
                  }
                }
            });
          })
        }else {
          this.temp_opportunities = active_opportunities;
        }

        this.state.skip = 0;
        this._getGridOpportunities();
    }else {
      // Init container before filter
      _.forEach(that.containers, function(val) {
          val.widgets = that.opportunities.filter(function(opp){
            if(val.id == opp.status_id)
              return opp;
          });

          val.widgets = _.orderBy(val.widgets, 'order');
      })

      if(this.criterias.length > 0){
        // Filter container
        _.forEach(that.containers, function(container) {
          let temp_widgets = [];

          _.forEach(container.widgets, function(obj) {
              if(obj.is_active) {
                  _.forEach(that.criterias, function(criteria) {
                      let criteria_ary = criteria.split(" ");
                      let val;
                      let combined_str = that._combineString(obj);

                      if(criteria_ary.length > 1){
                        _.forEach(criteria_ary, function(substr) {
                          if(combined_str.indexOf(substr.toLowerCase()) <= -1){
                             val = -1;
                          }
                        })

                        if(val != -1){
                          val = 0;
                        }

                      }else{
                        criteria = criteria.toLowerCase();
                        val = combined_str.indexOf(criteria);
                      }

                      if(val > -1){
                        if(!_.find(temp_widgets, {id: obj.id})) {
                          temp_widgets.push(obj);
                        }
                      }
                  });
              }
          });

          container.widgets = temp_widgets;
        })
      }
    }
  }

  onChangeView(val) {
    this.viewOpt = val;
    if(this.viewOpt == 'grid')
      this.criterias = this.grid_criterias;
    else
      this.criterias = this.card_criterias;
  }

  _combineString(obj) {
    let combined_str = '';
    if(obj.name)
      combined_str += obj.name.toLowerCase() + '+';

    if(obj.company)
      combined_str += obj.company.toLowerCase() + '+';

    if(obj.contact)
      combined_str += obj.contact.toLowerCase() + '+';

    if(obj.status_name)
      combined_str += obj.status_name.toLowerCase() + '+';

    if(obj.description)
      combined_str += obj.description.toLowerCase();

    return combined_str;
  }

  onPopupColumnSetting(index, event) {
    if(this.sColumnId == index)
      this.sColumnId = -1;
    else
      this.sColumnId = index;
  }

  onOpenArchiveDlg(opportunity, event) {
    this.archiveObj = opportunity;
    this.isArchived = true;
    this.widgetId = '';
  }

  onArchive(event){
    let that = this;

    let params={
      id: this.archiveObj['id'],
      status_id: this.archiveObj['status_id'],
      name: this.archiveObj['name'],
      order: this.archiveObj['order'],
      is_active: false
    }
    this.opportunityService.save(params).subscribe(
        res => {
            _.forEach(that.opportunities, function(oppo) {
              if(oppo.id == that.archiveObj['id'])
                oppo.is_active = false;
            })

            let active_opportunities = that.opportunities.filter(function(oppo){
              if(oppo.is_active)
                return oppo;
            })
            that._getContainerByOppo(active_opportunities);

            that._reorder('opportunity');
            that.isArchived = false;
        },
        err => console.log(err, 'opportunity update error')
      )
  }

  onOpenArchiveAllDlg(columnId, event) {
    let that = this;
    this.archiveColumnId = columnId;

    // Check if there is any active card
    _.forEach(this.containers, function(container) {
      if(container.id == that.archiveColumnId){
        let active_opportunities = container.widgets.filter(function(oppo){
          if(oppo.is_active)
            return oppo;
        })

        if(active_opportunities.length > 0){
          that.isArchivedAll = true;
        }else{
          that.isShowAlert = true;
          that.alert_message = "There isn't any active card in this column.";
        }
      }
    })
    this.sColumnId = -1;
  }

  onArchiveAll(event){
    let that = this;

    let opportunities = this.opportunities.filter(function(oppo){
      if(oppo.status_id == that.archiveColumnId && oppo.is_active)
        return oppo;
    });

    let params={
      opportunities: opportunities
    }
    this.opportunityService.archiveOpportunities(params).subscribe(
        res => {
          _.forEach(that.opportunities, function(oppo) {
            if(oppo.status_id == that.archiveColumnId)
              oppo.is_active = false;
          });

          let active_opportunities = that.opportunities.filter(function(oppo){
            if(oppo.is_active)
              return oppo;
          })
          that._getContainerByOppo(active_opportunities);

          that._reorder('opportunity');
          that.isArchivedAll = false;
        }, err => console.log(err)
    )
  }

  onOpenRemoveAllDlg(columnId, columnName, event) {
    let that = this;
    this.archiveColumnId = columnId;
    this.removeColumnName = columnName;

    // Check if there is any active card
    _.forEach(this.containers, function(container) {
      if(container.id == that.archiveColumnId){
        let active_opportunities = container.widgets.filter(function(oppo){
          if(oppo.is_active)
            return oppo;
        })

        if(active_opportunities.length > 0){
          that.isArchivedAll2 = true;
        }else{
          that.isRemoveAll = true;
        }
      }
    })
    this.sColumnId = -1;
  }

  onArchiveAll2(event){
    let that = this;

    let opportunities = this.opportunities.filter(function(oppo){
      if(oppo.status_id == that.archiveColumnId && oppo.is_active)
        return oppo;
    });

    let params={
      opportunities: opportunities
    }
    this.opportunityService.archiveOpportunities(params).subscribe(
        res => {
          _.forEach(that.opportunities, function(oppo) {
            if(oppo.status_id == that.archiveColumnId)
              oppo.is_active = false;
          });

          let active_opportunities = that.opportunities.filter(function(oppo){
            if(oppo.is_active)
              return oppo;
          })
          that._getContainerByOppo(active_opportunities);

          that._reorder('opportunity');
          that.isArchivedAll2 = false;
          that.isRemoveAll = true;
        }, err => console.log(err)
    )
  }

  onRemoveAll(event){
    let that = this;

    let opportunities = this.opportunities.filter(function(oppo){
      if(oppo.status_id == that.archiveColumnId)
        return oppo;
    });

    let params={
      id: this.archiveColumnId,
      opportunities: opportunities
    }
    this.statusService.deleteStatus(params).subscribe(
        res => {
            that.containers = that.containers.filter(function(container){
              if(container.id != that.archiveColumnId)
                return container;
            });

            // For quick filter in grid view.
            that.grid_quick_filter_options = that.grid_quick_filter_options.filter(function(container) {
              if(container.id != that.archiveColumnId)
                return container;
            });

            that.temp_opportunities = that.temp_opportunities.filter(function(oppo){
              if(oppo.status_id != that.archiveColumnId){
                return oppo;
              }else {
                if(!oppo.is_active)
                  return oppo;
              }
            });

            that._getGridOpportunities();
            that.isRemoveAll = false;
        }, err => console.log(err)
    )
  }

  onChangeCardQuickFilter(event) {
    let that = this;
    if(this.cardQuickFilterModel.length == 0){
      _.forEach(that.containers, function(val) {
          val.widgets = that.opportunities.filter(function(opp){
            if(val.id == opp.status_id && opp.is_active == true)
              return opp;
          });

          val.widgets = _.orderBy(val.widgets, 'order');
      });
    }

    if(this.cardQuickFilterModel.includes(1) && this.cardQuickFilterModel.includes(2)){
      _.forEach(that.containers, function(val) {
          val.widgets = that.opportunities.filter(function(opp){
            let today = new Date();
            let createdAt = new Date(opp.createdAt);
            let diff = Math.abs(today.getTime() - createdAt.getTime());
            let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

            if(val.id == opp.status_id && opp.user_id == that.userId && diffDays >= 30 && opp.is_active == true)
              return opp;
          });
      })
    }else {
      if(this.cardQuickFilterModel.includes(1)){
        _.forEach(that.containers, function(val) {
            val.widgets = that.opportunities.filter(function(opp){
              if(val.id == opp.status_id && opp.user_id == that.userId && opp.is_active == true)
                return opp;
            });

            val.widgets = _.orderBy(val.widgets, 'order');
        });
      }else if (this.cardQuickFilterModel.includes(2)){
        _.forEach(that.containers, function(val) {
            val.widgets = that.opportunities.filter(function(opp){
              let today = new Date();
              let createdAt = new Date(opp.createdAt);
              let diff = Math.abs(today.getTime() - createdAt.getTime());
              let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

              if(val.id == opp.status_id && diffDays >= 30 && opp.is_active == true)
                return opp;
            });

            val.widgets = _.orderBy(val.widgets, 'order');
        });
      }
    }
  }

  onTest(event) {
  }

  onPrint(event) {
    let that = this;
    var gridContent = '',
        win = window.open('', '', 'resizable=1, scrollbars=1');

    var htmlStart =
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<meta charset="utf-8" />' +
            '<title>Opportinuity Grid</title>' +
            // '<link href="http://kendo.cdn.telerik.com/2017.3.913/styles/kendo.common.min.css" rel="stylesheet" media="print" /> ' +
            '<style>' +
              'html { font: 11pt sans-serif; }' +
              '.k-grid table {border-collapse: collapse;}' +
              '.k-grid table, .k-grid th, .k-grid td {border: 1px solid black; text-align: center}' +
            '</style>' +
            '</head>' +
            '<body>';

    var htmlEnd =
            '</body>' +
            '</html>';

    gridContent += '<kendo-grid dir="ltr" class="k-widget k-grid">' +
                      '<kendo-grid-list class="k-grid-container">' +
                        '<div class="k-grid-content k-virtual-content">' +
                          '<table class="k-grid-table" style="transform: translateY(0px);">' +
                            '<thead><tr>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Name</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Company</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Contact</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Revenue</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Status</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Rating</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Date created</a></th>' +
                              '<th class="k-header" rowspan="1" colspan="1"><a class="k-link">Description</a></th>' +
                            '</tr></thead>'+
                            '<tbody>';
                              that.temp_opportunities.forEach(function(opportunity, index){
                                  if((index%2) != 1)
                                    gridContent += '<tr class="k-alt">';
                                  else
                                    gridContent += '<tr>';

                     gridContent += '<td colspan="1"><span>'+opportunity.name+'</span></td>' +
                                    '<td colspan="1"><span>'+opportunity.company+'</span></td>' +
                                    '<td colspan="1"><span>'+opportunity.contact+'</span></td>';

                                    if(opportunity.value && opportunity.currency == 'EUR')
                                      gridContent += '<td colspan="1"><span>€'+opportunity.value.toFixed(2)+'</span></td>';
                                    else if (opportunity.value && opportunity.currency == 'USD')
                                      gridContent += '<td colspan="1"><span>$'+opportunity.value.toFixed(2)+'</span></td>';
                                    else
                                      gridContent += '<td colspan="1"><span></span></td>';

                     gridContent += '<td colspan="1"><span>'+opportunity.status_name+'</span></td>' +
                                    '<td colspan="1"><span>'+opportunity.rating+'</span></td>' +
                                    '<td colspan="1"><span>'+opportunity.createdAt.split('-')[1]+'/'+opportunity.createdAt.split('-')[2].slice(0,2)+'/'+opportunity.createdAt.split('-')[0]+'</span></td>' +
                                    '<td colspan="1"><span>'+opportunity.description+'</span></td>' +
                                  '</tr>';
                              });
             gridContent += '</tbody>' +
                          '</table>' +
                        '</div>' +
                      '</kendo-grid-list>' +
                    '</kendo-grid>';

    win.document.write(htmlStart + gridContent + htmlEnd);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }
}

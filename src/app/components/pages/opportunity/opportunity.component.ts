import { Component, OnInit, HostListener, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { 
  OpportunityService, 
  StatusService, 
  ReminderService, 
  EventEmitterService, 
  LoginService, 
  ContactService, 
  AccountService,
  CARD_QUICK_FILTER_OPTIONS,
  REMINDERS
} from "../../../core";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpportunityComponent implements OnInit {
  @ViewChild('criteria') criteriaView: ElementRef;

  protected isColumnDraggable: boolean = true;
  protected isCardDraggable: boolean = true;
  protected containers: any = [];
  protected activeColumnId: number = -1;
  protected cardId: string = '';
  protected newColumn: string = '';
  protected addColumn: boolean = false;
  protected newColumnName: string = '';
  protected opportunities: any = [];
  protected temp_opportunities: any = [];  
  protected isShowDialog: boolean = false;
  protected newOpportunityName: string = '';
  protected qColumnId: number = -1;
  protected isShowRemoveDlg: boolean = false;
  protected isShowArchiveDlg: boolean = false;
  protected isShowArchiveAllDlg: boolean = false;
  protected isShowArchiveAllDlg2: boolean = false;
  protected isShowRemoveAllDlg: boolean = false;
  protected isShowAlertDlg: boolean = false;
  protected removeObj: Object = {id:'', status_id:''};
  protected archiveObj: Object;
  protected viewMode: string = 'card';
  protected searchStr: string = '';
  protected filter: string = '';
  protected filter_default: Object={id: 0, name:"All"};
  protected criterias: any = [];
  protected grid_criterias: any = [];
  protected card_criterias: any = [];
  protected enablePop: boolean = false;  
  protected loggedUser: any;
  protected grid_quick_filter_options: any = [];
  protected sColumnId: number = -1;
  protected archiveColumnId: number = 0;
  protected alert_message: string = '';
  protected removeColumnName: string = '';
  protected isShowGrid: boolean = false;
  protected contactList: any = [];
  protected accountList: any = [];
  protected statusList: any = [];
  protected opportunity: any;

  // Multi-check list in card view.
  protected cardQuickFilterModel: any = [];
  protected card_quick_filter_options: IMultiSelectOption[] = CARD_QUICK_FILTER_OPTIONS;
  protected card_quick_filter_settings: IMultiSelectSettings = {
      enableSearch: false,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  protected card_quick_filter_texts: IMultiSelectTexts = {
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

  protected reminder_list: Array<object> = REMINDERS;
  protected isFixedNav: boolean = false;
  protected fixedNavStyles: any = [];
  protected scrollTop: number = 0;
  protected scrollLeft: number = 0;
  protected menuWidth: number = 0;
  protected headerHeight: number = 100;
  protected columnPadding: number = 15;
  protected defaultCriteriaHeight: number = 30;
  protected cardViewStyle: any;

  constructor(
    private opportunityService: OpportunityService,
    private statusService: StatusService,
    private reminderService: ReminderService,
    private _eventEmitter: EventEmitterService,
    private loginService: LoginService,
    private contactService: ContactService,
    private accountSerivce: AccountService) 
  {
      this._eventEmitter.changeEmitted$.subscribe(
        data => {
            if(data == 'expanded')
              this.menuWidth = 250;
            else
              this.menuWidth = 58;

            this._fixColumnHeader();
        });
  }

  async ngOnInit() {
    this.loggedUser = this.loginService.getUserData();

    if(this.loggedUser.wide_menu)
      this.menuWidth = 250;
    else
      this.menuWidth = 58;

    this.contactList = await this.contactService.read().toPromise();
    this.accountList = await this.accountSerivce.read().toPromise();
    this.statusList = await this.statusService.read().toPromise();
    this.opportunities = await this.opportunityService.read().toPromise();

    this.accountList.forEach(account => {
      if (account.companyName)
        account.name = account.companyName
      else
        account.name = ''
    });

    this.contactList.forEach(contact => {
      if (contact.firstName && contact.lastName) {
        contact.name = contact.firstName + ' ' + contact.lastName;
      } else {
        if (contact.firstName) {
          contact.name = contact.firstName;
        }else if (contact.lastName) {
          contact.name = contact.lastName;
        }else {
          contact.name = '';
        }
      }
    });

    this.isShowGrid = true;

    this._fixColumnHeader();
    this._getContainer();

    // this.o_reminder = this.reminder_list[0];
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!_.includes(event.target.classList, 'add-column-text')){
      this.onAddNewColumn();
    }

    if(!_.includes(event.target.classList, 'add-column-text') && !_.includes(event.target.classList, 'add-column-button-icon')){
      this.addColumn = false;
    }

    if(!_.includes(event.target.classList, 'column-name')){
      this.onUpdateColumn();
    }

    if(!_.includes(event.target.classList, 'column-popup')){
      this.sColumnId = -1;
    }

    if(!_.includes(event.target.classList, 'card-popup')){
      this.cardId = '';
    }
  }

  private _getContainer() {
    let that = this;
    this.containers = this.grid_quick_filter_options = this.statusList;
    this.containers = this.containers.filter(function(container){
      if(container.is_active)
        return container;
    });

    // Add opportunities to containers
    _.forEach(this.containers, function(val) {
        val.widgets = that.opportunities.filter(function(opp){
          if(val.id == opp.status_id)
            return opp;
        });

        val.widgets = _.orderBy(val.widgets, 'order');
    });

    // Filter container with active opportunities
    this.temp_opportunities = this.opportunities.filter(function(oppo){
      if(oppo.is_active)
        return oppo;
    });
    this._getContainerByOppo(this.temp_opportunities);

    _.forEach(this.temp_opportunities, function(opportunity) {
      _.forEach(that.containers, function(container) {
        if(opportunity.status_id == container.id){
          opportunity.status_name = container.name;
        }
      })
    });

    // Set Opportunity notify and contact/company values.
    _.forEach(this.opportunities, function(opportunity){
      // Set notify value to opportunities for current user.
      opportunity.notify = false;
      if(opportunity.notify_users && opportunity.notify_users.length > 0){
        let notify_list = opportunity.notify_users.split(',');
        if(notify_list.indexOf(that.loggedUser.id) !== -1){
          opportunity.notify = true;
        }
      }

      // Set contact/company to opportunities.
      opportunity.contact = that._buildContactObject(opportunity.contact_id, that.contactList);
      opportunity.company = that._buildCompanyObject(opportunity.company_id, that.accountList);
    });
  }
  
  private _getContainerByOppo(opportunities) {
    _.forEach(this.containers, function(val) {
        val.widgets = opportunities.filter(function(opp){
          if(val.id == opp.status_id)
            return opp;
        });

        val.widgets = _.orderBy(val.widgets, 'order');
    })
  }

  protected onScroll(event) {
    if(!_.includes(event.target.classList, 'column-grid'))
      return;

    this.scrollTop = event.target.scrollTop;
    this.scrollLeft = event.target.scrollLeft;

    this._fixColumnHeader();
  }

  private _fixColumnHeader(): void {
    let that = this;

    if(this.scrollTop > 60){
      this.isFixedNav = true;

      _.forEach(this.containers, function(container, index) {
        that.fixedNavStyles[index] = {
          left: (that.menuWidth + that.columnPadding + 300 * parseInt(index) - that.scrollLeft) + 'px'
        }
      })
    }
    else
      this.isFixedNav = false;
  }

  protected onDragStart(event) {
    if(_.includes(event.target.classList, 'column')){
      this.isColumnDraggable = true;
      this.isCardDraggable = false;
    }
    else{
      this.isColumnDraggable = false;
      this.isCardDraggable = true;
    }
  }

  protected onDragEnd(val, event) {
    let that = this;
    this.isColumnDraggable = true;
    this.isCardDraggable = true;

    if(val == 'opportunity'){
      // For checking notify
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

          // if(that.o_isActive){
          //   that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
          //       return obj.is_active;
          //   });
          // }else {
          //   that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
          //       return !obj.is_active;
          //   });
          // }
        }

        var j = that.opportunities.findIndex(opportunity => opportunity.id === widget.id);
        if (that.opportunities[j]) {
          that.opportunities[j].status_id = container.id;
          that.opportunities[j].status_name = container.name;
        }
      })
    })
  }

  protected onPopup(columnIndex, widgetIndex) {
    if(this.cardId == 'widget_'+columnIndex+'_'+widgetIndex)
      this.cardId = '';
    else
      this.cardId = 'widget_'+columnIndex+'_'+widgetIndex;
  }

  protected onChangeBg(opportunity, bgColor) {
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
            this.cardId = '';
        },
        err => console.log(err, 'opportunity update error')
      )
  }

  protected onCollapse(columnIndex, event) {
    if(event.target == event.currentTarget) {
      this.containers[columnIndex].isCollapse = true;
    }
  }

  protected onExpand(columnIndex, event) {
    // if(event.target == event.currentTarget) {
      this.containers[columnIndex].isCollapse = false;
    // }
  }

  protected onClear() {
    // this.containers = containers;
    // this.addColumn = false;
  }

  protected onAddNewColumn() {
    if(!this.newColumn.length){
      return;
    }

    let params = {
      name: this.newColumn,
      order: this.containers.length+1
    }
    this.statusService.save(params).subscribe(
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
            this.isShowAlertDlg = true;
            this.newColumn = '';
          }
        }
      )
  }

  protected onUpdateColumn() {
    if(this.activeColumnId == -1 || !this.newColumnName.length)
      return;

    let params = {
      id: this.activeColumnId,
      name: this.newColumnName
    }
    this.statusService.save(params).subscribe(
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

  private _reorder(type) {
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

  private _getReminderDate(id){
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
          break;
      }

      return reminder_date;
  }

  protected onCreate() {
    this.opportunity = undefined;
    this.isShowDialog = true;
  }

  protected onEdit(opportunity, event) {
    this.opportunity = opportunity;
    this.isShowDialog = true;

    // this.reminderService.getReminder({user_id: this.loggedUser.id, opportunity_id: opportunity.id}).subscribe(
    //     res => {
    //       this.o_reminder = _.find(this.reminder_list, {id: res.reminder_id});

    //     },
    //     err => {
    //       console.log(err._body);
    //       this.o_reminder = this.reminder_list[0];
    //     }
    //   )
  }

  protected onQuickAddOpportunity(status) {
    let that = this;

    if(!this.newOpportunityName.length)
      return;

    let statusId = status.id;
    let order = status.widgets.length + 1;

    let params = {
      name: this.newOpportunityName,
      status_id: statusId,
      order: order,
      user_id: this.loggedUser.id
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
          that.opportunities.unshift(res);
          that._reorder('opportunity');
        },
        err => {
          if(JSON.parse(err._body).errors[0].message){
            this.alert_message = "Card name already exists.";
            this.isShowAlertDlg = true;
          }
        }
      )
  }

  protected onOpenRemoveDlg(opportunity, event) {
    this.removeObj = {
      id: opportunity.id,
      status_id: opportunity.status_id
    }
    this.isShowRemoveDlg = true;
    this.cardId = '';
  }

  protected onRemove() {
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

            that.removeObj = {};
            that.isShowRemoveDlg = false;
        },
        err => console.log(err, 'opportunity delete error')
      )
  }

  protected onSearch(event) {
    let that = this;
    that.searchStr = that.searchStr.toLowerCase();

    if(this.viewMode == 'grid'){
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

  protected onFilter(event) {
    let that = this;

    if(this.viewMode == 'grid'){
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

    }else {
      if(this.filter == 'Archive'){
        this.statusService.read().subscribe (
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
        this.statusService.read().subscribe (
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

  protected onAddCriteria() {
    if(this.searchStr.length > 0){
      this.criterias.push(this.searchStr);
      if(this.viewMode == 'grid'){
        this.grid_criterias = this.criterias;
      }else{
        this.card_criterias = this.criterias;
        this._fixCardViewHeight();
      }

      this.searchStr = '';
      this._customFilter();
    }
  }

  protected onDeleteCriteria(i) {
    this.criterias.splice(i, 1);
    if(this.viewMode == 'grid')
      this.grid_criterias = this.criterias;
    else{
      this.card_criterias = this.criterias;
      this._fixCardViewHeight();
    }
    this._customFilter();
  }

  protected onDeleteLastCriteria() {
    if(this.searchStr.length > 0)
      this.enablePop = false;

    if(this.criterias.length > 0 && this.enablePop){
      this.criterias.pop();
      if(this.viewMode == 'grid')
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

  private _fixCardViewHeight() {
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

  private _customFilter() {
    let that = this;

    if(this.viewMode == 'grid'){
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

  protected onChangeView(val) {
    this.viewMode = val;
    if(this.viewMode == 'grid')
      this.criterias = this.grid_criterias;
    else
      this.criterias = this.card_criterias;
  }

  private _combineString(obj) {
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

  protected onPopupColumnSetting(index, event) {
    if(this.sColumnId == index)
      this.sColumnId = -1;
    else
      this.sColumnId = index;
  }

  protected onOpenArchiveDlg(opportunity, event) {
    this.archiveObj = opportunity;
    this.isShowArchiveDlg = true;
    this.cardId = '';
  }

  protected onArchive(event){
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
            that.isShowArchiveDlg = false;
        },
        err => console.log(err, 'opportunity update error')
      )
  }

  protected onOpenArchiveAllDlg(columnId, event) {
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
          that.isShowArchiveAllDlg = true;
        }else{
          that.isShowAlertDlg = true;
          that.alert_message = "There isn't any active card in this column.";
        }
      }
    })
    this.sColumnId = -1;
  }

  protected onArchiveAll(event){
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
          that.isShowArchiveAllDlg = false;
        }, err => console.log(err)
    )
  }

  protected onOpenRemoveAllDlg(columnId, columnName, event) {
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
          that.isShowArchiveAllDlg2 = true;
        }else{
          that.isShowRemoveAllDlg = true;
        }
      }
    })
    this.sColumnId = -1;
  }

  protected onArchiveAll2(event){
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
          that.isShowArchiveAllDlg2 = false;
          that.isShowRemoveAllDlg = true;
        }, err => console.log(err)
    )
  }

  protected onRemoveAll(event){
    let that = this;

    let opportunities = this.opportunities.filter(function(oppo){
      if(oppo.status_id == that.archiveColumnId)
        return oppo;
    });

    let params={
      id: this.archiveColumnId,
      opportunities: opportunities
    }
    this.statusService.remove(params).subscribe(
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

            that.isShowRemoveAllDlg = false;
        }, err => console.log(err)
    )
  }

  protected onChangeCardQuickFilter(event) {
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

            if(val.id == opp.status_id && opp.user_id == that.loggedUser.id && diffDays >= 30 && opp.is_active == true)
              return opp;
          });
      })
    }else {
      if(this.cardQuickFilterModel.includes(1)){
        _.forEach(that.containers, function(val) {
            val.widgets = that.opportunities.filter(function(opp){
              if(val.id == opp.status_id && opp.user_id == that.loggedUser.id && opp.is_active == true){
                return opp;
              }
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

  private _buildContactObject(id, contactList) {
    let contactName;
    if (id && id !== '') {
      let contact = contactList.find(contact => contact.id === id);
      contactName = contact.firstName + ' ' + contact.lastName;
    } else {      
      contactName = '';
    }

    return {
      id: id,
      name: contactName 
    }
  }

  private _buildCompanyObject(id, companyList) {
    let companyName;
    if (id && id !== '') {
      let company = companyList.find(company => company.id === id);
      companyName = company.companyName;
    } else {
      companyName = '';
    }

    return {
      id: id,
      name: companyName
    }
  }

  protected updateOpportunity(opportunity) {
    this.isShowDialog = false;
    
    let index = this.opportunities.findIndex(oppo => oppo.id === opportunity.id);
    if (index === -1)
      this.opportunities.unshift(opportunity);
    
    this._getContainer();
  }

  protected closeDialog() {
    this.isShowDialog = false;
  }
}

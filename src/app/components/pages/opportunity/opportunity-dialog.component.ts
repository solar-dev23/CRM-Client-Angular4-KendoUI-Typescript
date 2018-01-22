import { Component, ViewChild, EventEmitter, Input, Output, HostListener } from "@angular/core";
import { Http } from "@angular/http";
import { NgForm } from '@angular/forms';
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { OpportunityService, REMINDERS, CURRENCIES } from "../../../core";
import * as _ from "lodash";

@Component({
  selector: "opportunity-dialog",
  templateUrl: "./opportunity-dialog.component.html",
  styleUrls: ['./opportunity-dialog.component.scss']
})
export class OpportunityDialogComponent {

  @Input() opportunity: any;  
  @Input() contactList: any[];
  @Input() accountList: any[];
  @Input() statusList: any[];
  
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();

  protected reminders: any[] = REMINDERS;
  protected currencies: any[] = CURRENCIES;
  protected isFilterCompany: boolean;
  protected isFilterContact: boolean = false;
  protected contacts: any[];
  protected companies: any[];

  constructor(private opportunityService: OpportunityService) {
  }

  public ngOnInit() {
    if (!this.opportunity) {
      this.opportunity = {
        name: '',
        company: {
          id: '',
          name: ''
        },
        contact: {
          id: '',
          name: ''
        },
        value: 0,
        currency: this.currencies[0],
        description: '',
        status_id: this.statusList[0].id,
        rating: 3,
        is_active: true,
        notify: true,
        reminder: this.reminders[0]
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!_.includes(event.target.classList, 'company') && !_.includes(event.target.classList, 'filter-search')){
      this.isFilterCompany = false;
    }

    if(!_.includes(event.target.classList, 'contact') && !_.includes(event.target.classList, 'filter-search')){
      this.isFilterContact = false;
    }
  }


  protected filterCompany() {   
    this.isFilterCompany = true;
    this.companies = this.accountList;

    let that = this;
    if(this.opportunity.company.name == ''){
      this.companies = this.accountList;
    }else {
      this.companies = this.accountList.filter(function(company) {
        if(company.companyName.toLowerCase().indexOf(that.opportunity.company.name) > -1)
          return company;
      })
    }
  }

  protected updateCompany(company) {
    this.isFilterCompany = false;
    this.opportunity.company = {
      id: company.id,
      name: company.companyName
    };
    this.opportunity.company_id = company.id;
  }

  protected createCompany() {

  }

  protected filterContact() {   
    this.isFilterContact = true;
    this.contacts = this.contactList;

    let that = this;
    if(this.opportunity.contact.name == ''){
      this.contacts = this.contactList;
    }else {
      this.contacts = this.contactList.filter(function(contact) {
        let contactName = contact.firstName + ' ' + contact.lastName;
        if(contactName.toLowerCase().indexOf(that.opportunity.contact.name) > -1)
          return contact;
      })
    }
  }

  protected updateContact(contact) {
    this.isFilterContact = false;
    this.opportunity.contact = {
      id: contact.id,
      name: contact.firstName + ' ' + contact.lastName
    };
    this.opportunity.contact_id = contact.id;
  }

  protected createContact() {

  }

  protected close() {
    this.closeDialog.emit(true);
  }

  protected onFormSubmit(opportunityForm: NgForm) {
    let that = this;
    if(!opportunityForm.valid){
      return;      
    }

    this.opportunityService.save(opportunityForm).subscribe(
      res => {
        console.log(res);
      }
    )

    // let status;
    // _.forEach(this.containers, function(container){
    //     if(container.id == opportunityForm.controls['status'].value){
    //       status = container;
    //     }
    // })

    // if(this.isNewOpportunity){
    //     let params = {
    //       name: opportunityForm.controls['name'].value,
    //       company_id: opportunityForm.controls['company'].value,
    //       contact_id: opportunityForm.controls['contact'] .value,
    //       value: opportunityForm.controls['value'].value,
    //       currency: opportunityForm.controls['currency'].value,
    //       description: opportunityForm.controls['description'].value,
    //       status_id: opportunityForm.controls['status'].value,
    //       order: 1,
    //       rating: this.o_rating,
    //       user_id: this.loggedUser.id
    //     }

    //     this.opportunityService.save(params).subscribe(
    //         res => {
    //           that.isShowDialog = false;
    //           _.forEach(that.containers, function(container){
    //               if(container.id == res.status_id){
    //                 container.widgets.unshift(res);
    //               }
    //           })
    //           that._reorder('opportunity');
    //         },
    //         err => {
    //           if(JSON.parse(err._body).errors[0].message){
    //             this.alert_message = "Card name already exists.";
    //             this.isShowAlert = true;
    //           }
    //         }
    //       )
    // }else {
    //     let params = {};
    //     if(opportunityForm.controls['status'].value == 100) {
    //       this.alert_message = "Please choose the opportunity status.";
    //       this.isShowAlert = true;
    //     }else {
    //       params = {
    //         id: this.o_id,
    //         name: opportunityForm.controls['name'].value,
    //         company_id: opportunityForm.controls['company'].value,
    //         contact_id: opportunityForm.controls['contact'] .value,
    //         value: opportunityForm.controls['value'].value,
    //         currency: opportunityForm.controls['currency'].value,
    //         description: opportunityForm.controls['description'].value,
    //         status_id: opportunityForm.controls['status'].value,
    //         rating: this.o_rating,
    //         is_active: true
    //       }

    //       if(this.o_old_status == opportunityForm.controls['status'].value){
    //         params['order'] = this.o_order;
    //       }else {
    //         params['order'] = 1;
    //       }

    //       if(opportunityForm.controls['notify'].value != undefined){
    //         params['notify'] = {
    //           id: this.loggedUser.id,
    //           value: opportunityForm.controls['notify'].value
    //         }
    //       }

    //       this.opportunityService.save(params).subscribe(
    //           res => {
    //             that.isShowDialog = false;

    //             // Update reminder if exist.
    //             if(that.o_reminder['id']){
    //               let reminder_date = that._getReminderDate(that.o_reminder['id']);
    //               let params = {
    //                 user_id: that.loggedUser.id,
    //                 opportunity_id: res.id,
    //                 reminder_id: that.o_reminder['id'],
    //                 reminder_date: reminder_date
    //               }

    //               that.reminderService.updateReminder(params).subscribe(
    //                   res => {
    //                     console.log(res);
    //                   }, err => console.log(err, 'reminder update error')
    //                 )
    //             }

    //             // Update notify value for container and opportunities
    //             res.notify = false;
    //             if(res.notify_users && res.notify_users.length > 0){
    //               let notify_list = res.notify_users.split(',');
    //               if(notify_list.indexOf(that.loggedUser.id) !== -1){
    //                 res.notify = true;
    //               }
    //             }

    //             // Update containers for card view.
    //             res.contact = that._buildContactObject(res.contact_id, that.contactList);
    //             res.company = that._buildCompanyObject(res.company_id, that.accountList);
    //             _.forEach(that.containers, function(container){
    //                 if(container.id == res.status_id){
    //                   var i = container.widgets.findIndex(widget => widget.id === res.id);
    //                   if (container.widgets[i]) {
    //                     container.widgets[i] = res;
    //                   }else {
    //                     container.widgets.unshift(res);
    //                   }
    //                 }else {
    //                   var j = container.widgets.findIndex(widget => widget.id === res.id);
    //                   if (container.widgets[j]) {
    //                     container.widgets.splice(j, 1);
    //                   }
    //                 }
    //             });

    //             that._reorder('opportunity');

    //             // Update temp opportunites for grid view.
    //             var k = that.temp_opportunities.findIndex(opportunity => opportunity.id === res.id);

    //             if (that.temp_opportunities[k] && that.o_isActive) {
    //               that.temp_opportunities[k] = res;
    //               _.forEach(that.containers, function(container) {
    //                 if(that.temp_opportunities[k].status_id == container.id){
    //                   that.temp_opportunities[k].status_name = container.name;
    //                 }
    //               })

    //               that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
    //                   return obj.is_active;
    //               });
    //             }else if (that.temp_opportunities[k] && !that.o_isActive) {
    //               that.temp_opportunities[k].is_active = true;
    //               that.temp_opportunities = _.filter(that.temp_opportunities, function(obj) {
    //                   return !obj.is_active;
    //               });
    //             }

    //             // Update opportunites for grid view.
    //             var o_index = that.opportunities.findIndex(opportunity => opportunity.id === res.id);

    //             if (that.opportunities[o_index] && that.o_isActive) {
    //               that.opportunities[o_index] = res;
    //             }else if (that.opportunities[o_index] && !that.o_isActive) {
    //               that.opportunities[o_index] = res;
    //               that.opportunities[o_index].is_active = true;
    //             }

    //             that._getGridOpportunities();
    //           },
    //           err => console.log(err, 'opportunity update error')
    //         )
    //     }
    // }
  }

}
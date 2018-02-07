import { Component, ViewChild, EventEmitter, Input, Output, HostListener } from "@angular/core";
import { Http } from "@angular/http";
import { NgForm } from '@angular/forms';
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { OpportunityService, ReminderService, LoginService, REMINDERS, CURRENCIES } from "../../../core";
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
  
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<{object: any}> = new EventEmitter();

  protected reminders: any[] = REMINDERS;
  protected currencies: any[] = CURRENCIES;
  protected isFilterCompany: boolean;
  protected isFilterContact: boolean;
  protected contacts: any[];
  protected companies: any[];
  protected isCreateCompany: boolean;
  protected isCreateContact: boolean;
  protected loggedUser: any;
  protected specific_date: Date = new Date();
  protected reminderList: any[];
  protected isShowAlertDlg: boolean;
  protected alert_message: string = '';

  constructor(
    private opportunityService: OpportunityService, 
    private reminderService: ReminderService,
    private loginService: LoginService) {
  }

  public async ngOnInit() {
    let that = this;

    this.statusList = this.statusList.filter(status => status.is_active);

    if(!this.opportunity.company_id) {
      this.opportunity.company = {
        id: '',
        name: ''
      }
    }else {
      this.accountList.forEach(account => {
        if (account.id === that.opportunity.company_id) {
          that.opportunity.company = that._getCompany(account);          
        }
      });
    }

    if(!this.opportunity.contact_id) {
      this.opportunity.contact = {
        id: '',
        name: ''
      }
    }else {
      this.contactList.forEach(contact => {
        if (contact.id === that.opportunity.contact_id) {
          that.opportunity.contact = that._getContact(contact);
        }
      });
    }

    this.loggedUser = this.loginService.getUserData();
    this.reminderList = await this.reminderService.read().toPromise();
    if (this.opportunity.id) {
      let reminder = this.reminderList.find(reminder => reminder.user_id === this.loggedUser.id && reminder.opportunity_id === this.opportunity.id);
      if(reminder)
        this.opportunity.reminder = this.reminders.find(rd => rd.id === reminder.reminder_id);
      else
        this.opportunity.reminder = this.reminders[0];
    } else {
      this.opportunity.reminder = this.reminders[0];
    }

    if(!this.opportunity.currency || this.opportunity.currency ==='')
      this.opportunity.currency = CURRENCIES[0];

    if(!this.opportunity.status_id || this.opportunity.status_id === '')
      this.opportunity.status_id = this.statusList[0].id;

    // Change archived status to first status
    let active_status = this.statusList.find(status=> status.id === this.opportunity.status_id);
    if(!active_status)
      this.opportunity.status_id = this.statusList[0].id;      
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

  protected filterCompany(): void {
    this.isFilterCompany = true;
    this.isFilterContact = false;
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

  protected focusCompany(): void {
    this.isFilterCompany = true;
    this.isFilterContact = false;
    
    if(!this.companies || this.opportunity.contact.name === '')
      this.companies = this.accountList;
  }

  protected updateCompany(company): void {
    let that = this;
    this.opportunity.company = {
      id: company.id,
      name: company.companyName
    };
    this.opportunity.company_id = company.id;
    this.isFilterCompany = false;

    this.contacts = [];
    if (company.contacts.length> 0) {
      company.contacts.forEach(contact => {
        let object = that.contactList.find(obj => obj.id === contact.id);
        that.contacts.push(object);
      });
      that.opportunity.contact = that._getContact(that.contacts[0]);
    }else {
      this.opportunity.contact = {
        id: '',
        name: ''
      }
    }
  }

  protected createCompany(): void {
    this.isFilterCompany = false;
    this.isCreateCompany = true;
  }

  protected addAccount(account): void {
    this.isCreateCompany = false;
    this.accountList.push(account);
    this.opportunity.company = {
      id: account.id, 
      name: account.companyName
    }
    this.opportunity.company_id = account.id;
  }

  protected closeAccountDialog(): void {
    this.isCreateCompany = false;
  }

  protected filterContact(): void {
    this.isFilterContact = true;
    this.isFilterCompany = false;
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

  protected focusContact(): void {
    this.isFilterContact = true;
    this.isFilterCompany = false;

    if(!this.contacts || this.opportunity.company.name === '')
      this.contacts = this.contactList;
  }

  protected updateContact(contact): void {
    let that = this;
    this.opportunity.contact = {
      id: contact.id,
      name: contact.firstName + ' ' + contact.lastName
    };
    this.opportunity.contact_id = contact.id;
    this.isFilterContact = false;

    this.companies = [];
    if (contact.accounts.length> 0) {
      contact.accounts.forEach(company => {
        let object = that.accountList.find(obj => obj.id === company.id);
        that.companies.push(object);
      });
      that.opportunity.company = that._getCompany(that.companies[0]);
    } else {
      this.opportunity.company = {
        id: '',
        name: ''
      }
    }
  }

  protected createContact(): void {
    this.isFilterContact = false;
    this.isCreateContact = true;
  }

  protected addContact(contact): void {
    this.isCreateContact = false;
    this.contactList.push(contact);
    this.opportunity.contact = {
      id: contact.id, 
      name: contact.firstName + ' ' + contact.lastName
    }
    this.opportunity.contact_id = contact.id;
  }

  protected closeContactDialog(): void {
    this.isCreateContact = false;
  }

  protected onClose() {
    this.close.emit();
  }

  protected async onFormSubmit(opportunityForm: any) {
    if(!this.opportunity.user_id)
      this.opportunity.user_id = this.loggedUser.id;

    if(!this.opportunity.order)
      this.opportunity.order = 0;

    if(!this.opportunity.is_active)
      this.opportunity.is_active = true;

    this.opportunity.notify_user_id = this.loggedUser.id;       
    this.opportunityService.save(this.opportunity).subscribe(
      res => {
        // Update Reminder table.
        let opportunity = res;

        let reminder = this.reminderList.find(reminder => reminder.user_id === this.loggedUser.id && reminder.opportunity_id === opportunity.id);
        if (reminder) {
          reminder['reminder_id'] = this.opportunity.reminder.id;
          reminder['reminder_date'] = this._getReminderDate(this.opportunity.reminder.id);
        } else {
          reminder = {
            user_id: this.loggedUser.id,
            opportunity_id: opportunity.id,
            reminder_id: this.opportunity.reminder.id,
            reminder_date: this._getReminderDate(this.opportunity.reminder.id)
          }
        }

        this.reminderService.save(reminder).subscribe(
          res => {
            this.save.emit(opportunity);            
          }
        )
      }, err =>{
        if(JSON.parse(err._body).type === "unique violation" || JSON.parse(err).type === "unique violation"){
          this.alert_message = "Opportunity already exists.";
          this.isShowAlertDlg = true;
        }
      }
    )
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

  private _getCompany(company) {
    return {
      id: company.id,
      name: company.companyName
    }
  }

  private _getContact(contact) {
    return {
      id: contact.id,
      name: contact.firstName + ' ' + contact.lastName
    }
  }
}
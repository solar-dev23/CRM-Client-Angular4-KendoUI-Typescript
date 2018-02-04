export class Opportunity {
  name: string = '';
  status_id: string = null;
  company_id: string = null;
  contact_id: string = null;
  value: number = 0;
  currency: string = '';
  rating: number = 3;
  description: string = '';
  bgColor: string = 'white';
  order: number = 0;
  is_active: boolean = true;
  user_id: string = null;
  notify_users: string = '';
  company: object = {
    id: null,
    name: ''
  };
  contact: object = {
    id: null,
    name: ''
  };
  reminder: object = {
    id: null,
    name: ''
  };
}
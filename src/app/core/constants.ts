export const ROUTE = {
  home: "",
  login: "login",
  sign_up: "sign-up",
  activate_user: "activate",
  reset_password: "reset-password",
  dashboard: "dashboard",
  users: "users",
  opportunity: "opportunity",
  report: "report",
  reportPage: "report/:page",
  contacts: "contacts",
  accounts: "accounts"
};

export const ENV_TYPE = {
  development: "development",
  production: "production"
};

export const ENTITY_NAME = {
  user: "users",
  opportunity: "opportunity",
  contact: "contact",
  account: "account"
};

export const REQUEST_URL = {
  unique_user: "/user/already-exist",
  unique_opportunity: "/opportunity/already-exist",
};

export const PERMISSIONS = {
  administration: "administration"
};

export const REMINDERS = [
  { id: 'no',   name: 'Don\'t remind me' },
  { id: '1h',   name: '1 hour' },
  { id: '12h',  name: '12 hours' },
  { id: '1d',   name: '1 day' },
  { id: '1w',   name: '1 week' },
  { id: '2w',   name: '2 weeks' },
  { id: '3w',   name: '3 weeks' },
  { id: '1m',   name: '1 month' },
  { id: 'sd',   name: 'Specific Date' }
]

export const CURRENCIES = ['USD', 'EUR'];

export const CARD_QUICK_FILTER_OPTIONS = [
  { id: 1, name: 'My Opportunities' },
  { id: 2, name: 'More than 30 days old' }
]
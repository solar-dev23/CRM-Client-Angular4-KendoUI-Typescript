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
];

export const CURRENCIES = ['USD', 'EUR'];

export const CARD_QUICK_FILTER_OPTIONS = [
  { id: 1, name: 'My Opportunities' },
  { id: 2, name: 'More than 30 days old' }
];

export const CHART_TYPE = {
  PIE: 'pie',
  DONUT: 'donut',
  BAR_VERTICAL: 'bar-vert',
  BAR_HORIZONTAL: 'bar-horz',
  LINE: 'line',
  FUNNEL: 'funnel'
};

export const DEFAULT_AVATAR_IMAGE = 'data:image/png;base64,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';

export const ACCOUNT_TYPES = [
  { id: 1, name: 'Lead' },
  { id: 2, name: 'Customer' }
]

export const COLORS = [
  "#ff6358", 
  "#ffd246", 
  "#78d237", 
  "#28b4c8", 
  "#2d73f5", 
  "#aa46be"
]
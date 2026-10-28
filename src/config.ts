/* Site-wide values the pages read. The store links are placeholders until the apps are listed. */
export const SITE = 'https://sawaza.app';
export const SITE_NAME = 'Sawaza';
export const CONTACT_EMAIL = 'hello@sawaza.app';
export const COMPANY = 'SAWAZA TECHNOLOGIES - SMC LIMITED';
export const STORE_PLAY_URL = '#';
export const STORE_APPLE_URL = '#';

/* The Stellar time-stamp line and its "Check a record yourself" link, on Home and Trust. Off by
   default; the preview build turns it on through PUBLIC_SHOW_ANCHOR=true. */
export const SHOW_ANCHOR = import.meta.env.PUBLIC_SHOW_ANCHOR === 'true';

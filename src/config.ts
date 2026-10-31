/* Site-wide values the pages read. The store links are placeholders until the apps are listed. */
export const SITE = 'https://sawaza.app';
export const SITE_NAME = 'Sawaza';
export const CONTACT_EMAIL = 'admin@sawaza.app';
export const COMPANY = 'SAWAZA TECHNOLOGIES - SMC LIMITED';
export const STORE_PLAY_URL = '#';
export const STORE_APPLE_URL = '#';

/* The Stellar time-stamp line and its "Check a record yourself" link, on Home and Trust. Off by
   default; the preview build turns it on through PUBLIC_SHOW_ANCHOR=true. */
export const SHOW_ANCHOR = import.meta.env.PUBLIC_SHOW_ANCHOR === 'true';

/* Until the app launches, the live site is the pre-launch cut: Home tells the company's story with
   no app screens, About, Privacy, Terms and the contact details stay, every page is kept out of
   search, and the product pages send their visitors Home. Launch day builds with
   PUBLIC_LAUNCHED=true, so the full site comes back without a rebuild of any page. The default is
   the cut, so a build that forgets the switch never publishes the product early. */
export const LAUNCHED = import.meta.env.PUBLIC_LAUNCHED === 'true';
export const PRELAUNCH = !LAUNCHED;

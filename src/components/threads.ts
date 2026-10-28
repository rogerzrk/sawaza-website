/* The threads the pages draw: Sarah's rent with David from each phone, and Sarah's school fees
   loan to Grace. The home page adds the ties its hero line is drawn between. */
import type { ThreadItem } from './Thread.astro';

export const PERSONAL_TABS = ['Activity', 'Records', 'Bills & Debts'];

export const sarahWithDavid: ThreadItem[] = [
  { day: '1 Aug', side: 'r', lab: 'You', dir: 'out', amount: '450,000', at: '8:47 am', line: 'You paid · Rent', by: 'David', sealedAt: '9:02 am' },
  { day: '1 Sep', side: 'r', dir: 'out', amount: '450,000', at: '9:12 am', line: 'You paid · Rent', by: 'David', sealedAt: '9:40 am' },
  { day: '14 Sep', side: 'l', lab: 'David Landlord', dir: 'in', amount: '60,000', at: '4:05 pm', line: 'Paid you · Refunds', by: 'David', sealedAt: '4:20 pm' },
  { day: '1 Oct', side: 'r', lab: 'You', dir: 'out', amount: '450,000', at: '10:21 am', line: 'You paid · Rent', by: 'David', sealedAt: '10:24 am', pending: 'wait', waitFor: 'David' },
];

export const davidWithSarah: ThreadItem[] = [
  { day: '1 Aug', side: 'l', lab: 'Sarah', dir: 'in', amount: '450,000', at: '8:47 am', line: 'Paid you · Rent', by: 'Sarah', sealedAt: '9:02 am' },
  { day: '1 Sep', side: 'l', dir: 'in', amount: '450,000', at: '9:12 am', line: 'Paid you · Rent', by: 'Sarah', sealedAt: '9:40 am' },
  { day: '14 Sep', side: 'r', lab: 'You', dir: 'out', amount: '60,000', at: '4:05 pm', line: 'You paid · Refunds', by: 'Sarah', sealedAt: '4:20 pm' },
  { day: '1 Oct', side: 'l', lab: 'Sarah', dir: 'in', amount: '450,000', at: '10:21 am', line: 'Paid you · Rent', by: 'Sarah', sealedAt: '10:24 am', pending: 'review' },
];

export const sarahWithGrace: ThreadItem[] = [
  { day: '12 Oct', side: 'r', lab: 'You', dir: 'out', amount: '100,000', at: '2:02 pm', line: 'You lent · Tuition & School Fees', by: 'Grace', sealedAt: '2:30 pm' },
  { day: '26 Oct', side: 'l', lab: 'Grace', dir: 'in', amount: '40,000', at: '3:12 pm', line: 'Paid you · Tuition & School Fees', by: 'Grace', sealedAt: '3:40 pm' },
];

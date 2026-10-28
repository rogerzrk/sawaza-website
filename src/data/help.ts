/* The help page's answers, by topic, in the order the page shows them. An answer is markup:
   a few hold a list. `open` marks the one answer drawn open on arrival, and `isNew` marks the
   answers whose words are not yet on the home page or in the app. */
export interface Qa { q: string; a: string; open?: boolean; isNew?: boolean }
export interface Topic { id: string; title: string; qas: Qa[] }

export const HELP_TOPICS: Topic[] = [
  { id: "money", title: "Money and cost", qas: [
    { q: "What does it cost?", a: "<p>Sawaza is free to use: write records, send them and keep them, with no fees.</p>", open: true },
    { q: "Does Sawaza touch my money?", a: "<p>No. It records money. It never holds it or moves it. You pay the way you always do, in cash, by Mobile Money or through a bank, and Sawaza keeps the record of it.</p>", isNew: true },
    { q: "Will Sawaza ever ask me to send money?", a: "<p>No. Sawaza never asks you to send money. A message that asks you to pay in order to see or confirm a record did not come from Sawaza.</p>", isNew: true },
  ] },
  { id: "start", title: "Getting started", qas: [
    { q: "What is Sawaza?", a: "<p>Sawaza keeps one record of money between two people, signed by both. You write what happened and say which way it went: paid or received, lent or borrowed, sold or bought on credit. The other side confirms it, and you both hold the same copy and read from the same page.</p>", isNew: true },
    { q: "How do I sign in?", a: "<p>With your phone number. Sawaza sends a six-digit code to that number, and your number is the one thing it verifies. There is no password and no email to remember.</p>", isNew: true },
    { q: "I lost my phone. Are my records gone?", a: "<p>No. Sign in with the same number on a new phone and your records are there.</p>", isNew: true },
    { q: "Do I need a signal to write a record?", a: "<p>No. Sawaza works without network. What you write is kept on your phone and sent when you are back online.</p>", isNew: true },
    { q: "The other person is not on Sawaza. Can I still write a record?", a: "<p>Yes. Pick a phone contact, type a number, or write a name alone. Someone on Sawaza is asked to confirm it in the app. A number not on Sawaza yet gets a link on WhatsApp or SMS, and the record waits for them. A name alone stays with you. Nothing is signed from the notification: they open the record and answer it there. Don't wait for their book. Start yours.</p>", isNew: true },
    { q: "What can I keep for myself?", a: "<p>Your records and who owes what, your cash, bank and mobile money accounts, and things you own, such as land or a motorbike, with what they cost. Spaces are like folders for your records: keep a plot, a farm or a shop apart from your own money. Each record lands in the space you pick, and how you file it never changes it for the other side.</p>", isNew: true },
  ] },
  { id: "privacy", title: "Who sees what", qas: [
    { q: "Who sees my records?", a: "<p>Only the people you choose to share them with. You can write a record about someone and keep it to yourself: it stays private until you send it, and you never have to.</p>" },
    { q: "Does Sawaza read my phonebook?", a: "<p>The names in your phonebook stay on your phone. Only you see who you add and what you call them.</p>", isNew: true },
    { q: "Can I delete a record?", a: "<p>You can remove your own copy, never the other side's. Their copy stays theirs.</p>", isNew: true },
    { q: "What is shared on a record, and what is only mine?", a: "<p>Shared: the amount, who paid whom, the day, both signatures and every answer to it. Yours alone: the item, the space and the account you file it under, and the name you saved the person as. If you saved him as David Landlord, the record still says David.</p>", isNew: true },
    { q: "Who can see a photo or receipt I attach?", a: "<p>Only the people who can read its record.</p>", isNew: true },
    { q: "How do I know a number or a name is real?", a: "<p>A number shows On Sawaza once it is proved. A name shows who gave it: Self-declared, or Named by the writer.</p>", isNew: true },
    { q: "How do I delete my account?", a: "<p>Delete your account from Settings. A record someone else signed with you stays in their copy.</p>", isNew: true },
  ] },
  { id: "records", title: "Answering a record", qas: [
    { q: "Someone sent me a record. What can I do?", a: "<p>Open it and choose one answer:</p><ul><li><b>Confirm, I received it</b>, when it happened as written.</li><li><b>The details are wrong</b>: say what the figure should be, and they are asked to confirm it.</li><li><b>This isn't mine</b>: decline it, and it stays off your books.</li></ul><p>You can also tap Later and come back to it. Nothing signs from a notification: only your answer on the record does.</p>", isNew: true },
    { q: "What does confirming mean?", a: "<p>Confirming says the record happened as written. It is not a judgement on the price.</p>", isNew: true },
    { q: "What does Awaiting mean?", a: "<p>A record is sealed only when everyone it names has signed. Until then it says where it stands on both phones: Waiting on the person who has not signed, Contested, or Declined.</p>", isNew: true },
    { q: "What if the details are wrong?", a: "<p>The other side says what the figure should be, and you are asked to confirm it. If you still disagree, the record reads Contested and keeps both versions. Nobody can remove either one.</p>", isNew: true },
    { q: "What happens when I decline a record?", a: "<p>The person who wrote it sees that you declined it. It stays off your books and can't be sealed.</p>", isNew: true },
    { q: "What does Contested mean?", a: "<p>You and the other side don't agree on the record. Both versions are kept, and neither can be removed. Sawaza is a witness, not a judge.</p>", isNew: true },
    { q: "What does \"Sawa. Sealed.\" mean?", a: "<p>Everyone named on the record has signed it. You both hold the same copy, and any change shows.</p>", isNew: true },
    { q: "Can a signed record be changed?", a: "<p>A signed record is sealed, so any change shows. A disagreement keeps both versions, and a correction is a new record both sides sign.</p>", isNew: true },
    { q: "Is a record's history kept?", a: "<p>Yes. A record's page shows who wrote it, who confirmed it, on which phone and when. A signed record is sealed, so any change shows, and a disagreement keeps both versions.</p>", isNew: true },
  ] },
  { id: "groups", title: "Groups", qas: [
    { q: "What kinds of groups can I start?", a: "<p>Savings &amp; Investment (a SACCO or chama), Cash round, Household and Other, for a club, a committee or a burial society.</p>", isNew: true },
    { q: "Who does what in a group?", a: "<p>Officers act for the group from the avatar menu and record its money. Records made while acting as the group are the group's, and its people confirm their own lines. An admin's powers come only from acting as the group: on their own account, they are a member like everyone else. In the beta, each group or business account has one admin, who signs for the group on each of its records. Its people are members, admins and the owner. Titles such as Chair, Treasurer and Secretary are the group's own words.</p>", isNew: true },
    { q: "How do I add members?", a: "<p>Type a number and Sawaza checks whether they are on Sawaza, invite someone already on it, or add a name only. A name only is kept by the group, and only the group sees it.</p>", isNew: true },
    { q: "How does a cash round work on Sawaza?", a: "<p>Everyone pays the same amount each cycle, and one member takes the pot each turn. Sawaza keeps who has paid, the payout order and the reminders. A button records a payment; it never pays.</p>", isNew: true },
    { q: "What do savings group members see?", a: "<p>A register for the group and a passbook for each member. The register is added up from the group's own records, so nothing is typed in twice. A passbook shows each member's savings and shares, and members see their own on the group's contact page. A member who leaves keeps their line in the register.</p>", isNew: true },
    { q: "How do I start a group?", a: "<p>Start it from your own account. Choose Group, then the kind nearest yours. Add members by phone number, by name only, or someone already on Sawaza.</p>", isNew: true },
    { q: "Can a group lend to its members?", a: "<p>Yes. Loans to members carry a schedule: the day of each payment, what was paid back and what is still owed. In the beta, a group's loans are an open book: its members can read them.</p>", isNew: true },
    { q: "How does a household work?", a: "<p>A home's money kept by two partners. Your spouse is invited as an owner, and you stand on the same side of every record. The bills you share and the things you own together are in one place both of you can read.</p>", isNew: true },
  ] },
  { id: "business", title: "Businesses", qas: [
    { q: "What kinds of business can use Sawaza?", a: "<p>A sole business, a company, a partnership or a cooperative, each with an account of its own, kept apart from your own money.</p>", isNew: true },
    { q: "Is the business's money kept apart from mine?", a: "<p>Yes. The business keeps its own account and its own books. Your personal records stay in yours.</p>", isNew: true },
    { q: "How do invoices work?", a: "<p>One credit sale, one record. The seller holds the invoice and the buyer holds the bill, and both sign it.</p>", isNew: true },
    { q: "Can I lend with a payment plan?", a: "<p>Yes. A loan has terms: a type, a rate, a number of payments and any fees. Sawaza works out the schedule and what is still owed. The borrower accepts the terms on their own phone before the loan stands. Each payment has a day, the part that is the loan, the part that is interest, and a status. A payment you record is split between late fee, fees, interest and the loan.</p>", isNew: true },
    { q: "Who can act for my business?", a: "<p>Officers act for the business and sign for it. Records made while acting for it are the business's, never the officer's own. A viewer only reads the books. In the beta, each group or business account has one admin. Titles are the business's own words: Manager, Director, Administrator, or one you type.</p>", isNew: true },
    { q: "Can I sell on credit with a deposit?", a: "<p>Yes. A sale on credit can carry a deposit paid now, with the rest due on the day you set. Your customer confirms what they owe and by when, on their own phone. Each part payment is recorded against it, and the figure left goes down on both sides.</p>", isNew: true },
    { q: "What does a customer's account show?", a: "<p>Each customer's invoices, part payments and what is left, signed by them. Each person shows one net figure: what they owe you, or what you owe them. Cleared is shown when the debt is paid off.</p>", isNew: true },
    { q: "Do I have to switch on books?", a: "<p>No. A business keeps its books from its first record. They show money in and out each month, across every space you keep.</p>", isNew: true },
    { q: "Does Sawaza do quotations and receipts?", a: "<p>Not in the beta. Quotations and receipts, line items and templates, and statements for your customers are not there yet.</p>", isNew: true },
  ] },
];

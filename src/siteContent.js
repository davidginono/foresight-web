export const company = {
  name: 'Computer Resources (T) Limited', sales: 'info@foresight.co.tz', general: 'info@foresight.co.tz', support: 'support@foresight.co.tz',
  phone: '+255 272 979 004', telephone: '+255272979004', address: 'Maliasili Street, Corridor Area, Themi, Arusha, Tanzania',
  playStore: 'https://play.google.com/store/apps/details?id=app.foresightfin.foresight_financials',
};
export const products = [
  { slug: 'saccos-microfinance-system', name: 'SACCOS & Microfinance', title: 'Foresight SACCOS & Microfinance Management System', headline: 'Savings, loans and accounts in one place.', summary: 'Manage members, savings, shares, loans and reports.', audience: 'SACCO managers, accountants, loan officers and ICT teams', features: [
    ['Members', 'Keep member records. Control who can view them.'],
    ['Savings, shares and deposits', 'Track supported accounts, balances and transactions.'],
    ['Loans', 'Track loans, balances and repayments with your agreed modules.'],
    ['Accounts and reports', 'Use the accounts and reports set up for your institution.'],
    ['Management reports', 'See reports to help your team plan.'],
    ['Member app', 'Members of participating institutions can view supported account and loan details in the app.'],
  ]},
  { slug: 'union-management-system', name: 'Cooperative Unions', title: 'Foresight Cooperative Union Management System', headline: 'Bring your member societies together.', summary: 'Manage society records, finances and reports with your agreed modules.', audience: 'Union management, finance teams and member-society coordinators', features: [
    ['Society records', 'Keep records for your member societies.'],
    ['Financial management', 'Review finances and reports in your agreed setup.'],
    ['Combined reports', 'Tell us which society records and reports you need to combine. We will check what is supported.'],
    ['Staff access', 'Agree who can see and change each record.'],
    ['Setup and training', 'Agree setup, data, training and support before you start.'],
  ]},
  { slug: 'amcos-management-system', name: 'AMCOS', title: 'Foresight AMCOS Management System', headline: 'Keep your cooperative’s work in view.', summary: 'Manage farmer records, produce sales and finances with your agreed modules.', audience: 'AMCOS managers, farmer-records teams and finance officers', features: [
    ['Member and farmer records', 'Keep member and farmer records together.'],
    ['Produce purchases and sales', 'Review supported produce purchases and sales.'],
    ['Financial records', 'Track transactions with your agreed modules.'],
    ['Stock and produce tracking', 'Check stock tracking, weighing, storage, deductions and farmer payments with our team. Availability varies.'],
    ['Operational reports', 'See the reports available in your setup.'],
    ['Training and support', 'Train your team. Arrange help under your service agreement.'],
  ]},
];
export const otherProducts = [
  ['payroll-system', 'Payroll System', 'Manage staff records, pay and reports. Check local tax and reporting needs with our team.'],
  ['car-tracking-system', 'Vehicle Tracking System', 'Explore vehicle tracking. Confirm devices, network needs and service terms in a demo.'],
  ['school-management-system', 'School Management System', 'Explore student records, school work and finances supported by the system.'],
  ['inventory-and-accounting-software', 'Inventory & Accounting Software', 'Discuss stock, purchases, sales and accounts for your agreed setup.'],
];
export const implementationSteps = [
  ['Tell us your needs', 'Tell us what your team needs.'],
  ['Check records and devices', 'Check your records, internet and devices.'],
  ['Set up and move records', 'Agree the setup. Clean and move your records.'],
  ['Try it and approve', 'Check records and tasks before your team approves.'],
  ['Train and start', 'Train your team and agree when to start.'],
  ['Get ongoing help', 'Agree how to get help and keep the system running.'],
];
export const faqs = [
  ['Who is it for?', 'SACCOS, microfinance institutions, unions and AMCOS. We also offer payroll, vehicle tracking, school and stock/accounting systems. Ask for a demo to check the fit.'],
  ['Will it meet our reporting needs?', 'Ask us to show the reports you need. Availability depends on your setup and local rules. Your institution remains responsible for meeting those rules.'],
  ['How are backups handled?', 'Agree how often backups run, where they are kept, who manages them and how recovery is tested. Backup schedules are not assumed to be the same for every institution.'],
  ['Cloud or a local server?', 'We check your internet, devices and access needs together. Agree hosting, upkeep and recovery duties before setup.'],
  ['Can our members use the app?', 'The app is for members of participating institutions. Features and access depend on your SACCO. Check with your SACCO first.'],
  ['How do we get help?', 'Your service agreement sets the help available, contact channels and response terms. Ask support@foresight.co.tz about your cover.'],
  ['Do you work outside Tanzania?', 'Tanzania is our main market. For other East African countries, we first check product fit, local reports, delivery and support.'],
  ['What will it cost? How long will it take?', 'Cost and timing depend on your users, modules, records, devices, training and support. Request a demo and a proposal.'],
];
export const articles = [
  { slug:'sacco-system-upgrade-guide', title:'Planning a SACCO system upgrade', category:'Cooperative education', description:'Check tasks, reports and records before you upgrade.', sections:[
    ['Start with the work your team needs to do', 'List the member, savings, loan and account tasks that need improvement. Ask the people who do the work. Mark what matters most.'],
    ['Ask for evidence during the demonstration', 'Use examples without real member details. Ask to see reports, access rules and how errors are handled. Note what works now, needs setup or is planned.'],
    ['Plan the transition', 'Check your records, devices and training needs. Agree who checks moved records, signs off, provides help and pays ongoing costs before choosing a start date.'],
  ]},
  { slug:'sacco-data-migration-guide', title:'Moving your SACCO records', category:'Cooperative education', description:'Prepare, check and approve your records before moving.', sections:[
    ['Inventory your records', 'List members, balances, loan plans, past transactions and checking reports. Decide what moves and what stays in the archive.'],
    ['Clean and protect the data', 'Ask record owners to fix duplicate names, wrong IDs and unclear balances. Share agreed records securely. Agree who can use them and for how long.'],
    ['Test before cutover', 'Try a test move. Check totals and sample accounts, record problems and get approval. Agree a changeover time, backups, a way back and team support.'],
  ]},
  { slug:'cloud-versus-local-servers', title:'Cloud or a local server?', category:'Cooperative education', description:'Compare internet needs, upkeep, backups and cost.', sections:[
    ['Compare the operating environment', 'Check internet, power, devices, branches and staff access. Ask which setups the software supports and where help is available.'],
    ['Assign responsibilities clearly', 'Agree who handles updates, access, backups, recovery tests and problems. Hosting alone does not cover recovery or every reporting rule.'],
    ['Assess the complete cost', 'Compare device, subscription, internet, setup, upkeep and recovery costs over time. Ask for the agreed terms in writing.'],
  ]},
  { slug:'evaluate-union-amcos-software', title:'Choosing software for a union or AMCOS', category:'Cooperative education', description:'Check society, produce, finance and reporting tasks.', sections:[
    ['Describe the institution accurately', 'Unions work with member societies. AMCOS handle agricultural marketing. List the records and tasks each team needs.'],
    ['Demonstrate the workflows that matter', 'For unions, check society records and combined reports. For AMCOS, check farmers, produce buying and sales. Ask if weighing, stock, deductions and payments are included.'],
    ['Check implementation fit', 'Check user access, records, busy seasons, training and help. Confirm available modules and any extra work before asking for a price.'],
  ]},
  { slug:'prepare-software-demonstration', title:'Getting ready for a software demo', category:'Cooperative education', description:'Bring your team, key tasks and questions.', sections:[
    ['Bring a focused brief', 'Describe your institution, current system, users, branches and main problems. Choose a few key tasks. Use examples without real member details.'],
    ['Involve the people who do the work', 'Bring the staff who handle daily work, accounts, loans and IT. Ask about records, reports, access, setup, the app and moving data.'],
    ['Leave with clear next steps', 'Note what works now, what is planned and what still needs an answer. Agree next steps and details for a proposal. A demo does not commit you to buy.'],
  ]},
];
export const nativePaths = new Set(['/', '/about-us/', '/services/', '/technology/', '/implementation-guide/', '/faq/', '/request-demo/', '/contact-us/', '/updates/', '/testimonials/', '/software-consultancy-and-service/', ...products.map(p=>`/${p.slug}/`), ...otherProducts.map(p=>`/${p[0]}/`), ...articles.map(p=>`/resources/${p.slug}/`)]);
export const navigation = [
  {label:'Home', href:'/'},
  {label:'Solutions', href:'/services/#solutions', links:[...products.map(p=>[p.name,`/${p.slug}/`]),['Other Business Solutions','/services/#other-solutions']]},
  {label:'Technology', href:'/technology/', links:[['Cloud & Hosting','/technology/#cloud'],['Mobile Applications','/technology/#mobile'],['Integration & Reporting','/technology/#integration']]},
  {label:'Services', href:'/services/#implementation', links:[['Implementation','/services/#implementation'],['Data Migration','/implementation-guide/#migration'],['Training','/services/#training'],['Support','/services/#support'],['Consultancy','/software-consultancy-and-service/']]},
  {label:'Resources', href:'/updates/', links:[['Guides & Articles','/updates/'],['Training & Events','/training/'],['Testimonials','/testimonials/'],['FAQs','/faq/']]},
  {label:'About Us', href:'/about-us/', links:[['Company Profile','/about-us/'],['Our Approach','/about-us/#approach'],['Contact','/contact-us/'],['Gallery','/gallery/']]},
];

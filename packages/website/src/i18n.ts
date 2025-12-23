import SyncProblem from '@mui/icons-material/SyncProblem'
import Hub from '@mui/icons-material/Hub'
import ShieldLock from '@mui/icons-material/Shield'
import ManageAccounts from '@mui/icons-material/ManageAccounts'
import Speed from '@mui/icons-material/Speed'
import Schema from '@mui/icons-material/Schema'
import DashboardCustomize from '@mui/icons-material/DashboardCustomize'
import AccountTree from '@mui/icons-material/Route'

const appTitle = 'InfoPortal'
export const m = {
  title: appTitle,
  // desc: 'The next generation of data collection & management software.',
  desc: 'Turn data into decisions',
  key1: 'Collect & Import',
  key2: 'Transform & Manage',
  key3: 'Visualize & Analyze',
  cta: 'Try for free',
  logoAlt: appName + ' logo',
  blog: 'Blog',
  highlights: {
    centralized: {
      title: 'All-in-One Platform',
      desc: `From data collection to databases, dashboards, and fine-grained access control - <b>everything in a single place.</b>`,
    },
    interface: {
      title: 'Fast & Intuitive',
      desc: `No steep learning curve, no heavy setup costs. <b>Start in minutes</b>, without training.`,
    },
    organization: {
      title: `Built for Organizations`,
      desc: `Invite colleagues and ensure resilient access rules <b>automatically up-to-date<b> with your organization.`,
    },
    moreToCome: {
      title: `This Is Just the Beginning`,
      desc: `Email notifications, merged databases, centralized individual tracking, and <b>much more are on the way</b>.`,
    },
  },
  features: {},
  overviewTitle: 'Overview',
  comparisonTitle: 'Where reporting tools fall short',
  comparison: {
    sync: {
      icon: SyncProblem,
      title: 'Fragile synchronization',
      problem: 'Synchronization of data and dashboards relies on fragile manual processes.',
      solution: 'All data, transformations and dashboards live in one system.',
    },
    traceability: {
      icon: AccountTree,
      title: 'Lack of traceability',
      problem: 'Hard to understand where figures come from and to reproduce calculations.',
      solution: 'Every figure is traceable, reproducible, and linked to its source data and logic.',
    },
    dataScattered: {
      icon: Hub,
      title: 'Scattered data',
      problem: 'Data is spread across sources, preventing a consistent global view.',
      solution: 'All sources are unified into a single global view.',
    },
    dataAccessFine: {
      icon: ShieldLock,
      title: 'Data protection risks',
      problem: 'Sensitive data cannot be reliably restricted to the right roles.',
      solution: 'Access stays aligned with organizational roles over time.',
    },
    dataAccessUpdate: {
      icon: ManageAccounts,
      title: 'Access drift',
      problem: 'Access rules become outdated due to team turnover.',
      solution: 'Access can be defined per dataset or view.',
    },
    performances: {
      icon: Speed,
      title: 'Poor scalability',
      problem: 'Reporting tools slow down as data volumes grow.',
      solution: 'Performance remains fast and stable at scale.',
    },
    transformations: {
      icon: Schema,
      title: 'Fragile data processing',
      problem: 'Data processing is limited and break as forms evolve.',
      solution: 'Data processing handles form changes without rework, even for complex cases.',
    },
    dashboardInconsistent: {
      icon: DashboardCustomize,
      title: 'Inconsistent dashboards',
      problem: 'Dashboards are inconsistent and must be duplicated for translations.',
      solution: 'Dashboards follow shared rules and support multiple languages.',
    },
  },
  // problem: {
  //   title: 'Problems',
  //   sync: 'Keeping databases, views and dashboards synchronized is fragile and hard to automate.',
  //   dataScattered: 'Data is spread across multiple sources, making a consistent global view difficult.',
  //   dataAccessUpdate: 'Access rules become outdated over time due to team turnover.',
  //   dataAccessFine: 'Fine-grained access control per role is hard to maintain on the same dataset.',
  //   performances: 'Reporting tools become slow and unstable as data volumes grows.',
  //   transformations: 'Data transformations and calculations are fragile and hard to maintain as forms change.',
  //   dashboardInconsistent: 'Dashboard designs are inconsistent and require duplication to handle multiple languages.',
  // },
  // solution: {
  //   title: 'Solutions',
  //   sync: 'All data, transformations and dashboards live in a single, centralized system.',
  //   dataScattered: 'Multiple data sources are unified into one consistent and reliable global view.',
  //   dataAccessUpdate: 'Access is managed centrally and stays aligned with organizational roles.',
  //   dataAccessFine: 'Access can be defined for specific parts of the dataset.',
  //   performances: 'By avoiding chained tools and exports, performance remains fast and stable as data grows.',
  //   transformations:
  //     'Data transformations remain robust as forms evolve, without relying on fragile, tool-specific formulas.',
  //   dashboardInconsistent:
  //     'Dashboards are built from shared rules and structures, ensuring consistency and easy multilingual support.',
  // },

  overview_: {
    xls: {title: 'Built on XLS Form', desc: 'The most flexible open standard to design surveys with complex logic.'},
    database: {
      title: 'Full control of your data',
      desc: 'A powerful, intuitive interface to manage, clean, and organize your information.',
    },
    collaborative: {
      title: 'Real-time Collaborative',
      desc: `Work together live, see teammates' edits instantly and keep a transparent history.`,
    },
    access: {
      title: 'Granular access control',
      desc: 'Define fine-grained permissions by user, role, or group.',
    },
    dashboard: {
      title: 'Custom dashboards',
      desc: 'Turn your data into interactive dashboards, updated in real time.',
    },
    kobo: {
      title: 'Seamless KoboToolbox integration',
      desc: `Keep your KoboToolbox surveys in sync while unlocking InfoPortal's full power.`,
    },
  },
  faq: `FAQ`,
  faq_: [
    {
      question: `How was InfoPortal created?`,
      answer: `InfoPortal was first initiated within the Danish Refugee Council's Ukraine mission to overcome the challenges of traditional <b>Information Management Systems</b>. 
  Over more than two years, it was continuously developed and improved, until it became clear that the solution could benefit organizations far beyond DRC. 
  The platform has since been redesigned to work across organizations, in a flexible and fully generic way.`,
    },
    {
      question: `What's the added value of InfoPortal compared to existing solutions?`,
      answer: `Most information management workflows today are fragmented across multiple tools that were never designed to work together. 
  For example, data might be collected in KoboToolbox, exported to Excel, and then visualized in Power BI - therefore without proper access management or a reliable single source of truth. 
  This often leads to <b>scattered</b> systems, corrupted data and a <b>loss of the overall picture</b>. 
  InfoPortal solves this by bringing collection, integration, management, and visualization together into one secure, cohesive platform.`,
    },
    {
      question: `When will the final product be launched?`,
      answer: `InfoPortal is currently in its final stages of development. 
  We plan to open early access to selected partners within the coming months, with a wider public launch expected later this year. 
  Join the waitlist to stay informed and get early updates.`,
    },
    {
      question: `How will the data be protected?`,
      answer: `Data protection is at the core of InfoPortal. 
  All data is encrypted both in transit and at rest, and stored on secure, <b>GDPR-compliant infrastructure</b>. 
  Access rights can be finely managed to ensure that only authorized users can view or edit sensitive information. 
  We follow industry best practices to safeguard your data and your users' privacy.`,
    },
    {
      question: `Will it be free?`,
      answer: `Yes. <b>A free tier</b> will be available for personal use, students, and small teams. 
  For larger organizations, we will offer affordable pricing plans designed to cover infrastructure costs and ensure the long-term sustainability of the platform.`,
    },
  ],
  // created: ``,
}

import DashView from './components/Dash.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/dash/Dashboard.vue'
import TicketsView from './components/dash/Tickets.vue'
import ContactsView from './components/dash/Contacts.vue'
import StatsView from './components/dash/Stats.vue'

// Routes
// When adding new routes, make sure that the subpages are also
// directly served by the server to our 'index.html', e.g. by changing
// the hug example lines in checkticket.py.
const routes = [
  {
    path: '/',
    component: DashView,
    auth: true,
    children: [
      {
        path: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: { description: 'Overview of environment' }
      }, {
        path: 'tickets',
        component: TicketsView,
        name: 'Tickets',
        meta: { description: 'Show sent reports' }
      }, {
        path: 'contacts',
        component: ContactsView,
        name: 'Contacts',
        meta: { description: 'Maintain contact database' }
      }, {
        path: 'stats',
        component: StatsView,
        name: 'Statistics',
        meta: { description: 'Analysis interface' }
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
        },
        {
          name: 'Suggestions Data',
          path: 'pages/suggestions-data',
          component: () => import('@/views/dashboard/pages/SuggestionTable'),
        },
        {
          name: 'My Suggestions',
          path: 'pages/my-suggestions',
          component: () => import('@/views/dashboard/pages/MySuggestions'),
        },
        {
          name: 'New Suggestion',
          path: 'pages/create-suggestion',
          component: () => import('@/views/dashboard/pages/NewSuggestion'),
        },
        {
          name: 'Edit Suggestion',
          path: 'pages/edit-suggestion',
          component: () => import('@/views/dashboard/pages/EditSuggestion'),
        },
        {
          name: 'Pending List',
          path: 'pages/approver/pending-suggestion',
          component: () => import('@/views/dashboard/pages/approver/PendingList'),
          meta: {
            permission: 'user',
          },
        },
        {
          name: 'Tracking List',
          path: 'pages/approver/tracking-suggestion',
          component: () => import('@/views/dashboard/pages/approver/TrackingList'),
          meta: {
            permission: 'user',
          },
        },
        {
          name: 'Login',
          path: '/login',
          component: () => import('@/views/dashboard/pages/Login'),
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps'),
        },
        // Upgrade
        {
          name: 'Upgrade',
          path: 'upgrade',
          component: () => import('@/views/dashboard/Upgrade'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
if (to.matched.some(record => record.meta.permission)) {
    const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : []
    if (user.role === 'Approver') {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router

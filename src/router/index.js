import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import DeviceManagementView from '../views/DeviceManagementView.vue'
import DataAnalysisView from '../views/DataAnalysisView.vue'
import AlertCenterView from '../views/AlertCenterView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'devices',
        name: 'DeviceManagement',
        component: DeviceManagementView
      },
      {
        path: 'analysis',
        name: 'DataAnalysis',
        component: DataAnalysisView
      },
      {
        path: 'alerts',
        name: 'AlertCenter',
        component: AlertCenterView
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/Login.vue')
        }
      ]
    },
    {
      path: '/register',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/Register.vue')
        }
      ]
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: 'transactions',
          component: () => import('@/views/Transactions.vue')
        },
        {
          path: 'statistics',
          component: () => import('@/views/Statistics.vue')
        },
        {
          path: 'budget',
          component: () => import('@/views/Budget.vue')
        },
        {
          path: 'profile',
          component: () => import('@/views/Profile.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
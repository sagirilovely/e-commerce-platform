import { createRouter, createWebHistory } from 'vue-router'

import LoginByPassword from '@/views/LoginByPassword.vue'
import LoginByCode from '@/views/LoginByCode.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      name: 'login',
      children: [
        {
          path: 'password',
          component: LoginByPassword,
          name: 'loginByPassword',
        },
        {
          path: 'code',
          component: LoginByCode,
          name: 'loginByCode',
        },
      ],
    },
    {
      path: '/register',
      component: RegisterPage,
      name: 'register',
    },
    {
      path: '/home',
      component: HomePage,
      name: 'home',
    }
  ],
})

export default router

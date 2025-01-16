import { createRouter, createWebHistory } from 'vue-router'

import LoginByPassword from '@/views/LoginByPassword.vue'
import LoginByCode from '@/views/LoginByCode.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import verifyPage from '@/views/verifyPage.vue'
import HomePage from '@/views/HomePage.vue'
import useVerify from '@/stores/useVerify.ts'
import {message} from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: HomePage,
      name: 'home',
    },
    {
      path:'/verify',
      component:verifyPage,
      name:'verify',
      children:[
        {
          path:'loginByPassword',
          component:LoginByPassword,
          name:'loginByPassword'
        },
        {
          path:'loginByCode',
          component:LoginByCode,
          name:'loginByCode'
        },
        {
          path:'register',
          component:RegisterPage,
          name:'register'
        }
      ]
    }
  ],
})

router.beforeEach((to,from,next)=>{
  if(to.name==='loginByPassword' || to.name==='loginByCode' || to.name==='register' || to.name==='home'){
    //如果访问的是登录页面或商品首页,则直接放行
    next();
  }else{
    //否则进入鉴权环节
    if(useVerify().isPassVerify){
      // 如果已登录,则直接放行
     next();
    }else{
      // 如果未登录,则记录下目前的页面名,并进入验证页面
      useVerify().historyName=String(from.name ? from.name : 'home')
      message.error('请先登录!');
      router.push({name:'loginByPassword'})
    }
  }
})
export default router

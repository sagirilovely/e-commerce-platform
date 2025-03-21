import { createRouter, createWebHistory } from 'vue-router'

import LoginByPassword from '@/views/LoginByPassword.vue'
import LoginByCode from '@/views/LoginByCode.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import VerifyPage from '@/views/VerifyPage.vue'
import HomePage from '@/views/HomePage.vue'
import GoodsScanPage from '@/views/GoodsScanPage.vue'
import useVerify from '@/stores/useVerify.ts'
import {message} from 'ant-design-vue'
import ShoppingTrolleyPage from '@/views/ShoppingTrolleyPage.vue'
import UserInfo from '@/views/UserInfo.vue'
import OrderPage from '@/views/OrderPage.vue'
import MerchantVerify from '@/views/MerchantVerify.vue';
import AdminVerify from '@/views/AdminVerify.vue';
import MerchantDashboard from '@/views/MerchantDashboard.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path:'/verify',
      component:VerifyPage,
      name:'verify',
      children:[
        {
          path:'loginByPassword',
          component:LoginByPassword,
          name:'loginByPassword',
        },
        {
          path:'loginByCode',
          component:LoginByCode,
          name:'loginByCode',
        },
        {
          path:'register',
          component:RegisterPage,
          name:'register',
        }
      ]
    },
    {
      path: '/home',
      component: HomePage,
      name: 'home',
      children:[
        {
          path: 'goods',
          component:GoodsScanPage,
          name:'goods',
        },
        {
          path: 'trolley',
          component :ShoppingTrolleyPage,
          name:'trolley',
        },
        {
          path:'user',
          component: UserInfo,
          name:'user',
        },
        {
          path: 'order',
          component: OrderPage,
          name:'order',
        }
      ]
    },
    {
      path:'/merchant/verify',
      component: MerchantVerify,
      name:'merchantVerify',
    },
    {
      path:'/merchant/dashboard',
      component: MerchantDashboard,
      name:'merchantDashboard',
    },
    {
      path:'/admin/verify',
      component:AdminVerify,
      name:'adminVerify',
    },
    {
      path:'/admin/dashboard',
      component:AdminDashboard,
      name:'adminDashboard',
    }
  ],
})

router.beforeEach((to,from,next)=>{
  if(to.name==='loginByPassword' || to.name==='loginByCode' || to.name==='register' || to.name==='goods' ||to.name==='merchantVerify' || to.name==='adminVerify'){
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

<template>
  <div class="verifyPage"  :style="{backgroundImage:`url(${background})`}">
    <div class="verifyLeft">

    </div>
    <div class="verifyMiddle">
      <a-anchor
        :items="[
      {
        key: 'loginByPassword',
        href: '#loginByPassword',
        title: '密码登录',
      },
      {
        key: 'loginByCode',
        href: '#loginByCode',
        title: '邮箱登录',
      },
      {
        key: 'register',
        href: '#register',
        title: '注册账号',
      },
    ]"
        @click="handleClick"
      />
    </div>
    <div class="verifyRight">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import backgroundImg from '../assets/imgs/verifyBackground.jpg'
import router from '@/router'
import type { AnchorProps } from 'ant-design-vue';
const background = backgroundImg
//导航栏点击事件
const handleClick: AnchorProps['onClick'] = (e, link) => {
  e.preventDefault();
  router.push({
    name:link.href.split('#')[1],
    replace: true
  })
};

</script>
<style scoped>
.verifyPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-size: cover;
  background-position-x: -90px;
}
.verifyLeft {
  width: 100%;
  height: 100%;
  min-height: 98vh;
  flex: 0 0 55%;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
}
.verifyMiddle{
  width: 100%;
  height: 50%;
  min-height: 30vh;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  flex-direction: column;
  padding-left: 10px;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  backdrop-filter: blur(15px);
  transition: background-color 0.3s , min-height 0.3s;
}
.verifyMiddle:hover{
  background-color: rgba(255, 255, 255, 0.5);
  min-height: 90vh;
}
.verifyRight {
  padding-left: 4px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  flex: 1 0 37%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.verifyRight > div {
  width: 100%;
  height: 80%;
  min-height: 80vh;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 30px;
  border-radius: 10px;
  background-color: rgba(200, 200, 200, 0.1); /* 半透明背景 */
  backdrop-filter: blur(10px);
  transition: background-color 0.3s , min-height 0.3s;
}
.verifyRight > div:hover{
  background-color: rgba(255, 255, 255, 0.6);
  min-height: 90vh;
}
</style>

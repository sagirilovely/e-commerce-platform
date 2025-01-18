<template>
  <div>
<!--    主题配置-->
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#614c73',
          colorSuccess: '#d7f8f0',
          colorWarning: '#f5cf90',
          colorError: '#a43d53',
          colorInfo: '#614c73',
          colorTextBase: '#372a48',
          colorBgBase: '#f9f7ea',
        },
        algorithm:[theme[nowTheme]]
      }"
    >
<!--      路由视图-->
      <router-view></router-view>

<!--      主题切换-->
      <a-float-button
        type="default"
        :style="{
            left: '24px',
            bottom: '24px'
          }"
        @click="handleClick"
      >
        <template #icon><themeIcon></themeIcon></template>
      </a-float-button>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { theme } from 'ant-design-vue'
import useTheme from '@/stores/useTheme.ts'
import { storeToRefs } from 'pinia'
import themeIcon from './assets/icons/themeIcon.vue'
import { onMounted } from 'vue'


const { nowTheme } = storeToRefs(useTheme())

const handleClick = ()=>{
  useTheme().changeTheme();
}


onMounted(()=>{
  //从本地获取是否为暗黑模式
  const localIsDark = localStorage.getItem('isDark');
  if(localIsDark){
    if(localIsDark === 'true'){
      useTheme().changeTheme(true);
    }else{
      useTheme().changeTheme(false);
    }
  }
})
</script>

<style scoped></style>

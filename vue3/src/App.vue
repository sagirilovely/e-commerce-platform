<template>
  <div>
    <!-- 主题配置 -->
    <a-config-provider :theme="currentTheme">
      <!-- 路由视图 -->
      <router-view></router-view>

      <!-- 主题切换 -->
      <a-float-button
        type="default"
        :style="{ left: '24px', bottom: '24px' }"
        @click="handleClick"
      >
        <template #icon>
          <themeIcon></themeIcon>
        </template>
      </a-float-button>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watchEffect } from 'vue'
import { theme } from 'ant-design-vue'
import useTheme from '@/stores/useTheme'
import { storeToRefs } from 'pinia'
import themeIcon from './assets/icons/themeIcon.vue'

// 从 Pinia 中拿到当前主题设置
const { nowTheme } = storeToRefs(useTheme())

// 定义白天主题色（浅紫调）
const lightThemeToken = {
  colorPrimary: '#62507e',
  colorInfo: '#9b8ac6',
  colorSuccess: '#d7f8f0',
  colorWarning: '#f5cf90',
  colorError: '#a43d53',
  colorTextBase: '#372a48',
  colorBgBase: '#f9f7ea' // 白天背景色
}

// 定义黑夜主题色（暗色调）
const darkThemeToken = {
  colorPrimary: '#b09bcf',
  colorInfo: '#b09bcf',
  colorSuccess: '#a3d9cc',
  colorWarning: '#e4b67a',
  colorError: '#d16d7d',
  colorTextBase: '#e0e0e0',
  colorBgBase: '#1f1f1f' // 黑夜背景色
}

// 计算当前主题 token
const currentThemeToken = computed(() => {
  return nowTheme.value === 'darkAlgorithm' ? darkThemeToken : lightThemeToken
})

// 计算背景颜色
const currentBgColor = computed(() => currentThemeToken.value.colorBgBase)

// 计算主题算法
const currentAlgorithm = computed(() => {
  return nowTheme.value === 'darkAlgorithm' ? theme.darkAlgorithm : theme.defaultAlgorithm
})

// 计算最终主题配置
const currentTheme = computed(() => ({
  token: currentThemeToken.value,
  algorithm: [currentAlgorithm.value]
}))

// 切换主题
const handleClick = () => {
  useTheme().changeTheme()
}

// 监听主题变化并更新 body 背景色
watchEffect(() => {
  document.body.style.backgroundColor = currentBgColor.value
})

// 页面挂载时，根据本地存储初始化主题，并同步 body 背景色
onMounted(() => {
  const localIsDark = localStorage.getItem('isDark')
  if (localIsDark) {
    if (localIsDark === 'true') {
      useTheme().changeTheme(true)
    } else {
      useTheme().changeTheme(false)
    }
  }
  // 设置初始 body 背景色
  document.body.style.backgroundColor = currentBgColor.value
})
</script>

<style scoped>

</style>

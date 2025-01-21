<template>
  <div class="top-banner"
       :style="{backgroundColor:token.colorBgBase}">
    <img :src="background" alt="" :class="[isNavigationBarCollapsed ? 'menu-closed' : 'menu-expend']" >
  </div>
</template>
<script setup lang="ts">
import { computed} from 'vue'

defineOptions({
  name: 'TopBanner'
})
import { theme } from 'ant-design-vue';
import backgroundImg from '../assets/imgs/verifyBackground.jpg'
import useTheme from '@/stores/useTheme.ts'
const background = backgroundImg
const { useToken } = theme;
const { token } = useToken();
const isNavigationBarCollapsed=computed(()=>useTheme().isNavigationBarCollapsed)
</script>
<style scoped>
.top-banner{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width:100%;
  height: 100px;
  flex: 1 0 auto;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}
.menu-closed{
  width: 100%;
  position: absolute;
  top: -140px;
  transition: top 0.3s ease-in-out;
}
.menu-expend{
  width: 100%;
  position: absolute;
  top: -230px;
  transition: top 0.3s ease-in-out;
}
</style>

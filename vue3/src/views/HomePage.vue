<template>
  <div class="home-page" >
    <NavigationBar></NavigationBar>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import NavigationBar from '@/components/NavigationBar.vue'
</script>
<style scoped>
.home-page{
  width: 100%;
  height: 100%;
  display: flex;
}
.home-page>:nth-child(2){
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0 10px 0 10px;
  transition: width 1s ease-in-out;

}
</style>

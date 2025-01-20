<template>
  <div class="home-page">
    <NavigationBar></NavigationBar>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup lang="ts">

import NavigationBar from '@/components/NavigationBar.vue'
</script>
<style scoped>
.home-page{
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
}
</style>

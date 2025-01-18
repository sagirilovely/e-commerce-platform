<template>
  <div>
    <button @click="()=>{
      router.push({name:'goods'})
    }">商品列表</button>
    <button @click="()=>{
      console.log('gwc')
      router.push({name:'trolley'})
    }">购物车</button>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import router from '@/router'
</script>
<style scoped>

</style>

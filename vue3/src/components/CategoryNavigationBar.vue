<template>
  <div class="category-navigation-bar">
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="setDetailGoods"/>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
// import { MenuProps } from 'ant-design-vue';
import useGoods from '@/stores/useGoods.ts'
const current = ref<string[]>(['mail']);
interface MenuProps{
  key?: string | number;
  label?: string | number
  title?: string;
}
const items = ref<MenuProps[]>([]);
const itemsList=['推荐','其他','奶粉尿裤','家装建材','手机相机','童装玩具','海外购','大家电','食品酒水','珠宝首饰','电脑办公','居家生活'];
for(const item of itemsList) {
  items.value.push({
    key: item,
    label: item,
    title: item,
  })
}
function setDetailGoods(menuItem: MenuProps){
  useGoods().category=<string>menuItem.key;
  useGoods().isSearch=false;
}
</script>
<style scoped>
.category-navigation-bar{
  position: sticky;
  z-index: 999;
  top: 0;
}
</style>



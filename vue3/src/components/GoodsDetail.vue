<template>
<!--  :class="['goods-detail', isNavigationBarCollapsed?'goods-detail-shrink':'goods-detail-expand']"-->
<div
    :class="['goods-detail', isNavigationBarCollapsed?'goods-detail-shrink':'goods-detail-expand']"
@click="setGoods">
  <a-card hoverable style="width: 220px">
    <template #cover>
      <img :src="img_small_logo" :alt="title"  />
    </template>
    <a-card-meta :title="title">
      <template #description>￥{{current_price}}元</template>
    </a-card-meta>
  </a-card>
<!--   <img :src="img_small_logo" :alt="title" class="goods-img">-->
<!--  <div :style="{color:token.colorTextBase,fontSize:'14px'}">{{title}}</div>-->
<!--  <div class="goods-price">{{current_price}}</div>-->
</div>
</template>
<script setup lang="ts">
import { theme } from 'ant-design-vue';
const { useToken } = theme;
const { token } = useToken();
import useTheme from '@/stores/useTheme.ts'
import { computed } from 'vue'
import useGoods from '@/stores/useGoods.ts'
const props=defineProps(['goods_id','title','current_price','img_small_logo'])
const isNavigationBarCollapsed=computed(()=>useTheme().isNavigationBarCollapsed)
function setGoods(){
  useGoods().selectedGoodsId=props.goods_id;
}
</script>
<style scoped>

.goods-detail{
    float: left;
  width: 100%;
}
.goods-detail-shrink{
  transition: width 0.5s ease-in-out;
  width: 220px;
}
.goods-detail-expand{
  transition: width 0.5s ease-in-out;
  width: 260px;
}
.goods-price{
  color: red;
  margin-left: 20px;
}
.goods-img{
  height: 90%;
}
</style>

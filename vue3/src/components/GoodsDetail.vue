<template>
<div :class="['goods-detail', isNavigationBarCollapsed?'goods-detail-shrink':'goods-detail-expand']"
@click="setGoods">
   <img :src="img_small_logo" :alt="title" class="goods-img">
  <div :style="{color:token.colorTextBase,fontSize:'14px'}">{{title}}</div>
  <div class="goods-price">{{current_price}}</div>
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
  height: 300px;
  position: relative;
  float: left;
  box-shadow: 1px 1px 20px rgba(100,100,100,0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  margin: 0 5px 10px 0 ;
  cursor: pointer;
  transition: box-shadow 0.5s ease-in-out;
  overflow: hidden;
}
.goods-detail:hover{
  box-shadow: 1px 1px 50px rgba(100,100,100,0.5);
}
.goods-detail-shrink{
  transition: width 0.5s ease-in-out;
  width: 210px;
}
.goods-detail-expand{
  transition: width 0.5s ease-in-out;
  width: 265px;
}
.goods-price{
  color: red;
  margin-left: 20px;
}
.goods-img{
  height: 90%;
}
</style>

<template>
  <div class="merchandise-info" :style="{ 'background-color': token.colorBgBase }"
  v-if="selectedGoodsId">
    <img :src="merchandiseInfo.img_big_logo" :alt="merchandiseInfo.title">
    <div :style="{fontSize:'25px',color:token.colorTextBase}">{{merchandiseInfo.title}}</div>
    <div style="display: flex;align-items: center;justify-content: right;margin-right: 10px">
      <span style="font-size: 25px;color: red">{{merchandiseInfo.current_price}}</span>
      <span style="font-size: 12px"><del>{{merchandiseInfo.price}}</del></span>
    </div>
    <div style="display: flex;align-items: center;justify-content:space-evenly;margin-right: 40%">
      <span style="font-size: small">分类: {{merchandiseInfo.category}}</span>
      <span style="font-size: small">库存: {{merchandiseInfo.goods_number}}</span>
      <span style="font-size: small">商家: {{merchandiseInfo.merchant_nikename}}</span>
    </div>
    <div style="display: flex;align-items: center;justify-content: right;margin-right: 10px">
      评论数量:{{merchandiseInfo.comment_count}}
    </div>
    <div v-html="merchandiseInfo.goods_introduce"></div>
    <div class="buyButton">
      <a-button type="default">加入购物车</a-button>&nbsp;&nbsp;
      <a-button type="primary">立即购买</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { theme } from 'ant-design-vue';
const { useToken } = theme;
const { token } = useToken();
import useGoods from '@/stores/useGoods.ts'
import { computed, reactive, watch } from 'vue'
import eFetch from '@/util/eFetch.ts'
const selectedGoodsId=computed(()=>useGoods().selectedGoodsId)
interface goodsInfo{
  goods_id:string,
  title:string,
  img_big_logo:string,
  price:string,
  current_price:string,
  goods_number:string,
  goods_introduce:string,
  category:string,
  merchant_nikename:string,
  comment_count:string
}
const merchandiseInfo=reactive(<goodsInfo>{})

watch(selectedGoodsId,(newValue)=>{
  eFetch(`/merchandise/detail?goods_id=${newValue}`,'GET')
    .then((res)=>{
      if(res.status===200){
        Object.assign(merchandiseInfo,res.data)
      }
    })
})
</script>
<style scoped>
.merchandise-info{
  max-width: 33%;
  flex: 1 1 auto;
  margin: 0 10px 10px 0;
  border-radius: 20px;
  overflow: auto;
  display: flex;
  height: 570px;
  flex-direction: column;
}
.merchandise-info>img{
  height: 60%;
  flex: 1 0 auto;
}
.buyButton::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(108, 61, 98, 0.6); /* 替换为你的图片 */
  filter: blur(2px); /* 模糊背景 */
  z-index: -1;
}
.buyButton{
  height: 100%;
  min-height: 7%;
  box-shadow: 1px -20px 70px 3px rgba(108, 61, 98, 0.6);
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: right;
  align-items: center;
  padding-right: 5%;
}
</style>

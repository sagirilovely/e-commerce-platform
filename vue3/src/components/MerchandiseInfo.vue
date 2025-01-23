<template>
  <a-card
    class="merchandise-info"
    :style="{ 'background-color': token.colorBgBase }"
    v-if="selectedGoodsId"
    bordered
    hoverable
    ref="merchandise-info"
  >
    <!-- 新增关闭按钮 -->
    <div class="close-btn" @click="handleClose">
      <CloseOutlined :style="{ fontSize: '16px', color: token.colorTextSecondary }" />
    </div>
    <div class="scrollable-content">
      <a-row gutter="16">
        <!-- 商品图片 -->
        <a-col :span="24" style="text-align: center; margin-bottom: 20px">
          <img
            :src="merchandiseInfo.img_big_logo"
            :alt="merchandiseInfo.title"
            style="max-height: 300px; max-width: 100%; border-radius: 10px"
          />
        </a-col>

        <!-- 商品标题和价格 -->
        <a-col :span="24">
          <div :style="{'color':token.colorPrimary,fontSize: '20px', marginBottom: '10px',
          fontWeight: 'bold',textAlign: 'center'}" >
            {{ merchandiseInfo.title }}
          </div>
        </a-col>

        <a-col :span="24">
          <div
            style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px"
          >
            <span style="font-size: 25px; color: red; font-weight: bold; margin-right: 8px">
              ¥{{ merchandiseInfo.current_price }}
            </span>
            <span style="font-size: 12px; color: gray">
              <del>¥{{ merchandiseInfo.price }}</del>
            </span>
          </div>
        </a-col>

        <!-- 商品分类、库存、商家 -->
        <a-col :span="24">
          <a-descriptions column="1" size="small" bordered>
            <a-descriptions-item label="分类">{{ merchandiseInfo.category }}</a-descriptions-item>
            <a-descriptions-item label="库存">{{
              merchandiseInfo.goods_number
            }}</a-descriptions-item>
            <a-descriptions-item label="商家">{{
              merchandiseInfo.merchant_nikename
            }}</a-descriptions-item>
          </a-descriptions>
        </a-col>

        <!-- 评论数量 -->
        <a-col :span="24" style="text-align: center; margin-top: 10px">
          <a-tag color="blue">评论数量: {{ merchandiseInfo.comment_count }}</a-tag>
        </a-col>

        <!-- 商品介绍 -->
        <a-col :span="24" style="margin-top: 20px">
          <div v-html="merchandiseInfo.goods_introduce" class="goods-detail-info"></div>
        </a-col>
      </a-row>
    </div>

    <!-- 操作按钮 -->
    <div class="floating-buttons">
      <a-button type="default" style="margin-right: 10px">加入购物车</a-button>
      <a-button type="primary">立即购买</a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { message, theme } from 'ant-design-vue'
const { useToken } = theme
const { token } = useToken()

import useGoods from '@/stores/useGoods.ts'
import { computed, reactive, useTemplateRef, watch } from 'vue'
import eFetch from '@/util/eFetch.ts'
import router from '@/router'

import { CloseOutlined } from '@ant-design/icons-vue'


const selectedGoodsId = computed(() => useGoods().selectedGoodsId)

interface goodsInfo {
  goods_id: string
  title: string
  img_big_logo: string
  price: string
  current_price: string
  goods_number: string
  goods_introduce: string
  category: string
  merchant_nikename: string
  comment_count: string
}
const handleClose = () => {
  useGoods().selectedGoodsId = '';
}
const merchandiseInfo = reactive(<goodsInfo>{})
//获取此模板的dom结点,使用vue-ref的方式
const merchandiseInfoDom = useTemplateRef('merchandise-info')

watch(selectedGoodsId, (newValue) => {
  if(newValue===''){return};
  eFetch(`/merchandise/detail?goods_id=${newValue}`, 'GET').then((res) => {
    if (res.status === 200) {
      Object.assign(merchandiseInfo, res.data);
      (merchandiseInfoDom.value as HTMLElement)?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (res.status) {
      message.warn('请先登录')
      router.replace({ name: 'loginByPassword' })
    }
  })
})
</script>

<style scoped>
.close-btn {
  position: sticky;
  top: 10px;
  left: 10px;
  cursor: pointer;
  z-index: 1;
  margin-left: 99%;
  text-align: center;
  width: 20px;
  height: 20px;
  transition: all 0.3s;
}
.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 50%;
}
.merchandise-info {
  max-width: 480px;
  height: 570px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  scrollbar-width: thin;
}

.floating-buttons {
  position: sticky;
  bottom: 0;
  padding: 10px;
  text-align: center;
}
.goods-detail-info {
  overflow-y: scroll;
}

</style>

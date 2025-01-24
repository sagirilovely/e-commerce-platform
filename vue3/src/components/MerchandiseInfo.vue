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
      <a-row :gutter="16">
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
          <div
            :style="{
              color: token.colorPrimary,
              fontSize: '20px',
              marginBottom: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
            }"
          >
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
          <a-descriptions :column="1" size="small" bordered>
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
          <a-tag color="blue" @click="showComments"
            >评论数量: {{ merchandiseInfo.comment_count }}</a-tag
          >
        </a-col>

        <!-- 商品介绍 -->
        <a-col :span="24" style="margin-top: 20px">
          <div v-html="merchandiseInfo.goods_introduce" class="goods-detail-info"></div>
        </a-col>
      </a-row>
    </div>

    <!-- 操作按钮 -->
    <div class="floating-buttons">
      <a-input-number :min="1" :max="99" v-model:value="goodsCount"></a-input-number>
      <a-button type="default" style="margin-right: 10px" @click="addTrolley">加入购物车</a-button>
      <a-button type="primary" @click="handlePurchase(selectedGoodsId, goodsCount)"
        >立即购买</a-button
      >
    </div>
  </a-card>
  <!-- 评论弹窗 -->
  <a-modal
    v-model:visible="commentsVisible"
    title="商品评论"
    @cancel="commentsVisible = false"
    width="600px"
  >
    <!-- 展示评论 -->
    <a-list
      v-if="comments.length > 0"
      itemLayout="horizontal"
      :dataSource="comments"
      size="small"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :hoverable="true" style="width: 100%">
            <a-row :gutter="[16, 16]">
              <a-col :span="24">
                <div style="margin-bottom: 8px">
                  <span style="color: #313743; font-weight: bold">{{ item.purchaser_nikename }}</span>:
                  <span style="color: rgba(0, 0, 0, 0.5); font-size: 12px"
                  >{{ item.chooseTime }}</span
                  >
                </div>
                <div style="margin-bottom: 8px">
                  <a-rate :value="parseInt(item.goods_grade)" disabled />
                </div>
                <div>{{ item.purchaser_comment }}</div>
              </a-col>
              <a-col :span="24">
                <div style="margin-top: 8px; color: #475569; font-size: 12px">
                  商家回复：{{ item.merchant_reply }}
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <a-empty v-else style="margin-top: 20px" description="该商品暂时没有评论哦" />
  </a-modal>
</template>

<script setup lang="ts">
import { message, theme } from 'ant-design-vue'
const { useToken } = theme
const { token } = useToken()

import useGoods from '@/stores/useGoods.ts'
import { computed, reactive, ref, watch } from 'vue'
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
interface commentsInfo {
  comment_id: string | number
  purchaser_nikename: string
  merchant_nikename: string
  purchaser_comment: string
  merchant_reply: string
  goods_grade: string | number
}
const handleClose = () => {
  useGoods().selectedGoodsId = ''
}
const merchandiseInfo = reactive(<goodsInfo>{})

const goodsCount = ref(1) //购买数量
const commentsVisible = ref(false) // 控制评论弹窗显示
const comments = ref<commentsInfo[]>([]) // 存储评论数据

watch(selectedGoodsId, (newValue) => {
  if (newValue === '') {
    return
  }
  //置空数量
  goodsCount.value = 1
  eFetch(`/merchandise/detail?goods_id=${newValue}`, 'GET').then((res) => {
    if (res.status === 200) {
      Object.assign(merchandiseInfo, res.data)
    } else if (res.status) {
      message.warn('请先登录')
      router.replace({ name: 'loginByPassword' })
    }
  })
})
// 获取评论数据
const fetchComments = () => {
  eFetch(`/comments/detail?goods_id=${selectedGoodsId.value}`, 'GET')
    .then((res) => {
      if (res.status === 200) {
        comments.value = <commentsInfo[]>res.data
      } else {
        message.error('该商品还没有评论喵')
      }
    })
    .catch(() => {
      message.error('获取评论失败')
    })
}

// 显示评论弹窗
const showComments = () => {
  fetchComments()
  commentsVisible.value = true
}
//加入购物车
function addTrolley() {
  eFetch('/user/trolley', 'PATCH', {
    goods_obj: {
      [selectedGoodsId.value]: goodsCount.value,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('才不是伺服君的错')
    })
}

const handlePurchase = (selectedGoodsId: string, goodsCount: number) => {
  if (goodsCount === 0) {
    message.error('商品数量不能为0')
    return
  }
  //生成订单
  eFetch('/order', 'POST', {
    goods_id: selectedGoodsId,
    goods_count: goodsCount,
  })
    .then((res) => {
      if (res.status === 403) {
        message.error(`缺少收货信息,请到个人信息页补充完整`)
      } else if (res.status === 200) {
        message.success(res.message)
        //跳转到订单页面
        router.push({ name: 'order' })
      } else {
        message.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.goods-detail-info {
  overflow-y: scroll;
}
</style>

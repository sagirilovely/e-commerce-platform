<template>
  <div>
    <a-row :gutter="24" class="container">
      <!-- 订单列表 -->
      <a-col :span="12">
        <a-card title="我的订单" class="order-card">
          <a-list item-layout="horizontal" :data-source="orderList">
            <template #renderItem="{ item }">
              <a-list-item
                @click="handleSelectOrder(item.order_id)"
                :class="['order-item', { active: selectedOrderId === item.order_id }]"
              >
                <a-list-item-meta :description="`订单号: ${item.order_id}`">
                  <template #title>
                    {{ item.title }}
                    <span class="price">¥{{ item.current_price }}</span>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.img_big_logo" />
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <span>{{ formatTime(item.created_time) }}</span>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- 订单详情 -->
      <a-col :span="12">
        <a-card v-if="orderDetail" title="订单详情" class="detail-card">
          <a-descriptions bordered :column="1">
            <!-- 新增商品图片展示 -->
            <a-descriptions-item label="商品图片">
              <a-image
                :width="120"
                :src="orderDetail.img_small_logo"
                :preview="{ src: orderDetail.img_small_logo }"
              />
            </a-descriptions-item>

            <a-descriptions-item label="商品名称">{{ orderDetail.title }}</a-descriptions-item>
            <a-descriptions-item label="商品数量">{{
              orderDetail.goods_count
            }}</a-descriptions-item>
            <a-descriptions-item label="订单金额"
              >¥{{ orderDetail.current_price }}</a-descriptions-item
            >

            <!-- 优化后的地址展示 -->
            <a-descriptions-item label="收货地址">
              <div class="address-info" v-if="addressObject">
                <div>收件人：{{ addressObject.recipient }}</div>
                <div>电话：{{ addressObject.phone_number }}</div>
                <div>
                  {{ addressObject.country }} {{ addressObject.province }}省
                  {{ addressObject.city }}市 {{ addressObject.detail }}
                </div>
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="物流信息">{{
              orderDetail.logistics_information || '暂无物流信息'
            }}</a-descriptions-item>
            <a-descriptions-item label="订单时间">{{
              formatTime(orderDetail.created_time)
            }}</a-descriptions-item>
          </a-descriptions>

          <div class="action-buttons">
            <a-button
              type="primary"
              :disabled="orderDetail.is_paid"
              @click="handlePayment"
              :danger="!orderDetail.is_paid"
            >
              {{ orderDetail.is_paid ? '已付款' : '立即付款' }}
            </a-button>

            <a-button
              type="dashed"
              :disabled="orderDetail.is_take_delivery || !orderDetail.is_paid"
              @click="handleConfirmDelivery"
            >
              {{ orderDetail.is_take_delivery ? '已收货' : '确认收货' }}
            </a-button>

            <a-button
              type="primary"
              danger
              :disabled="orderDetail.is_refund || !orderDetail.is_paid"
              @click="showRefundModal"
            >
              {{
                orderDetail.is_refund
                  ? orderDetail.is_refund_allowed
                    ? '退款成功'
                    : '已申请退款'
                  : '申请退款'
              }}
            </a-button>

            <!-- 新增评论按钮 -->
            <a-button
              type="primary"
              v-if="orderDetail.is_take_delivery"
              @click="showCommentModal"
              :disabled="!orderDetail.is_take_delivery"
            >
              添加评论
            </a-button>

            <a-button
              @click="handleCancelOrder"
              style="margin-left: auto"
              :disabled="!(orderDetail.is_refund_allowed || orderDetail.is_take_delivery)"
            >
              删除订单
            </a-button>
            <a-button
              @click="handleCancelOrder"
              style="margin-left: auto"
              :disabled="orderDetail?.is_paid"
            >
              取消订单
            </a-button>
          </div>
        </a-card>

        <a-empty v-else description="请选择左侧订单查看详情" />
      </a-col>
    </a-row>

    <!-- 退款弹窗 -->
    <a-modal v-model:visible="refundModalVisible" title="申请退款" @ok="handleRefund">
      <a-form layout="vertical">
        <a-form-item label="退款理由">
          <a-textarea v-model:value="refundReason" placeholder="请输入退款理由" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 评论弹窗 -->
    <a-modal
      v-model:visible="commentModalVisible"
      title="添加评论"
      @ok="handleComment"
      @cancel="cancelComment"
    >
      <a-form layout="vertical">
        <a-form-item label="评论内容">
          <a-textarea v-model:value="commentText" placeholder="请输入评论内容" :rows="4" />
        </a-form-item>
        <a-form-item label="评分">
          <a-rate v-model:value="commentGrade" :count="5"  />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onActivated } from 'vue'
import { message } from 'ant-design-vue'
import eFetch from '@/util/eFetch'

interface OrderSummary {
  order_id: string
  title: string
  img_big_logo: string
  current_price: string
  goods_count: string
  created_time: string
  is_take_delivery: boolean
  is_refund: boolean
  is_paid: boolean
  goods_id: string | number
}

interface OrderDetail {
  receiver_address: string
  logistics_information: string
  is_refund_allowed: boolean
  order_id: string
  title: string
  img_small_logo: string
  current_price: string
  goods_count: string
  created_time: string
  is_take_delivery: boolean
  is_refund: boolean
  is_paid: boolean
  goods_id: string | number
}

const orderList = ref<OrderSummary[]>([])
const orderDetail = ref<OrderDetail | null>(null)
const selectedOrderId = ref<string>('')
const refundModalVisible = ref(false)
const refundReason = ref('')
// 评论相关的变量
const commentModalVisible = ref(false)
const commentText = ref('')
const commentGrade = ref(0)
// 地址对象计算属性
const addressObject = computed(() => {
  try {
    return typeof orderDetail.value?.receiver_address === 'string'
      ? JSON.parse(orderDetail.value.receiver_address)
      : orderDetail.value?.receiver_address
  } catch {
    return null
  }
})
// 获取订单列表
const fetchOrderList = async () => {
  try {
    const res = (await eFetch('/order/summary', 'GET')) as { data: OrderSummary[] }
    orderList.value = res.data
  } catch (error) {
    console.log(error)
    message.error('获取订单列表失败')
  }
}

// 获取订单详情
const fetchOrderDetail = async (orderId: string) => {
  try {
    const res = (await eFetch(`/order/detail?order_id=${orderId}`, 'GET')) as { data: OrderDetail }
    orderDetail.value = res.data
  } catch (error) {
    console.log(error)
    message.error('获取订单详情失败')
  }
}

// 选择订单
const handleSelectOrder = (orderId: string) => {
  selectedOrderId.value = orderId
  fetchOrderDetail(orderId)
}

// 确认付款
const handlePayment = async () => {
  try {
    await eFetch('/order/paid', 'PATCH', {
      order_id: selectedOrderId.value,
      is_paid: true,
    })
    message.success('付款成功')
    fetchOrderDetail(selectedOrderId.value)
    fetchOrderList()
  } catch (error) {
    console.log(error)
    message.error('付款失败')
  }
}

// 确认收货
const handleConfirmDelivery = async () => {
  try {
    await eFetch('/order/delivery', 'PATCH', {
      order_id: selectedOrderId.value,
      is_take_delivery: true,
    })
    message.success('确认收货成功')
    fetchOrderDetail(selectedOrderId.value)
    fetchOrderList()
  } catch (err) {
    console.log(err)
    message.error('确认收货失败')
  }
}

// 申请退款
const showRefundModal = () => {
  refundModalVisible.value = true
}

const handleRefund = async () => {
  try {
    await eFetch('/order/refund', 'PATCH', {
      order_id: selectedOrderId.value,
      is_refund: true,
      refund_reason: refundReason.value,
    })
    message.success('退款申请已提交')
    refundModalVisible.value = false
    fetchOrderDetail(selectedOrderId.value)
    fetchOrderList()
  } catch (error) {
    console.log(error)
    message.error('申请退款失败')
  }
}
// 添加评论
const showCommentModal = () => {
  commentModalVisible.value = true
}

const handleComment = async () => {
  if (!commentText.value.trim()) {
    message.warning('请填写评论内容')
    return
  }

  try {
    const isSuccess = await eFetch('/comments', 'POST', {
      goods_id: String(orderDetail.value?.goods_id),
      purchaser_comment: commentText.value,
      goods_grade: commentGrade.value,
    })
    if (isSuccess.status === 200) {
      message.success('添加评论成功')
    } else {
      message.error('失败,你可能已经评价过该商品了喵')
    }
    commentModalVisible.value = false
    commentText.value = ''
    commentGrade.value = 0
    fetchOrderDetail(selectedOrderId.value)
    fetchOrderList()
  } catch (error) {
    console.log(error)
    message.error('添加评论失败')
  }
}

const cancelComment = () => {
  commentText.value = ''
  commentGrade.value = 0
}
// 取消订单
const handleCancelOrder = async () => {
  if (!selectedOrderId.value) {
    message.warning('请选择一个订单进行取消')
    return
  }
  try {
    const res = await eFetch('/order', 'DELETE', { order_id: selectedOrderId.value })

    if (res.status === 200) {
      message.success('订单取消成功')
      // 清除当前选中的订单
      selectedOrderId.value = ''
      // 刷新订单列表和详情
      fetchOrderList()
      orderDetail.value = null
    } else if (res.status === 403) {
      message.error('订单取消失败')
    } else if (res.status === 500) {
      message.error('服务器出错')
    }
  } catch (error) {
    console.log(error)
    message.error('取消订单失败')
  }
}

// 格式化时间
const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

onMounted(() => {
  fetchOrderList()
})
onActivated(() => {
  fetchOrderList()
})
</script>

<style scoped>
.container {
  padding: 24px;
  overflow: hidden;
}

.order-card,
.detail-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 650px;
  overflow-y: scroll;
}

.order-item {
  cursor: pointer;
  transition: all 0.3s;
  padding: 12px;
}

.order-item:hover {
  background-color: #fafafa;
}

.order-item.active {
  background-color: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
  margin-left: 12px;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.address-info {
  line-height: 1.8;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
  width: 120px;
}
</style>

<template>
  <div>
    <TopBanner />
    <a-row class="container" :gutter="24">
      <a-col :span="24">
        <a-card
          class="cart-card"
          :style="{ backgroundColor: token.colorBgBase }"
          :title="null"
          :bordered="false"
        >
          <template #extra>
            <a-space>
              <a-button
                type="primary"
                danger
                @click="handleBatchDelete"
                :disabled="!hasSelectedItems"
              >
                批量删除
              </a-button>
              <a-typography-title :level="4" class="card-title">我的购物车</a-typography-title>
            </a-space>
          </template>

          <a-spin :spinning="loading">
            <!-- 空购物车提示 -->
            <a-empty v-if="emptyCart" description="您的购物车空空如也喵～" />

            <!-- 商品列表 -->
            <div v-else class="cart-list">
              <div v-for="item in cartItems" :key="item.goods_id" class="cart-item">
                <a-row align="middle" :gutter="16">
                  <!-- 选择框 -->
                  <a-col :span="1">
                    <a-checkbox v-model:checked="item.selected" />
                  </a-col>

                  <!-- 商品图片 -->
                  <a-col :span="4">
                    <a-image
                      :src="item.img_small_logo"
                      :preview="false"
                      width="100px"
                    />
                  </a-col>

                  <!-- 商品信息 -->
                  <a-col :span="12">
                    <a-typography-title :level="5">{{ item.title }}</a-typography-title>
                  </a-col>

                  <!-- 价格及操作 -->
                  <a-col :span="7">
                    <div class="price-section">
                      <a-typography-title :level="5" type="danger">
                        ¥{{ item.current_price }}
                      </a-typography-title>
                      <a-space>
                        <a-input-number
                          v-model:value="item.goods_count"
                          :min="1"
                          :max="99"
                          class="quantity-input"
                          @change="(value: number | null) => handleQuantityChange(item, value)"
                        />
                        <a-button type="primary" @click="handlePurchase(item)">
                          购买
                        </a-button>
                      </a-space>
                    </div>
                  </a-col>
                </a-row>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                  <a-button type="link" danger @click="handleDelete(item.goods_id)">
                    删除
                  </a-button>
                </div>
              </div>
            </div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue'
import { message, theme } from 'ant-design-vue'
import TopBanner from '@/components/TopBanner.vue'
import eFetch from '@/util/eFetch.ts'

const { useToken } = theme
const { token } = useToken()

// 商品项类型定义
interface CartItem {
  goods_id: string
  title: string
  goods_count: number
  img_small_logo: string
  current_price: number
  selected?: boolean
}

// 响应式数据
const cartItems = ref<CartItem[]>([])
const loading = ref(false)
const emptyCart = ref(false)

// 计算属性
const hasSelectedItems = computed(() =>
  cartItems.value.some(item => item.selected)
)

// 获取购物车数据
const getCartData = async () => {
  try {
    loading.value = true
    const res = await eFetch('/user/trolley', 'GET')

    if (res.status === 200) {
      cartItems.value = (res.data as CartItem[]).map(item => ({
        ...item,
        selected: false
      }))
      emptyCart.value = false
    } else if (res.status === 403) {
      emptyCart.value = true;
      message.error(res.message)
    } else {
      message.error(res.message)
    }
  } catch (err) {
    console.error(err)
    message.error('获取购物车数据失败')
  } finally {
    loading.value = false
  }
}

// 单个删除功能
const handleDelete = (goodsId: string) => {
  eFetch('/user/trolley', 'PATCH', {
    goods_obj: { [goodsId]: "0" }
  }).then(res => {
    if (res.status === 200) {
      message.success('删除成功')
      cartItems.value = cartItems.value.filter(item => item.goods_id !== goodsId)
      emptyCart.value = cartItems.value.length === 0
    } else {
      message.error(res.message)
    }
  }).catch(err => {
    console.error(err)
    message.error('删除失败')
  })
}

// 批量删除功能
const handleBatchDelete = () => {
  const deleteObj = cartItems.value
    .filter(item => item.selected)
    .reduce((obj, item) => {
      obj[item.goods_id] = "0"
      return obj
    }, {} as Record<string, string>)

  eFetch('/user/trolley', 'PATCH', {
    goods_obj: deleteObj
  }).then(res => {
    if (res.status === 200) {
      message.success('批量删除成功')
      cartItems.value = cartItems.value.filter(item => !item.selected)
      emptyCart.value = cartItems.value.length === 0
    } else {
      message.error(res.message)
    }
  }).catch(err => {
    console.error(err)
    message.error('批量删除失败')
  })
}
const handleQuantityChange = async (item: CartItem, newValue: number | null) => {
  // 验证输入值
  if (newValue === null || newValue < 1 || newValue > 99) {
    message.error('商品数量需在1-99之间')
    item.goods_count = Math.max(1, Math.min(newValue || 1, 99)) // 自动修正为合法值
    return
  }
  const oldValue = item.goods_count
  try {
    // 立即更新本地显示（提升用户体验）
    item.goods_count = newValue

    // 发送更新请求
    const res = await eFetch('/user/trolley', 'PATCH', {
      goods_obj: { [item.goods_id]: newValue.toString() }
    })

    if (res.status !== 200) {
      // 回滚本地修改
      item.goods_count = oldValue
      message.error(res.message || '数量更新失败')
    }
  } catch (err) {
    // 回滚本地修改
    item.goods_count = oldValue
    console.error(err)
    message.error('网络错误，请稍后重试')
  }
}
// 购买按钮（占位函数）
const handlePurchase = (item: CartItem) => {
  const selectedGoodsId=item.goods_id;
  const goodsCount=item.goods_count;
  if(goodsCount===0){
    message.error('商品数量不能为0');
    return;
  }
  // TODO: 待补充购买逻辑

}

// 初始化获取数据
onMounted(() => {
  getCartData()
})
onActivated(()=>{
  getCartData();
})
</script>

<style scoped>
.container {
  width: 100%;
  margin: 20px auto;
  padding: 0 24px;
}

.cart-card {
  border-radius: 12px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
  0 6px 16px 0 rgba(0, 0, 0, 0.08),
  0 9px 28px 8px rgba(0, 0, 0, 0.05);
  min-height: 400px;
  height: 550px;
  overflow-y: scroll;
}

.cart-item {
  padding: 16px 0;
  border-bottom: 1px solid v-bind('token.colorBorderSecondary');
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-input {
  width: 100px;
}

.checkout-bar {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid v-bind('token.colorPrimary');
  text-align: right;
}

.action-buttons {
  margin-top: 8px;
  text-align: right;
}

.card-title {
  color: v-bind('token.colorPrimary');
  margin-bottom: 0 !important;
}
/* 新增样式 */
.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.quantity-input {
  width: 100px;
}

/* 调整操作按钮位置 */
.action-buttons {
  margin-top: 8px;
  text-align: right;
}

/* 复选框对齐 */
.ant-col-1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

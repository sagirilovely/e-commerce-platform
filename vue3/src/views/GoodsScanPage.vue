<template>
  <div>
    <TopBanner>
    </TopBanner>
    <div class="container">
      <div
        :style="{
          'background-color': token.colorBgBase,
          padding: isNavigationBarCollapsed ? '0 0 0 30px' : '0 0 0 40px',
          width:useGoods().selectedGoodsId? '65%' : '100%',
        }"
        class="goods-list"
        @scroll="goodsListScroll($event)"
      >
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索您想要的商品"
          enter-button
          @search="onSearch"
        />
        <CategoryNavigationBar></CategoryNavigationBar>
        <GoodsDetail
          v-for="item in goodsList"
          :key="item.goods_id"
          :current_price="item.current_price"
          :goods_id="item.goods_id"
          :img_small_logo="item.img_small_logo"
          :title="item.title"
        >
        </GoodsDetail>
      </div>
          <MerchandiseInfo></MerchandiseInfo>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TopBanner from '@/components/TopBanner.vue'
import { theme } from 'ant-design-vue'
import GoodsDetail from '@/components/GoodsDetail.vue'
import useTheme from '@/stores/useTheme.ts'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import eFetch from '@/util/eFetch.ts'
import CategoryNavigationBar from '@/components/CategoryNavigationBar.vue'
import useGoods from '@/stores/useGoods.ts'
import MerchandiseInfo from '@/components/MerchandiseInfo.vue'

const isNavigationBarCollapsed = computed(() => useTheme().isNavigationBarCollapsed)
const { useToken } = theme
const { token } = useToken()
const offset = ref(0)
const isRecommend = ref(true)
const category = computed(()=>useGoods().category)
const keyword=ref('');
watch(category,(newVal)=>{
  isRecommend.value = (newVal === '推荐');
  //清空列表
  goodsList.splice(0, goodsList.length)
  getGoodsList();
})

interface GoodsItem {
  goods_id: string
  title: string
  img_small_logo: string
  current_price: string
}

const goodsList = reactive<GoodsItem[]>([])
const goodsListScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (Math.ceil(target.scrollTop) + Math.ceil(target.clientHeight) >= target.scrollHeight) {
   const timer= setTimeout(()=>{
      offset.value += 10
      clearTimeout(timer)
    },100)
  }
}
onMounted(() => {
  getGoodsList()
})
watch(offset, () => {
  if(useGoods().isSearch){
    getGoodsList(true)
  }else{
    getGoodsList()
  }
})
watch(category, () => {
  getGoodsList()
})

function getGoodsList(isSearch:boolean=false) {
  let getUrl:string=``;
  if(isSearch){
    getUrl=`/goods/search?offset=${offset.value}&keyword=${keyword.value}`
  }else{
    getUrl=`/goods/list?offset=${offset.value}&recommend=${isRecommend.value}&category=${category.value}`
  }
  eFetch(
    getUrl,
    'GET',
  )
    .then((res) => {
      if (res.status === 200) {
        for (const item of res.data as GoodsItem[]) {
          goodsList.push(item)
        }
      } else if (res.status === 404) {
        offset.value = 0
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function onSearch(){
  goodsList.splice(0, goodsList.length);
  useGoods().isSearch=true;
  getGoodsList(true);
}

defineOptions({
  name: 'GoodsScanPage',
})
</script>
<style scoped>
.container {
  display: flex;
  margin-top: 10px;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  position: relative;
}

.goods-list {
  height: 570px;
  position: relative;
  border-radius: 20px;
  margin: 0 10px 10px 0;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: width 0.5s ease-in-out;
}


</style>

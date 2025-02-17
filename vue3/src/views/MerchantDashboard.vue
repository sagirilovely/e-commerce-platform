<template>
  <a-layout class="merchantDashboard">
    <!-- 侧边导航 -->
    <a-layout-sider
      :width="240"
      style="height: 100vh; position: fixed; left: 0"
    >
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        style="height: calc(100% - 160px)"
      >
        <a-menu-item key="goods">
          <template #icon><ShoppingOutlined /></template>
          商品管理
        </a-menu-item>
        <!-- 新增添加商品导航 -->
        <a-menu-item key="addGoods">
          <template #icon><PlusOutlined /></template>
          添加商品
        </a-menu-item>
        <a-menu-item key="comments">
          <template #icon><CommentOutlined /></template>
          评论管理
        </a-menu-item>
      </a-menu>


      <!-- 商户信息 -->
      <a-card
        :bordered="false"
      >
        <a-card-meta :description="merchantInfo.userEmail">
          <template #title>{{ merchantInfo.nickname }}</template>
          <template #avatar>
            <a-avatar :src="merchantInfo.profile_photo" />
          </template>
        </a-card-meta>
        <div style="margin-top: 10px; color: rgba(0,0,0,.45)">
          注册时间：{{ merchantInfo.created_time }}
        </div>
        <a-button
          danger
          block
          style="margin-top: 16px"
          @click="logout"
        >
          退出登录
        </a-button>
      </a-card>
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout :style="{ marginLeft: '240px', minHeight: '100vh' }">
      <a-layout-content style="padding: 24px">
        <!-- 商品管理模块 -->
        <div v-show="selectedKeys.includes('goods')">
          <div style="margin-bottom: 24px">
            <a-space>
              <a-button type="primary" @click="getGoodsList">
                <template #icon><SyncOutlined /></template>
                刷新列表
              </a-button>
              <a-button-group>
                <a-button
                  v-for="(item,index) in [0,10,20,30,40]"
                  :key="index"
                  @click="updateOffset(item)"
                >
                  {{ item + 1 }}-{{ item + 10 }}
                </a-button>
              </a-button-group>
            </a-space>
          </div>

          <!-- 商品列表 -->
          <a-list item-layout="vertical" :data-source="goodsList">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button danger @click="deleteGoodsInfo(String(item.goods_id))">
                    删除商品
                  </a-button>
                </template>
                <a-card :title="item.title" style="width: 100%">
                  <a-row :gutter="16">
                    <a-col :span="8">
                      <a-image
                        :src="item.img_big_logo"
                        :preview="false"
                        style="max-width: 200px"
                      />
                    </a-col>
                    <a-col :span="16">
                      <a-form layout="vertical">
                        <a-form-item label="商品名称">
                          <a-input v-model:value="item.title" />
                        </a-form-item>
                        <a-row :gutter="16">
                          <a-col :span="8">
                            <a-form-item label="折前价格">
                              <a-input-number
                                v-model:value="item.price"
                                :min="0"
                                style="width: 100%"
                              />
                            </a-form-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-item label="折后价格">
                              <a-input-number
                                v-model:value="item.current_price"
                                :min="0"
                                style="width: 100%"
                              />
                            </a-form-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-item label="库存数量">
                              <a-input-number
                                v-model:value="item.goods_number"
                                :min="0"
                                style="width: 100%"
                              />
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <a-form-item>
                          <a-button
                            type="primary"
                            block
                            @click="updateGoodsInfo(item)"
                          >
                            更新商品信息
                          </a-button>
                        </a-form-item>
                      </a-form>
                    </a-col>
                  </a-row>

                  <a-collapse>
                    <a-collapse-panel key="introduce" header="商品详情">
                      <div v-html="item.goods_introduce" />
                    </a-collapse-panel>
                  </a-collapse>
                </a-card>
              </a-list-item>
            </template>
          </a-list>


        </div>

        <!-- 新增添加商品模块 -->
        <div v-show="selectedKeys.includes('addGoods')">
          <a-card title="添加新商品">
            <a-form layout="vertical">
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="商品名称">
                    <a-input v-model:value="newGoodsInfo.title" />
                  </a-form-item>
                  <a-form-item label="大图地址">
                    <a-input v-model:value="newGoodsInfo.img_big_logo" />
                    <ImgUpload category="img_url" :on-success="getImgBigLogoUrl" />
                  </a-form-item>
                  <a-form-item label="价格">
                    <a-input-number
                      v-model:value="newGoodsInfo.price"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="小图地址">
                    <a-input v-model:value="newGoodsInfo.img_small_logo" />
                    <ImgUpload category="img_url" :on-success="getImgSmallLogoUrl" />
                  </a-form-item>
                  <a-form-item label="折后价">
                    <a-input-number
                      v-model:value="newGoodsInfo.current_price"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-form-item>
                  <a-form-item label="库存">
                    <a-input-number
                      v-model:value="newGoodsInfo.goods_number"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="商品详情">
                <a-textarea
                  v-model:value="newGoodsInfo.goods_introduce"
                  :rows="4"
                />
                <ImgUpload
                  category="html_introduce"
                  :on-success="getGoodsIntroduceText"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" block @click="addGoods">
                  添加商品
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </div>

        <!-- 评论管理模块 -->
        <div v-show="selectedKeys.includes('comments')">
          <a-list
            item-layout="horizontal"
            :data-source="commentsList"
            style="margin-top: 16px"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment>
                  <template #author>
                    {{ item.purchaser_nickname }}
                    <a-rate
                      :value="item.goods_grade"
                      disabled
                      style="margin-left: 8px"
                    />
                  </template>
                  <template #avatar>
                    <a-avatar>{{ item.purchaser_nickname[0] }}</a-avatar>
                  </template>
                  <template #content>
                    <p>{{ item.purchaser_comment }}</p>
                    <div v-if="item.merchant_reply && !item.isShowInput">
                      <a-tag color="blue">商家回复：{{ item.merchant_reply }}</a-tag>
                    </div>
                    <a-input
                      v-if="item.isShowInput"
                      v-model:value="item.merchant_reply"
                      style="margin-top: 8px"
                    >
                      <template #suffix>
                        <a-button
                          type="link"
                          @click="replyComment(item.comment_id, item.merchant_reply)"
                        >
                          发送
                        </a-button>
                      </template>
                    </a-input>
                  </template>
                </a-comment>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import eFetch from '@/util/eFetch.ts'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import ImgUpload from '@/components/ImgUpload.vue'
import netPackage from '@/util/netPackage.ts'
import { ShoppingOutlined, CommentOutlined, SyncOutlined,PlusOutlined } from '@ant-design/icons-vue'
import router from '@/router'
defineOptions({
  name: 'merchantDashboard',
})
const selectedKeys = ref<string[]>(['goods']);
interface GoodsOfMerchant {
  goods_id: string | number
  title: string
  img_big_logo: string
  img_small_logo: string
  current_price: string | number
  price: string | number
  goods_number: string | number
  goods_introduce: string
  category: string;
  isShowIntroduce:boolean;
}
interface NewGoodsInfo {
  [key:string]:string|number
  title:string,
  img_big_logo:string,
  img_small_logo:string,
  current_price:string|number,
  price:string|number,
  goods_number:string|number,
  goods_introduce:string,
  category:string
}
interface Comment{
  comment_id:string|number,
  purchaser_nickname:string,
  merchant_nickname:string,
  purchaser_comment:string,
  merchant_reply:string,
  goods_grade:string|number,
  isShowInput:boolean
}
interface MerchantInfo{
  profile_photo:string;
  nickname:string;
  userEmail:string;
  created_time:string;
}
const newGoodsInfo=reactive<NewGoodsInfo>({
  title:'',
  img_big_logo:'',
  img_small_logo:'',
  current_price:'',
  price:'',
  goods_number:'',
  goods_introduce:'',
  category:''
})
const goodsList = ref<GoodsOfMerchant[]>([])
let GoodsListOffset = 0
onMounted(() => {
  getGoodsList();
  getCommentsList();
  getMerchantInfo();
})

// 获取图片地址
function getImgBigLogoUrl(url:string){
  newGoodsInfo.img_big_logo=url;
}
function getImgSmallLogoUrl(url:string){
  newGoodsInfo.img_small_logo=url;
}
function getGoodsIntroduceText(html:string){
  newGoodsInfo.goods_introduce=html;
}

function getGoodsList() {
  // 获取商品列表
  eFetch(`/merchant/goods?offset=${GoodsListOffset}`, 'GET')
    .then((res) => {
      if (res.status === 200) {
        for(const goods of res.data as GoodsOfMerchant[]){
          goods.isShowIntroduce=false;
        }
        goodsList.value = res.data as GoodsOfMerchant[]
      } else {
        message.error('商品列表'+res.message)
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('获取商品列表失败喵')
    })
}
function updateGoodsInfo(goodsInfo:GoodsOfMerchant){
  eFetch('/merchant/goods', 'PATCH', goodsInfo)
    .then((res)=>{
      if(res.status===200){
        message.success('更新成功')
      }else{
        getGoodsList();
        message.error('更新'+res.message);
      }
    })
}
function deleteGoodsInfo(goods_id:string){
  eFetch(`/merchant/goods?goods_id=${goods_id}`, 'DELETE')
    .then((res)=>{
      if(res.status===200){
        getGoodsList();
        message.success(res.message)
      }else{
        message.error(res.message)
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('删除失败')
    })
}
function updateOffset(offset:number){
  GoodsListOffset=offset;
  getGoodsList();
}
function addGoods(){
  for(const key in newGoodsInfo){
    if(newGoodsInfo[key] as string===''){
      message.error('请填写完整商品信息');
      return;
    }
  }
  eFetch('/merchant/goods', 'POST', newGoodsInfo)
    .then((res)=>{
      if(res.status===200){
        getGoodsList();
        message.success('添加'+res.message)
      }else{
        console.log(res)
        message.error('添加'+res.message)
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('添加失败')
    })
}
const commentsList=reactive([] as Comment[]);
function getCommentsList(){
  eFetch('/comments/merchant','GET')
    .then((res)=>{
      if(res.status===200){
        for(const comment of res.data as Comment[]){
          if(!comment.merchant_reply){
            comment.isShowInput=true;
          }
          commentsList.push(comment);
        }
        message.success(res.message)
      }else{
        message.error(res.message)
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('获取评论失败')
    })
}
function replyComment(comment_id:string|number,reply:string){
  comment_id=String(comment_id);
  eFetch('/comments/merchant','POST',{
    comment_id,
    reply
  })
    .then((res)=>{
      if(res.status){
        for(const comment of commentsList){
          if(String(comment.comment_id)===comment_id){
            comment.isShowInput=false;
          }
        }
        message.success(res.message);
      }else{
        message.error(res.message)
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('回复失败')
    })
}
const merchantInfo=reactive({} as MerchantInfo)
function getMerchantInfo(){
  eFetch('/user/merchant','GET')
    .then((res)=>{
      if(res.status===200){
        Object.assign(merchantInfo,res.data);
        merchantInfo.created_time=new Date(merchantInfo.created_time).toLocaleString();
        merchantInfo.profile_photo=netPackage.assetsUrl+merchantInfo.profile_photo;
        message.success(res.message)
      }else{
        message.error(res.message)
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('获取商户信息失败')
    })
}
function logout(){
  eFetch(`/user/merchant`,'PATCH')
    .then((res)=>{
      if(res.status===200){
        message.success(res.message);
        router.push({
          name:'loginByPassword',
          replace:false
        });
      }else{
        message.error(res.message)
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('退出失败')
    })
}
</script>
<style scoped>
.merchantDashboard {
  min-height: 100vh;
}
.ant-comment-content p {
  margin-bottom: 0;
}
.ant-list-item {
  padding: 16px 0 !important;
}
.ant-form-item {
  margin-bottom: 12px;
}
</style>

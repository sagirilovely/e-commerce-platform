<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边导航 -->
    <a-layout-sider theme="light" collapsible>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="currentMenu"
        mode="inline"
      >
        <a-menu-item key="merchant">
          <template #icon><user-outlined /></template>
          商家管理
        </a-menu-item>
        <a-menu-item key="goods">
          <template #icon><shop-outlined /></template>
          商品管理
        </a-menu-item>
        <a-menu-item key="purchaser">
          <template #icon><team-outlined /></template>
          用户管理
        </a-menu-item>
        <a-menu-item key="admin">
          <template #icon><safety-certificate-outlined /></template>
          管理员管理
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧内容区域 -->
    <a-layout>
      <a-layout-header style="background: rgba(255, 255, 255, 0.3); padding: 0 24px; display: flex; justify-content: flex-end">
        <a-button type="primary" danger @click="logoutAdmin">
          <template #icon><logout-outlined /></template>
          退出登录
        </a-button>
      </a-layout-header>

      <a-layout-content style="margin: 24px 16px; padding: 24px; background: rgba(255, 255, 255, 0.3)">
        <!-- 商家信息模块 -->
        <div v-show="currentMenu[0] === 'merchant'">
          <a-card title="商家管理" :bordered="false">
            <a-space direction="vertical" style="width: 100%">
              <a-button type="primary" @click="getMerchantInfo">
                <template #icon><reload-outlined /></template>
                刷新商家信息
              </a-button>

              <a-row :gutter="16" v-for="item in merchantInfo" :key="item.merchant_id">
                <a-col :span="20">
                  <a-descriptions bordered size="small">
                    <a-descriptions-item label="商家昵称">
                      <span v-if="!item.isEditing">{{ item.nickname }}</span>
                      <a-input v-else v-model:value="item.nickname" style="width: 200px" />
                    </a-descriptions-item>
                    <a-descriptions-item label="头像">
                      <a-avatar :src="item.profile_photo" :size="64" />
                    </a-descriptions-item>
                  </a-descriptions>
                </a-col>
                <a-col :span="4">
                  <a-button @click="editMerchantNickname(item.merchant_id, item.nickname, item.isEditing)">
                    {{ !item.isEditing ? '编辑' : '保存' }}
                  </a-button>
                </a-col>
              </a-row>

              <a-pagination
                v-model:current="currentMerchantPage"
                :pageSize="10"
                :total="50"
                show-less-items
              />
            </a-space>
          </a-card>
        </div>

        <!-- 商品信息模块 -->
        <div v-show="currentMenu[0] === 'goods'">
          <a-card title="商品管理" :bordered="false">
            <a-space direction="vertical" style="width: 100%">
              <a-space>
                <a-button type="primary" @click="getGoodsInfo">
                  <template #icon><reload-outlined /></template>
                  刷新商品
                </a-button>
                <a-input-search
                  v-model:value="goodsSearchTitle"
                  placeholder="搜索商品名称"
                  enter-button
                  @search="getGoodsInfo"
                />
              </a-space>

              <a-list item-layout="horizontal" :data-source="goodsInfo">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :description="`商家: ${item.merchant}  价格: ${item.current_price}`"
                    >
                      <template #title>
                        <a>{{ item.title }}</a>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a-button danger @click="deleteGoods(item.goods_id)">删除</a-button>
                    </template>
                  </a-list-item>
                </template>
              </a-list>

              <a-pagination
                v-model:current="currentGoodsPage"
                :pageSize="10"
                :total="50"
                show-less-items
              />
            </a-space>
          </a-card>
        </div>

        <!-- 用户信息模块 -->
        <div v-show="currentMenu[0] === 'purchaser'">
          <a-card title="用户管理" :bordered="false">
            <a-space direction="vertical" style="width: 100%">
              <a-button type="primary" @click="getPurchaserInfo">
                <template #icon><reload-outlined /></template>
                刷新用户信息
              </a-button>

              <a-row :gutter="16" v-for="item in purchaserInfo" :key="item.purchaser_id">
                <a-col :span="4">
                  <a-avatar :src="item.profile_url" :size="64" />
                </a-col>
                <a-col :span="16">
                  <a-input
                    v-if="item.isEditing"
                    v-model:value="item.nickname"
                    style="width: 200px"
                  />
                  <span v-else>{{ item.nickname }}</span>
                </a-col>
                <a-col :span="4">
                  <a-button @click="updatePurchaserInfo(item.purchaser_id, item.isEditing, item.nickname)">
                    {{ item.isEditing ? '保存' : '编辑' }}
                  </a-button>
                </a-col>
              </a-row>
            </a-space>
          </a-card>
        </div>

        <!-- 管理员信息模块 -->
        <div v-show="currentMenu[0] === 'admin'">
          <a-card title="管理员管理" :bordered="false">
            <a-space direction="vertical" style="width: 100%">
              <a-button type="primary" @click="getAdminInfo">
                <template #icon><reload-outlined /></template>
                刷新管理员
              </a-button>

              <a-list item-layout="horizontal" :data-source="adminInfo">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="item.nickname"
                      :description="`邮箱: ${item.email}`"
                    >
                      <template #avatar>
                        <a-avatar :src="item.profile_url" />
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a-button
                        v-if="!(item.administrator_id == 1)"
                        danger
                        @click="deleteAdmin(item.administrator_id)"
                      >
                        删除
                      </a-button>
                    </template>
                  </a-list-item>
                </template>
              </a-list>

              <a-card title="添加新管理员" style="margin-top: 24px">
                <a-form layout="inline">
                  <a-form-item label="昵称">
                    <a-input v-model:value="newAdminInfo.nickname" />
                  </a-form-item>
                  <a-form-item label="邮箱">
                    <a-input v-model:value="newAdminInfo.admin_email" />
                  </a-form-item>
                  <a-form-item label="密码">
                    <a-input-password v-model:value="newAdminInfo.password" />
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="addAdminInfo">添加</a-button>
                  </a-form-item>
                </a-form>
              </a-card>
            </a-space>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>


<script setup lang="ts">
import eFetch from '@/util/eFetch.ts'

defineOptions({
  name: 'AdminDashboard',
})

import { onMounted, ref,watch } from 'vue'
import { message } from 'ant-design-vue'
import netPackage from '@/util/netPackage.ts'
import router from '@/router'
import useVerify from '@/stores/useVerify.ts'
//----------------------------------------------------------------
import {
  UserOutlined,
  ShopOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// 分页相关响应式变量
const currentMenu = ref(['merchant'])
const currentMerchantPage = ref(1)
const currentGoodsPage = ref(1)

// 修改分页逻辑
watch(currentMerchantPage, (val) => {
  offsetMerchantInfo.value = (val - 1) * 10
  getMerchantInfo()
})

watch(currentGoodsPage, (val) => {
  offsetGoodsInfo.value = (val - 1) * 10
  getGoodsInfo()
})
//-------------------------------------------------------------------
onMounted(() => {
  getMerchantInfo()
  getGoodsInfo();
  getPurchaserInfo();
  getAdminInfo();
})
//----查看 修改  商家信息
interface MerchantInfo {
  [key: string]: string | number | boolean
  nickname: string
  profile_photo: string
  merchant_id: string | number
  isEditing: boolean
}
const offsetMerchantInfo = ref(0)
const merchantInfo = ref([] as MerchantInfo[])
//获取商家信息
function getMerchantInfo() {
  eFetch(`/admin/merchant?offset=${offsetMerchantInfo.value}`, 'GET')
    .then((res) => {
      if (res.status === 200) {
        merchantInfo.value.splice(0, merchantInfo.value.length)
        for (const item of res.data as MerchantInfo[]) {
          item.profile_photo = netPackage.assetsUrl + item.profile_photo
          item.isEditing = false
          merchantInfo.value.push(item)
        }
        message.success(res.message)
      } else {
        offsetMerchantInfo.value -= 10
        message.error(res.message + '喵')
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('获取商家信息失败喵')
    })
}
//修改商家昵称按钮
function editMerchantNickname(merchant_id: string | number, nickname: string, isEditing: boolean) {
  merchant_id = String(merchant_id)
  if (isEditing) {
    //目前处于编辑状态,点击此按钮后应该保存修改
    eFetch('/admin/merchant', 'PATCH', {
      merchant_id,
      nickname,
    })
      .then((res) => {
        if (res.status === 200) {
          message.success(res.message)
          //按钮状态切换至 '编辑'
          for (const item of merchantInfo.value) {
            if (String(item.merchant_id) === merchant_id) {
              item.isEditing = !item.isEditing
            }
          }
        } else {
          message.error(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
        message.error('修改商家昵称失败')
      })
  } else {
    for (const item of merchantInfo.value) {
      if (String(item.merchant_id) === merchant_id) {
        item.isEditing = !item.isEditing
      }
    }
  }
}
//商品信息
interface GoodsInfo {
  title: string
  merchant: string
  current_price: number | string
  goods_id: string | number
}
const offsetGoodsInfo = ref(0) //商品信息分页
const goodsSearchTitle = ref(' ') //商品搜索
const goodsInfo = ref([] as GoodsInfo[])
function getGoodsInfo() {
  if(goodsSearchTitle.value!==' '){
    //去除空格
    goodsSearchTitle.value=goodsSearchTitle.value.trim()
  }
  eFetch(
    `/admin/goods?goods_title=${goodsSearchTitle.value}&offset=${offsetGoodsInfo.value}`,
    'GET',
  )
    .then((res) => {
      if (res.status === 200) {
        goodsInfo.value.splice(0, goodsInfo.value.length)
        for (const item of res.data as GoodsInfo[]) {
          goodsInfo.value.push(item)
        }
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('获取商品信息失败')
    })
}
//删除商品
function deleteGoods(goods_id: string | number) {
  goods_id = String(goods_id)
  console.log({goods_id})
  eFetch(`/admin/goods?goods_id=${goods_id}`, 'DELETE')
    .then((res) => {
      if (res.status === 200) {
        getGoodsInfo()
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('删除失败')
    })
}
//用户信息
interface PurchaserInfo {
  purchaser_id:string|number;
  nickname:string;
  profile_url:string;
  isEditing:boolean;
}
const purchaserInfo = ref([] as PurchaserInfo[])
const offsetPurchaserInfo = ref(0)
function getPurchaserInfo() {
  eFetch(`/admin/purchaser?${offsetPurchaserInfo.value}`,'GET')
    .then((res)=>{
      if(res.status===200){
        purchaserInfo.value.splice(0,purchaserInfo.value.length);
        for(const item of res.data as PurchaserInfo[]){
          item.isEditing=false;
          item.profile_url=netPackage.assetsUrl+item.profile_url;
          purchaserInfo.value.push(item);
          message.success(res.message);
        }
      }else{
        message.error(res.message);
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('获取用户信息失败');
    })
}
function updatePurchaserInfo(purchaser_id:string|number,isEditing:boolean,nickname:string){
  purchaser_id=String(purchaser_id);
  if(isEditing){
    //处于编辑状态，点击按钮后应该保存修改
    eFetch(`/admin/purchaser`,'PATCH',{
      purchaser_id,nickname
    })
      .then((res)=>{
      if(res.status===200){
        message.success(res.message);
        for(const item of purchaserInfo.value){
          if(String(item.purchaser_id)===purchaser_id){
            item.isEditing=!item.isEditing;
          }
        }
      }else{
        message.error(res.message);
      }
    })
  }else{
    //处于非编辑状态，点击按钮后应该切换至编辑状态
    for(const item of purchaserInfo.value){
      if(String(item.purchaser_id)===purchaser_id){
        item.isEditing=!item.isEditing;
      }
    }
  }
}
//管理员信息
interface AdminInfo {
  administrator_id:string|number;
  nickname:string;
  profile_url:string;
  email:string;
}
const adminInfo=ref([] as AdminInfo[]);
const offsetAdminInfo=ref(0);
function getAdminInfo(){
  eFetch(`/admin/admin?offset=${offsetAdminInfo.value}`,'GET')
    .then((res)=>{
      if(res.status===200){
        adminInfo.value.splice(0,adminInfo.value.length);
        for(const item of res.data as AdminInfo[]){
          item.profile_url=netPackage.assetsUrl+item.profile_url;
          adminInfo.value.unshift(item);
        }
        message.success(res.message);
      }else{
        message.error(res.message);
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('获取管理员信息失败');
    })
}
function deleteAdmin(administrator_id:string|number){
  administrator_id=String(administrator_id);
  eFetch(`/admin/admin?admin_id=${administrator_id}`,'DELETE')
    .then((res)=>{
      if(res.status===200){
        getAdminInfo();
        message.success(res.message);
      }else{
        message.error(res.message);
      }
    }).catch((err)=>{
      console.log(err);
      message.error('删除失败');
  })
}
interface NewAdminInfo {
  admin_email:string;
  password:string;
  nickname:string;
}
const newAdminInfo=ref({
  admin_email:'',
  password:'',
  nickname:''
}as NewAdminInfo)
function addAdminInfo(){
  eFetch('/admin/admin','PATCH',{
    admin_email:newAdminInfo.value.admin_email,
    password:newAdminInfo.value.password,
    nickname:newAdminInfo.value.nickname
  })
    .then((res)=>{
      if(res.status===200){
        getAdminInfo();
        message.success(res.message);
          newAdminInfo.value.admin_email='';
          newAdminInfo.value.password='';
          newAdminInfo.value.nickname='';
      }else{
        message.error(res.message);
      }
    })
    .catch((err)=>{
      console.log(err);
      message.error('添加失败');
    })
}
function logoutAdmin(){
  eFetch('/admin/logout','GET')
    .then((res)=>{
      if(res.status===200){
        message.success(res.message);
        useVerify().isPassVerify=false;
        router.push({
          name:'adminVerify',
          replace:true
        });
      }else{
        message.error(res.message);
      }
    })
    .catch((err)=>{
      console.log(err);
    })
}
</script>
<style scoped>
/* 增加一些间距样式 */
.ant-list-item {
  padding: 12px 0;
}
.ant-row {
  margin-bottom: 16px;
}
.ant-form-item {
  margin-right: 16px;
}
</style>


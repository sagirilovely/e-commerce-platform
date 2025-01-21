<template>
  <div :class="['navigationBar', state.collapsed ? 'navigationBar-shrink' : 'navigationBar-expand']"
       :style="{'background-color':token.colorBgBase}">
    <a-button type="primary"  @click="toggleCollapsed" class="toggleButton">
      <MenuUnfoldOutlined v-if="state.collapsed" class="menu"/>
      <MenuFoldOutlined v-else class="menu"/>
    </a-button>
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      :inline-collapsed="state.collapsed"
      :items="items"
      class="transition"
      @click="changePage"
    ></a-menu>
    <div class="avatar">
      <a-avatar :size="64" :src="avatarUrl" alt="头像">
      </a-avatar>
      <div class="nikename"  v-if="!state.collapsed">{{nikename}}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { theme } from 'ant-design-vue'
const { useToken } = theme
const { token } = useToken()
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { h, onMounted, reactive, ref, watch } from 'vue'
import useTheme from '@/stores/useTheme.ts'
import eFetch from '@/util/eFetch.ts'
import { message } from 'ant-design-vue'
import netPackage from '@/util/netPackage.ts'
import router from '@/router'
const state = reactive({
  collapsed: false,
  selectedKeys: ['goods'],
  openKeys: ['goods'],
  preOpenKeys: ['goods'],
});
const items = reactive([
  {
    key: 'goods',
    icon: () => h(ShoppingOutlined),
    label: '浏览商品',
    title: '浏览商品',
  },
  {
    key: 'trolley',
    icon: () => h(ShoppingCartOutlined),
    label: '购物车',
    title: '购物车',
  },
  {
    key: 'user',
    icon: () => h(UserOutlined),
    label: '个人信息',
    title: '个人信息',
  }
]);
interface itemInfo {
  key: string;
}
function changePage(item:itemInfo ){
  router.replace({name:item.key})
}
const avatarUrl=ref('')
const nikename=ref('')
interface UserInfo {
  profile_photo: string;
  nickname: string;
  userEmail: string;
  created_time: string;
}
onMounted(()=>{
  eFetch<UserInfo>('/user/info', 'GET')
    .then((res) => {
      if (res.status === 200) {
        avatarUrl.value = netPackage.assetsUrl+'/public/profile/'+res.data.profile_photo;
        nikename.value = res.data.nickname;
        console.log(avatarUrl.value)
      }else{
        message.error(res.message+'喵');
      }
  })
    .catch((err) => {
      console.log(err);
    })
})





watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
  useTheme().isNavigationBarCollapsed=state.collapsed;
};

</script>
<style scoped>
.navigationBar{
  margin: 5px 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.navigationBar-shrink{
  width: 100px;
  transition: all ease 0.6s;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.navigationBar-expand{
  width: 150px;
  transition: all ease 0.6s;
  box-shadow: 10px 1px 10px rgba(0,0,0,0.1);
}
.toggleButton{
  width: 90%;
  margin:0 10px 20px 10px;
  transition: width ease-in-out 0.5s;
}
.menu{
  transition: width ease-in-out 0.5s;
}
.avatar {
  margin-top: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nikename{
  color: #614c73;
  margin-top: 10px;
}
</style>

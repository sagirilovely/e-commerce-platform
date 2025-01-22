<template>
  <div>
    <TopBanner></TopBanner>
    <div class="container">
      <div class="showInfo" :style="{ backgroundColor: token.colorBgBase }">
        <div class="userBaseInfo">
          <div class="title">个人信息</div>
          <a-avatar :size="128" :src="profileUrl"> </a-avatar>
          <div class="nikename">昵称:&nbsp;&nbsp;{{ userBaseInfo.nickname }}</div>
          <div class="email">邮箱:&nbsp;&nbsp;{{ userBaseInfo.userEmail }}</div>
          <div class="created-time">创建日期:&nbsp;&nbsp;{{ createdTime }}</div>
        </div>
        <div class="userAddress">
          <div class="recipient">收货人:&nbsp;&nbsp;{{ userAddress.recipient }}</div>
          <div class="phone">联系电话:&nbsp;&nbsp;{{ userAddress.phone_number }}</div>
          <div class="country" v-if="userAddress.country">
            地址:&nbsp;&nbsp;{{ userAddress.country }}{{ userAddress.province }}省{{
              userAddress.city
            }}市{{ userAddress.detail }}
          </div>
        </div>
      </div>
      <div class="UpdateInfo" :style="{ backgroundColor: token.colorBgBase }">
        <div class="title">修改信息</div>
        <div>
          <div>
            <a-upload
              v-model:file-list="fileList"
              list-type="picture"
              :max-count="1"
              :before-upload="beforeUpload"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择新头像
              </a-button>
            </a-upload>
            <a-button type="primary" @click="updateUserProfile">确认修改头像</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { message, theme } from 'ant-design-vue'
import netPackage from '@/util/netPackage.ts'
import TopBanner from '@/components/TopBanner.vue'
import { computed, onMounted, reactive, ref} from 'vue'
import eFetch from '@/util/eFetch.ts'
import { UploadOutlined } from '@ant-design/icons-vue'
import router from '@/router'
interface UserBaseInfo {
  profile_photo: string
  nickname: string
  userEmail: string
  created_time: string
}
interface UserAddress {
  recipient: string
  phone_number: string
  country: string
  city: string
  province: string
  detail: string
}
const { useToken } = theme
const { token } = useToken()
const profileList = ref<File[]>([])
const fileList = ref([])

const userBaseInfo = reactive(<UserBaseInfo>{})
const userAddress = reactive(<UserAddress>{})
const profileUrl = computed(() => {
  if (userBaseInfo.profile_photo) {
    return netPackage.assetsUrl + userBaseInfo.profile_photo
  } else {
    return netPackage.assetsUrl + 'default.jpg'
  }
})
const createdTime = computed(() => {
  return new Date(userBaseInfo.created_time).getFullYear() + '-' + new Date(userBaseInfo.created_time).getMonth()+1 +
    '-' + new Date(userBaseInfo.created_time).getDate()
})
function beforeUpload(file: File) {
  profileList.value = [file] //存储文件
  return false //阻止默认上传
}
//----确认修改头像按钮
function updateUserProfile() {
  // 准备好一个formData
  const formData = new FormData()
  //必须上传图片且大小不能超过1024 * 1024 * 5
  if (profileList.value.length !== 0 && profileList.value[0].size < 1024 * 1024 * 5) {
    formData.append('userEmail', userBaseInfo.userEmail);
    formData.append('userProfile', profileList.value[0])
    let status: number
    fetch(netPackage.originUrl+'/user/profile', {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    })
      .then((res) => {
        status = res.status;
        return res.json()
      })
      .then((res) => {
        if (status === 200) {
          message.success(res.message + '喵');
          router.replace({ name: 'user', force: true });
        } else {
          message.error(res.message + '喵')
        }
      })
      .catch((err) => {
        console.log(err)
        message.error('出错咯!才不是伺服君的问题!')
      })
  } else {
    message.error('文件大小不对喵')
  }
}


function getUserInfo() {
  //获取用户基本信息
  eFetch(`/user/info`, 'GET')
    .then((res) => {
      if (res.status === 200) {
        Object.assign(userBaseInfo, res.data);
      } else {
        message.error(res.message + '喵')
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('获取用户信息失败喵')
    })
}
function getUserAddress() {
  // 获取用户地址信息
  eFetch(`/user/address`, 'GET')
    .then((res) => {
      if (res.status === 200) {
        Object.assign(userAddress, res.data)
      } else {
        message.error('还没有收货信息喵')
      }
    })
    .catch((err) => {
      console.log(err)
      message.error('获取用户地址信息失败喵')
    })
}
onMounted(() => {
  getUserInfo();
  getUserAddress();
})
</script>
<style scoped>
.container {
  display: flex;
  margin-top: 30px;
}
.showInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 550px;
  width: 50%;
  margin: 0 0 0 30px;
  border-radius: 20px;
}
.UpdateInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 550px;
  width: 50%;
  margin: 0 0 0 30px;
  border-radius: 20px;
}
.userBaseInfo {
  display: flex;
  height: 100%;
  flex-direction: column;
  flex: 1 1 auto;
}
.userBaseInfo > :nth-child(2) {
  margin: 10px 0 40px calc(50% - 64px);
}
.userBaseInfo > div,
.userAddress > div {
  height: 40px;
  font-size: 25px;
}
.userAddress {
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-top: 30px;
}
</style>

<template>
  <div>
    <TopBanner />
    <a-row class="container" :gutter="24">
      <!-- 个人信息展示区域 -->
      <a-col :xl="{ span: 10 }" :lg="{ span: 12 }" :md="{ span: 24 }">
        <a-card
          class="info-card"
          :style="{ backgroundColor: token.colorBgBase}"
          :title="null"
          :bordered="false"
        >
          <template #extra>
            <a-typography-title :level="4" class="card-title">个人信息</a-typography-title>
          </template>

          <a-space direction="vertical" align="center" class="avatar-section">
            <a-avatar :size="128" :src="profileUrl" class="avatar" />
            <a-descriptions layout="vertical" :column="1" bordered>
              <a-descriptions-item label="昵称">{{ userBaseInfo.nickname }}</a-descriptions-item>
              <a-descriptions-item label="邮箱">{{ userBaseInfo.userEmail }}</a-descriptions-item>
              <a-descriptions-item label="注册日期">{{ createdTime }}</a-descriptions-item>
            </a-descriptions>
          </a-space>

          <a-divider dashed>收货信息</a-divider>

          <a-descriptions layout="vertical" :column="1" bordered>
            <a-descriptions-item label="收货人">{{ userAddress.recipient }}</a-descriptions-item>
            <a-descriptions-item label="联系电话">{{ userAddress.phone_number }}</a-descriptions-item>
            <a-descriptions-item label="地址">
              {{ userAddress.country }}{{ userAddress.province }}省{{ userAddress.city }}市{{ userAddress.detail }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <!-- 信息修改区域 -->
      <a-col :xl="{ span: 14 }" :lg="{ span: 12 }" :md="{ span: 24 }">
        <a-card
          class="form-card"
          :style="{ backgroundColor: token.colorBgBase }"
          :title="null"
          :bordered="false"
        >
          <template #extra>
            <a-typography-title :level="4" class="card-title">信息修改</a-typography-title>
          </template>

          <a-form layout="vertical" class="form-container">
            <!-- 头像上传 -->
            <a-form-item label="修改头像" extra="支持JPG/PNG格式，大小不超过5MB">
              <a-space direction="vertical">
                <a-upload
                  v-model:file-list="fileList"
                  list-type="picture"
                  :max-count="1"
                  :before-upload="beforeUpload"
                  accept="image/png, image/jpeg"
                >
                  <a-button type="dashed" block>
                    <upload-outlined />
                    选择新头像
                  </a-button>
                </a-upload>
                <a-button
                  type="primary"
                  @click="updateUserProfile"
                  :disabled="!fileList.length"
                  block
                >
                  更新头像
                </a-button>
              </a-space>
            </a-form-item>

            <a-divider dashed />

            <!-- 昵称修改 -->
            <a-form-item label="修改昵称">
              <a-space :size="16" style="width: 100%">
                <a-input
                  v-model:value="newNickname"
                  placeholder="请输入新昵称"
                  allow-clear
                  style="flex: 1"
                />
                <a-button
                  type="primary"
                  @click="updateUserNickname"
                  :disabled="!newNickname"
                  style="width: 120px"
                >
                  确认修改
                </a-button>
              </a-space>
            </a-form-item>

            <a-divider dashed />

            <!-- 地址修改 -->
            <a-form-item label="修改收货信息">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-input v-model:value="newRecipient" placeholder="收件人" allow-clear />
                </a-col>
                <a-col :span="12">
                  <a-input v-model:value="newPhoneNumber" placeholder="联系电话" allow-clear />
                </a-col>
              </a-row>

              <a-row :gutter="16" class="mt-16">
                <a-col :span="8">
                  <a-input v-model:value="newCountry" placeholder="国家" allow-clear />
                </a-col>
                <a-col :span="8">
                  <a-input v-model:value="newProvince" placeholder="省份" allow-clear />
                </a-col>
                <a-col :span="8">
                  <a-input v-model:value="newCity" placeholder="城市" allow-clear />
                </a-col>
              </a-row>

              <a-input
                v-model:value="newDetail"
                placeholder="详细地址"
                allow-clear
                class="mt-16"
              />

              <a-button
                type="primary"
                block
                class="mt-16"
                @click="updateUserAddress"
                :disabled="!isAddressValid"
              >
                更新收货信息
              </a-button>
            </a-form-item>
            <a-divider dashed />
            <!-- 密码修改 -->
            <a-form-item label="修改密码">
              <a-space direction="vertical" style="width: 100%">
                <a-input-password
                  v-model:value="newPassword"
                  placeholder="(6-20位，需包含大小写字母和数字)"
                  allow-clear
                />
                <a-input-password
                  v-model:value="confirmPassword"
                  placeholder="确认新密码"
                  allow-clear
                />
                <a-row :gutter="16">
                  <a-col :span="16">
                    <a-input
                      v-model:value="code"
                      placeholder="验证码"
                      allow-clear
                    />
                  </a-col>
                  <a-col :span="8">
                    <a-button
                      block
                      @click="getVerifyCode"
                      :disabled="!canSendCode"
                    >
                      {{ codeButtonText }}
                    </a-button>
                  </a-col>
                </a-row>
                <a-button
                  type="primary"
                  block
                  @click="updatePassword"
                  :disabled="!isPasswordValid"
                >
                  修改密码
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
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
const newPassword = ref('')
const confirmPassword = ref('')
const code = ref('')
const codeCountdown = ref(0)
const codeButtonText = computed(() =>
  codeCountdown.value > 0 ? `${codeCountdown.value}秒后重试` : '获取验证码'
)
const canSendCode = computed(() =>
  codeCountdown.value === 0 &&
  newPassword.value === confirmPassword.value &&
  newPassword.value !== ''
)

// 密码有效性校验
const isPasswordValid = computed(() => {
  // 密码强度正则（至少包含大写字母、小写字母和数字）
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,20}$/

  return (
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value &&
    strongRegex.test(newPassword.value) && // 校验密码强度
    code.value.length === 6
  )
})

// 获取验证码
function getVerifyCode() {
  if (newPassword.value !== confirmPassword.value) {
    message.error('两次输入的密码不一致')
    return
  }

  eFetch('/user/password/code', 'GET')
    .then(res => {
      if (res.status === 200) {
        message.success('验证码已发送至注册邮箱')
        codeCountdown.value = 60
        const timer = setInterval(() => {
          codeCountdown.value--
          if (codeCountdown.value <= 0) clearInterval(timer)
        }, 1000)
      } else {
        message.error(res.message)
      }
    })
    .catch(err => {
      console.error(err)
      message.error('获取验证码失败')
    })
}

// 修改密码
function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    message.error('两次输入的密码不一致')
    return
  }

  eFetch('/user/password', 'PATCH', {
    code: code.value,
    password: newPassword.value
  }).then(res => {
    if (res.status === 200) {
      message.success('密码修改成功，请重新登录')
      // 这里可以根据你的登录逻辑跳转到登录页
      setTimeout(() => {
        router.replace({ name: 'loginByPassword' })
      }, 1500)
    } else {
      message.error(res.message)
    }
  }).catch(err => {
    console.error(err)
    message.error('修改密码失败')
  })
}
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
const newNickname=ref('')
function updateUserNickname(){
  if(newNickname.value){
    eFetch('/user/nikename','PATCH',{
      nikename:newNickname.value
    }).then((res)=>{
      if(res.status===200){
        message.success(res.message+'喵')
        window.location.reload();
      }else{
        message.error(res.message+'喵')
      }
    }).catch((err)=>{
      console.log(err)
      message.error('出错咯!才不是伺服君的问题!')
    })
  }else{
    message.error('请输入新昵称喵')
  }
}
const newRecipient=ref('')
const newPhoneNumber=ref('')
const newCountry=ref('')
const newProvince=ref('')
const newCity=ref('')
const newDetail=ref('')
function updateUserAddress(){
  if(newRecipient.value&&newPhoneNumber.value&&newCountry.value&&newProvince.value&&newCity.value&&newDetail.value){
    eFetch('/user/address','PATCH',{
      recipient:newRecipient.value,
      phone_number:newPhoneNumber.value,
      country:newCountry.value,
      province:newProvince.value,
      city:newCity.value,
      detail:newDetail.value
    }).then((res)=>{
      if(res.status===200){
        message.success(res.message+'喵')
        window.location.reload();
      }else{
        message.error(res.message+'喵')
      }
    }).catch((err)=>{
      console.log(err)
      message.error('出错咯!才不是伺服君的问题!')
    })
  }else{
    message.error('请输入所有收货信息喵')
  }
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
          window.location.reload();
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
const isAddressValid = computed(() => {
  return newRecipient.value &&
    newPhoneNumber.value &&
    newCountry.value &&
    newProvince.value &&
    newCity.value &&
    newDetail.value
})
onMounted(() => {
  getUserInfo();
  getUserAddress();
})
</script>


<style scoped>
.container {
  max-width: 100%;
  margin: 10px auto;
  padding: 0 24px;
}

.info-card,
.form-card {
  border-radius: 12px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
  0 6px 16px 0 rgba(0, 0, 0, 0.08),
  0 9px 28px 8px rgba(0, 0, 0, 0.05);
  height: 550px;
  overflow-y: scroll;
}

.card-title {
  color: v-bind('token.colorPrimary');
  margin-bottom: 0 !important;
}

.avatar-section {
  width: 100%;
  margin-bottom: 24px;
}

.avatar {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.form-container {
  padding: 0 16px;
}

.mt-16 {
  margin-top: 16px;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
  color: v-bind('token.colorTextSecondary');
}

:deep(.ant-divider-dashed) {
  border-color: v-bind('token.colorBorderSecondary');
}
</style>

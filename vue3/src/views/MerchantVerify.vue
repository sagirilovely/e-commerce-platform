<template>
  <div class="admin-login">
    <a-button type="link" @click="goToAdminLogin">管理员登录
      <span class="arrow-right-outlined"><ArrowRightOutlined /></span></a-button>
  </div>
  <div class="merchant-auth-page">
    <a-tabs v-model:activeKey="activeKey" centered>
      <!-- 注册标签页 -->
      <a-tab-pane key="1" tab="商家注册">
        <div class="form-item">
          <div class="label">邮　　箱：</div>
          <a-auto-complete
            v-model:value.trim="registerEmail"
            :options="emailOptions"
            :placeholder="emailPlaceholder"
            style="width: 280px"
            @search="handleEmailSearch"
          >
            <template #clearIcon><close-outlined /></template>
          </a-auto-complete>
        </div>

        <div class="form-item">
          <div class="label">验证码：</div>
          <a-input
            v-model:value.trim="registerCode"
            placeholder="6位数字验证码"
            style="width: 140px"
          />
          <a-button
            type="primary"
            style="margin-left: 20px"
            @click="getRegisterCode"
            :disabled="registerCodeDisabled"
          >
            {{ registerCodeBtnText }}
          </a-button>
        </div>

        <div class="form-item">
          <div class="label">密　　码：</div>
          <a-input-password
            v-model:value.trim="registerPassword"
            placeholder="6-12位含大小写数字"
            style="width: 280px"
          />
        </div>

        <div class="form-item">
          <div class="label">店铺名称：</div>
          <a-input
            v-model:value.trim="shopName"
            placeholder="2-12个字符"
            style="width: 280px"
          />
        </div>

        <div class="form-item">
          <div class="label">店铺头像：</div>
          <a-upload
            v-model:file-list="avatarList"
            :before-upload="beforeAvatarUpload"
            :max-count="1"
            list-type="picture"
          >
            <a-button>
              <upload-outlined />
              上传头像（小于5MB）
            </a-button>
          </a-upload>
        </div>

        <div class="submit-btn">
          <a-button
            type="primary"
            @click="handleRegister"
            :disabled="registerDisabled"
          >
            立即注册
          </a-button>
        </div>
      </a-tab-pane>

      <!-- 密码登录标签页 -->
      <a-tab-pane key="2" tab="密码登录">
        <div class="form-item">
          <div class="label">邮　　箱：</div>
          <a-auto-complete
            v-model:value.trim="loginEmail"
            :options="emailOptions"
            placeholder="邮 箱"
            style="width: 280px"
            @search="handleEmailSearch"
          >
            <template #clearIcon><close-outlined /></template>
          </a-auto-complete>
        </div>

        <div class="form-item">
          <div class="label">密　　码：</div>
          <a-input-password
            v-model:value.trim="loginPassword"
            placeholder="输入密码"
            style="width: 280px"
            @keydown.enter="handlePasswordLogin"
          />
        </div>

        <div class="submit-btn">
          <a-button type="primary" @click="handlePasswordLogin">
            立即登录
          </a-button>
        </div>
      </a-tab-pane>

      <!-- 验证码登录标签页 -->
      <a-tab-pane key="3" tab="验证码登录">
        <div class="form-item">
          <div class="label">邮　　箱：</div>
          <a-auto-complete
            v-model:value.trim="codeLoginEmail"
            :options="emailOptions"
            placeholder="邮 箱"
            style="width: 280px"
            @search="handleEmailSearch"
          >
            <template #clearIcon><close-outlined /></template>
          </a-auto-complete>
        </div>

        <div class="form-item">
          <div class="label">验证码：</div>
          <a-input
            v-model:value.trim="loginCode"
            placeholder="6位数字验证码"
            style="width: 140px"
          />
          <a-button
            type="primary"
            style="margin-left: 20px"
            @click="getLoginCode"
            :disabled="loginCodeDisabled"
          >
            {{ loginCodeBtnText }}
          </a-button>
        </div>

        <div class="submit-btn">
          <a-button type="primary" @click="handleCodeLogin">
            验证码登录
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MerchantVerify'
})
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { CloseOutlined, UploadOutlined ,ArrowRightOutlined} from '@ant-design/icons-vue'
import eFetch from '@/util/eFetch.ts'
import router from '@/router'
import netPackage from '@/util/netPackage.ts'

// 文件项接口
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  originFileObj?: File;
}

// 公共状态
const activeKey = ref('1')
const emailOptions = ref<{ value: string }[]>([])
const emailPlaceholder = ref('请输入邮箱')

// 注册相关状态
const registerEmail = ref('')
const registerCode = ref('')
const registerPassword = ref('')
const shopName = ref('')
const avatarList = ref<FileItem[]>([])
const registerCodeDisabled = ref(false)
const registerCodeBtnText = ref('获取验证码')
const registerDisabled = ref(false)

// 登录相关状态
const loginEmail = ref('')
const loginPassword = ref('')
const codeLoginEmail = ref('')
const loginCode = ref('')
const loginCodeDisabled = ref(false)
const loginCodeBtnText = ref('获取验证码')

// 表单验证正则
const validators = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
  code: /^\d{6}$/,
  shopName: /^.{2,12}$/
}

// 邮箱自动补全
const handleEmailSearch = (searchText: string) => {
  emailOptions.value = searchText
    ? ['@qq.com', '@163.com', '@gmail.com', '@126.com']
      .map(domain => ({ value: `${searchText}${domain}` }))
    : []
}

// 注册验证码获取
const getRegisterCode = async () => {
  if (!validators.email.test(registerEmail.value)) {
    message.error('邮箱格式不正确')
    return
  }

  try {
    const res = await eFetch('/verify/merchant/register', 'POST', {
      userEmail: registerEmail.value
    })

    if (res.status === 200) {
      message.success('验证码已发送')
      startCountdown('register')
    } else if (res.status === 409) {
      message.warning('该邮箱已注册')
    }
  } catch (err) {
    message.error(String(err))
  }
}

// 登录验证码获取
const getLoginCode = async () => {
  if (!validators.email.test(codeLoginEmail.value)) {
    message.error('请输入有效邮箱')
    return
  }

  try {
    const res = await eFetch('/verify/merchant/login/code', 'POST', {
      userEmail: codeLoginEmail.value
    })

    if (res.status === 200) {
      message.success('验证码已发送')
      startCountdown('login')
    }
  } catch (err) {
    message.error(String(err))
  }
}

// 倒计时处理
const startCountdown = (type: 'register' | 'login') => {
  let seconds = 30
  const update = () => {
    if (type === 'register') {
      registerCodeBtnText.value = `${seconds}s`
      registerCodeDisabled.value = true
    } else {
      loginCodeBtnText.value = `${seconds}s`
      loginCodeDisabled.value = true
    }

    if (--seconds < 0) {
      clearInterval(timer)
      if (type === 'register') {
        registerCodeBtnText.value = '获取验证码'
        registerCodeDisabled.value = false
      } else {
        loginCodeBtnText.value = '获取验证码'
        loginCodeDisabled.value = false
      }
    }
  }

  const timer = setInterval(update, 1000)
  update()
}

// 头像上传处理
const beforeAvatarUpload = (file: File) => {
  const fileItem: FileItem = {
    uid: Date.now().toString(),
    name: file.name,
    status: 'done',
    originFileObj: file,
  }
  avatarList.value = [fileItem]
  return false
}

// 注册提交
const handleRegister = async () => {
  // 表单验证
  if (!validators.email.test(registerEmail.value)) {
    message.error('邮箱格式不正确')
    return
  }
  if (!validators.password.test(registerPassword.value)) {
    message.error('密码需6-12位且包含大小写字母和数字')
    return
  }
  if (!validators.shopName.test(shopName.value)) {
    message.error('店铺名称需2-12个字符')
    return
  }
  if (!validators.code.test(registerCode.value)) {
    message.error('验证码格式错误')
    return
  }
  if (avatarList.value.length === 0) {
    message.error('请上传店铺头像')
    return
  }

  const formData = new FormData()
  formData.append('userEmail', registerEmail.value)
  formData.append('userPassword', registerPassword.value)
  formData.append('userNickname', shopName.value)
  formData.append('verifyCode', registerCode.value)
  if (avatarList.value[0].originFileObj) {
    formData.append('userProfile', avatarList.value[0].originFileObj)
  }

  let status: number
  fetch(netPackage.originUrl + '/verify/merchant/register', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })
    .then((res) => {
      status = res.status
      return res.json()
    })
    .then((res) => {
      if (status === 201) {
        message.success('注册成功，请登录')
        activeKey.value = '2'
      } else {
        message.error(res.message + '喵')
      }
    })
    .catch((err) => {
      message.error('出错咯!才不是伺服君的问题!')
      console.log(err)
    })
}

// 密码登录
const handlePasswordLogin = async () => {
  if (!validators.email.test(loginEmail.value)) {
    return message.error('邮箱格式错误')
  }
  if (!validators.password.test(loginPassword.value)) {
    return message.error('密码格式错误')
  }

  try {
    const res = await eFetch('/verify/merchant/login/password', 'POST', {
      userEmail: loginEmail.value,
      userPassword: loginPassword.value,
    })

    if (res.status === 201) {
      message.success('登录成功')
      await router.push({
        name:'merchantDashboard',
        replace:true
      })
    }
  } catch (err) {
    message.error(String(err))
  }
}

// 验证码登录
const handleCodeLogin = async () => {
  if (!validators.email.test(codeLoginEmail.value)) {
    return message.error('邮箱格式错误')
  }
  if (!validators.code.test(loginCode.value)) {
    return message.error('验证码格式错误')
  }

  try {
    const res = await eFetch('/verify/merchant/login/code', 'POST', {
      userEmail: codeLoginEmail.value,
      verifyCode: loginCode.value,
    })

    if (res.status === 201) {
      message.success('登录成功')
      await router.push({
        name:'merchantDashboard',
        replace:true
      })
    }
  } catch (err) {
    message.error(String(err))
  }
}
//前往管理员登录
function goToAdminLogin(){
  router.push({
    name:'adminVerify',
    replace:false
  })
}
</script>

<style scoped>
.merchant-auth-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

}
.admin-login{
  margin-right: 30px;
  float: right;
}
@keyframes arrow-right-rotate {
  50%{
    transform: translate(3px) ;
  }
  100%{
    transform: translate(0px) ;
  }
}
.admin-login .arrow-right-outlined{
  animation: arrow-right-rotate 1s linear infinite alternate;
}

.label {
  width: 80px;
  margin-right: 1rem;
  text-align: right;
}

.submit-btn {
  margin-top: 2rem;
  text-align: center;
}

.ant-btn {
  transition: all 0.3s;
}
</style>

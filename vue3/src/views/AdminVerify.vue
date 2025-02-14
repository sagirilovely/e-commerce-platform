<template>
  <div class="admin-auth-page">
    <div class="form-item">
      <div class="label">邮　　箱：</div>
      <a-auto-complete
        v-model:value.trim="loginEmail"
        :options="emailOptions"
        placeholder="请输入邮箱"
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
        @keydown.enter="handleLogin"
      />
    </div>

    <div class="submit-btn">
      <a-button type="primary" @click="handleLogin" :disabled="loginDisabled">
        立即登录
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AdminVerify'
})

import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import eFetch from '@/util/eFetch.ts'
import router from '@/router'

// 公共状态
const emailOptions = ref<{ value: string }[]>([])
const loginEmail = ref('')
const loginPassword = ref('')
const loginDisabled = ref(true)

// 表单验证正则
const validators = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/
}

// 邮箱自动补全
const handleEmailSearch = (searchText: string) => {
  emailOptions.value = searchText
    ? ['@qq.com', '@163.com', '@gmail.com', '@126.com']
      .map(domain => ({ value: `${searchText}${domain}` }))
    : []
}

// 监听输入字段，动态启用/禁用登录按钮
watch(
  [loginEmail, loginPassword],
  ([newEmail, newPassword]) => {
    const isAllFieldsFilled =
      newEmail.trim() !== '' &&
      newPassword.trim() !== ''
    loginDisabled.value = !isAllFieldsFilled
  },
  { deep: true }
)

// 登录处理
const handleLogin = async () => {
  // 表单验证
  if (!validators.email.test(loginEmail.value)) {
    return message.error('邮箱格式不正确')
  }
  if (!validators.password.test(loginPassword.value)) {
    return message.error('密码需6-12位且包含大小写字母和数字')
  }

  try {
    const res = await eFetch('/verify/admin', 'POST', {
      userEmail: loginEmail.value,
      userPassword: loginPassword.value
    })

    if (res.status === 201) {
      message.success('登录成功')
      await router.push({
        name: 'adminDashboard',
        replace: true
      })
    } else if (res.status === 401) {
      message.error(res.message || '账号或密码错误')
    } else {
      message.error(res.message || '登录失败，请稍后重试')
    }
  } catch (err) {
    message.error('出错咯！才不是伺服君的问题！')
    console.error(err)
  }
}
</script>

<style scoped>
.admin-auth-page {
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

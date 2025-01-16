<template>
  <div class="loginByPassword" id="part-1">
    <div class="userEmail">
      <div class="text">账号：</div>
      <a-auto-complete
        v-model:value="userEmail"
        :allow-clear="true"
        :options="options"
        placeholder="邮箱"
        style="width: 250px"
        @search="onSearch"
      >
        <template #clearIcon>
          <close-outlined />
        </template>
      </a-auto-complete>
    </div>

    <div class="userPassword">
      <div class="text">密码：</div>
      <a-input-password v-model:value="userPassword" placeholder="密码" style="width: 250px" @keydown.enter="login">
        <template #iconRender="v">
          <EyeTwoTone v-if="v"></EyeTwoTone>
          <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
        </template>
      </a-input-password>
    </div>
    <a-button type="primary" @click="login">登录</a-button>
  </div>
</template>

<script lang="ts" setup>
import { CloseOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import eFetch from '@/util/eFetch.ts'
import router from '@/router'
import useVerify from '@/stores/useVerify.ts'
const options = ref<MockVal[]>([])

const userEmail = ref('')
const userPassword = ref('')

const login = () => {
  eFetch('/verify/login/password','POST',{
    userEmail: userEmail.value,
    userPassword: userPassword.value,
  })
    .then((res)=>{
      if(res.status === 201){
        message.success(res.message+'喵');
        const localHistory=useVerify().historyName;
        router.replace({name:localHistory});
      }else{
        message.error(res.message+'喵');
      }
    })
    .catch((err)=>{
      console.log(err);
    })
}
onMounted(()=>{
  if(localStorage.getItem('userEmail') || localStorage.getItem('userEmail')!==null){
    userEmail.value=localStorage.getItem('userEmail') as string;
  }
})
//----处理邮箱填充功能
interface MockVal {
  value: string
}

function getValue(value: string): MockVal {
  return {
    value: value,
  }
}

const onSearch = (searchText: string) => {
  options.value = !searchText
    ? []
    : [
        getValue(`${searchText}@qq.com`),
        getValue(`${searchText}@163.com`),
        getValue(`${searchText}@gmail.com`),
        getValue(`${searchText}@126.com`),
      ]
}
</script>

<style scoped>
.userEmail,
.userPassword {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 3rem;
  width: 70%;
}

</style>

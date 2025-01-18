<template>
  <div class="loginByCodePage">
    <div>
      <div class="text">邮&nbsp;&nbsp;&nbsp;箱：</div>
      <a-auto-complete
        v-model:value.trim="userEmail"
        :allow-clear="true"
        :options="options"
        style="width: 280px"
        @search="onSearch"
      ><template #clearIcon>
        <close-outlined />
      </template>
      </a-auto-complete>
    </div>
    <div>
      <div class="text">验证码：</div>
      <a-input v-model:value.trim="verifyCode"  style="width: 140px"/>
      <a-button type="primary" style="margin-left: 20px"
                 class="verifyButton" @click="getVerifyCode" :disabled="verifyButtonIsDisabled">{{verifyButtonText}}
      </a-button>
    </div>

    <div class="registerButton">
      <a-button type="primary" class="loginButton" @click="login" :disabled="loginButtonIsDisabled">登录</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import eFetch from '@/util/eFetch.ts'

defineOptions({
  name: 'LoginByCode'
})
import { ref, watch } from 'vue'
import { CloseOutlined, } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import useVerify from '@/stores/useVerify.ts'
import router from '@/router'
const verifyCode= ref('');
const userEmail=ref('')
const loginButtonIsDisabled=ref(true);
const verifyButtonText=ref('获取验证码');
const verifyButtonIsDisabled=ref(false);
//获取验证码按钮
function getVerifyCode(){
  eFetch('/verify/login/code','POST',{
    userEmail: userEmail.value,
    isGetCode:'true'
  })
    .then((res)=>{
      if(res.status === 200){
        message.success(res.message+'喵');
        let time=30;
        verifyButtonIsDisabled.value=true;
        const timerId=setInterval(()=>{
          verifyButtonText.value=time+'s';
          time--;
          if(time<=0){
            clearInterval(timerId);
            verifyButtonText.value='获取验证码';
            verifyButtonIsDisabled.value=false;
          }
        },1000)
      }else{
        message.error(res.message+'喵');
      }
    })
}
//登录按钮
function login(){
  eFetch('/verify/login/code','POST',{
    userEmail: userEmail.value,
    verifyCode: verifyCode.value
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
}
//监视验证码是否符合要求(6位数字)
watch(verifyCode,(newVal)=>{
  loginButtonIsDisabled.value = newVal.length !== 6;
})

//----处理邮箱填充功能
const options = ref<MockVal[]>([])
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
.text{
  display: flex;
  justify-content: right;
  width: 90px;
}
.loginByCodePage>div{
  display: flex;
  width: 90%;
  justify-content: left;
  align-items: center;
  margin-bottom: 0.5em;
  position: relative;
}
.verifyButton{
  width: 120px;
  transition: all ease-in-out 500ms ;
}
.loginButton{
  margin-top: 70px;
  position: absolute;
  left: 50%;
  transform: translateX(-75%);
}
</style>


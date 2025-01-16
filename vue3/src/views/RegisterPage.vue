<template>
<div class="register-page">
 <div>
   <div class="text">邮&nbsp;&nbsp;&nbsp;箱：</div>
   <a-auto-complete
     v-model:value="userEmail"
     :allow-clear="true"
     :options="options"
     :placeholder="placeholderObj.emailPlaceholder"
     style="width: 280px"
     @search="onSearch"
   ><template #clearIcon>
     <close-outlined />
   </template>
   </a-auto-complete>
 </div>
  <div>
    <div class="text">验证码：</div>
    <a-input v-model:value="verifyCode" :placeholder="placeholderObj.verifyCodePlaceholder" style="width: 140px"/>
    <a-button type="primary" style="margin-left: 20px" @click="getVerifyCode"
              :disabled="getCodeButtonIsDisabled" class="verifyButton">{{buttonText}}
    </a-button>
  </div>
  <div>
    <div class="text">密&nbsp;&nbsp;&nbsp;码：</div>
    <a-input v-model:value="password" :placeholder="placeholderObj.passwordPlaceholder" style="width: 280px"/>
  </div>
  <div>
    <div class="text">昵&nbsp;&nbsp;&nbsp;称：</div>
    <a-input v-model:value="nikeName" :placeholder="placeholderObj.nikeNamePlaceholder" style="width: 280px"/>
  </div>
  <div class="profile">
    <div class="text">头&nbsp;&nbsp;&nbsp;像：</div>
    <div>
      <a-upload
        v-model:file-list="fileList"
        list-type="picture"
       :max-count="1"
        :before-upload="beforeUpload"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传头像
        </a-button>
      </a-upload>
    </div>
  </div>
<div class="registerButton">
  <a-button type="primary" @click="register" :disabled="registerButtonIsDisabled">确认注册</a-button>
</div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import router from '../router/index.ts'
import { CloseOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import eFetch from '@/util/eFetch.ts'
const options = ref<MockVal[]>([])
const userEmail = ref('');
const verifyCode= ref('');
const buttonText= ref('发送验证码')
const password= ref('');
const profileList= ref<File[]>([]);
const nikeName= ref('');
const placeholderObj=reactive({
  emailPlaceholder:'请输入邮箱',
  passwordPlaceholder:'请输入密码',
  nikeNamePlaceholder:'请输入昵称',
  verifyCodePlaceholder:'请输入验证码'
})
const IntervalId=ref(0);
const getCodeButtonIsDisabled= ref(false)
const registerButtonIsDisabled=ref(true);
//验证码间隔时间
const nextTime=ref(30);
const fileList = ref([]);
//获取验证码
function getVerifyCode(){
  //检查邮箱格式是否符合正则表达式
  if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail.value)){
    userEmail.value='';
    placeholderObj.emailPlaceholder='邮箱格式错啦,笨蛋杂鱼！';
    message.error('邮箱格式不正确喵');
    return;
  }
  eFetch('/verify/register','POST',{
    userEmail: userEmail.value
  })
    .then((res)=>{
      if(res.status === 200){
        message.success(res.message+'喵');
        getCodeButtonIsDisabled.value=true;
        IntervalId.value=setInterval(()=>{
          buttonText.value=nextTime.value+'s';
          nextTime.value--;
        },1000);
      }else if(res.status === 409){
        message.warn(res.message+',将自动跳转至登录页');
          const timeOutId=setTimeout(()=>{
            router.replace({name:'loginByPassword'});
            clearTimeout(timeOutId);
          },2000)
        localStorage.setItem('userEmail',userEmail.value);
      }else{
        message.error(res.message+'喵');
      }
    })
    .catch((err)=>{
      message.error(err);
    })
}
//监听验证码按钮,倒计时为0时，恢复按钮可用状态
watch(nextTime,(newVal)=>{
  if(newVal===0){
    getCodeButtonIsDisabled.value=false;
    buttonText.value='发送验证码';
    nextTime.value=30;
    clearInterval(IntervalId.value)
  }
})
//监听所有用户填写的数据,不为空时，才允许点注册按钮
watch(
  [userEmail, verifyCode, password, nikeName, profileList],
  ([newEmail, newVerifyCode, newPassword, newNikeName, newProfileList]) => {
    // 检查所有字段是否都不为空
    const isAllFieldsFilled =
      newEmail.trim() !== '' &&
      newVerifyCode.trim() !== '' &&
      newPassword.trim() !== '' &&
      newNikeName.trim() !== '' &&
      newProfileList.length > 0;
    // 根据条件启用或禁用注册按钮
    registerButtonIsDisabled.value = !isAllFieldsFilled;
  },
  { deep: true } // 深度监听，确保能监听到 profileList 的变化
);
//-----文件上传按钮功能

function beforeUpload(file: File){
  profileList.value=[file];//存储文件
  return false;//阻止默认上传
}

//----注册按钮
function register() {
  if (!isValidInput()) {
    return;
  }
  // 准备好一个formData
  const formData = new FormData();
let  status:number;
  if (profileList.value.length !== 0) {
    formData.append('userProfile', profileList.value[0]);
    formData.append('verifyCode', verifyCode.value);
    formData.append('userEmail', userEmail.value);
    formData.append('userPassword', password.value);
    formData.append('userNickname', nikeName.value);
  }
  fetch(' http://localhost:1010/api/v1/verify/register', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
    .then((res)=>{
      status=res.status;
      return res.json();
    })
    .then((res) => {
      if (status === 201) {
        message.success(res.message + ',将自动跳转至登录页');
        const timeOutId = setTimeout(() => {
          router.replace({ name: 'loginByPassword' });
          clearTimeout(timeOutId);
        }, 2000)
        localStorage.setItem('userEmail', userEmail.value);
      } else if (status === 401) {
        verifyCode.value = '';
        message.error(res.message + '喵');
      } else {
        message.error(res.message + '喵');
      }
    })
    .catch((err) => {
      message.error('出错咯!才不是伺服君的问题!');
      console.log(err);
    })

}



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
function isValidInput(): boolean{
  //1. 邮箱要符合正则表达式
  const isEmailQualified= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail.value);
  //2. 密码要有数字、大写字母、小写字母，并总共超过6位不多于12位
  const isPasswordQualified= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/.test(password.value);
  //3. 昵称要大于2位小于12位
  const isNikeNameQualified= /^.{2,12}$/.test(nikeName.value);
  //4. 上传的文件大小不能超过5mb ,且不能为空
  const isProfileQualified= (profileList.value[0].size<=5*1024*1024) && profileList.value.length!==0;
  //5. 验证码要符合正则表达式(6位数字）
  const isVerifyCodeQualified= /^\d{6}$/.test(verifyCode.value);
  if(!isEmailQualified){
    userEmail.value='';
    placeholderObj.emailPlaceholder='请重写邮箱喵';
    message.error('邮箱格式不正确喵');return false;
  }
  if(!isPasswordQualified){
    password.value='';
    placeholderObj.passwordPlaceholder='请重写密码喵';
    message.error('密码格式不正确喵');return false;
  }
  if(!isNikeNameQualified){
    nikeName.value='';
    placeholderObj.nikeNamePlaceholder='请重写昵称喵';
    message.error('昵称格式不正确喵');return false;
  }
  if(!isProfileQualified){
    profileList.value=[];
    message.error('头像图片太大喵');return false;
  }
  if(!isVerifyCodeQualified){
    verifyCode.value='';
    placeholderObj.verifyCodePlaceholder='请重写验证码喵';
    message.error('验证码格式不正确喵,是6位哦！');return false;
  }
  return true;
}
</script>

<style scoped>
.text{
  display: flex;
  justify-content: right;
  width: 90px;
}
.register-page>div{
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
.registerButton{
  margin-top: 20px;
  position: absolute;
  left: 75%;
  transform: translateX(-50%);
}
</style>

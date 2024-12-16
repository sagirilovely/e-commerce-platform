<template>
<div>
  <form action="">
    userName: <input type="text" placeholder="userName" v-model="userName"> <br>
    passWord: <input type="password" v-model="userPW" >;
    {{errInfo}}
    <button @click="submitInfo">submit</button>
  </form>
</div>

</template>
<script>

export default {
  name:'LoginPage',
  data(){
    return{
      userName:'',
      userPW:'',
      errInfo:''
    }
  },
  computed:{

  },
  methods:{
    submitInfo(){
      console.log('提交按钮被点击')
      fetch('http://localhost:2233/login',{
        method:"POST",
        headers:{
          'content-type':'application/json',
          "authorization":JSON.parse(localStorage.getItem('authorization'))["token"]
        },
        body:JSON.stringify({
          "userName":this.userName,
          "userPW":this.userPW
        })
      }).then((res)=>{
        if(res.ok){
          //更新本地token
          localStorage.setItem('authorization',JSON.stringify({'token':res.headers.get('authorization')}));
          console.log(res.headers.get('authorization'))
          return res.json();
        }else{
          return Promise.reject({
            'status':res.status,
            'statusText':res.statusText
          })
        }

      })
          .then((data)=>{
            if(data['pass']){
              //返回前一页
              this.errInfo='密码正确';
              setTimeout(()=>{
                this.$router.replace({name:'UserInfoPage'});
              },2000);
            }else{
              //刷新当前页面
              this.errInfo='密码错误';
              setTimeout(()=>{
                location.reload();
              },2000);
            }
          }).catch((err)=>{
            this.errInfo='服务器连接失败,请稍后重播';
          console.log('表单提交失败:'+err);
      })
    }
  },
}
</script>
<style scoped>

</style>
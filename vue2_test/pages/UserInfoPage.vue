<template>
  <div>{{ userInfo }}</div>
</template>

<script>
export default {
  name: "UserInfoPage",
  data() {
    return {
      userInfo: "",
    };
  },
  computed: {},
  methods: {
    getUserInfo(){
      fetch("http://localhost:2233/user",{
        method:"GET",
        headers:{
          'content-type':'application/json',
          "authorization":JSON.parse(localStorage.getItem('authorization'))["token"]
        }
      }).then((res)=>{
        localStorage.setItem('authorization',JSON.stringify({'token':res.headers.get('authorization')}));
        return res.json();
      })
          .then((data)=>{
            console.log(data)
            this.userInfo=data['name'];
          }).catch((err)=>{
        this.userInfo='未知错误';
        console.log(err);
      })
    }
  },
  mounted() {
    setTimeout(()=>{
      this.getUserInfo();
    },2000)
  },
};
</script>

<style scoped></style>
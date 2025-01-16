<template>
{{goods}}

  <div>
      <button @click="getGoods">获取goods</button>
  </div>
</template>
<script setup lang="ts">
import { reactive} from 'vue'
import eFetch from '@/util/eFetch.ts'
import {message} from 'ant-design-vue'


const goods = reactive({})
function getGoods(){
  eFetch('/merchandise/detail?goods_id=5','GET')
    .then((res)=>{
      if(res.status === 200){
       Object.assign(goods,res.data)
      }else {
        message.error(res.message);
      }
    }).catch((err)=>{
      console.log(err);
  })
}
</script>
<style scoped>

</style>

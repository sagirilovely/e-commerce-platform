import {defineStore} from 'pinia'
const useVerify = defineStore('verify',{
  state:()=>{
    let localVerifyStatus:string|boolean|undefined|null=localStorage.getItem('isPassVerify');
    if(localVerifyStatus===null || localVerifyStatus==='false' || localVerifyStatus===undefined){
      localVerifyStatus=false;
    }else{
      localVerifyStatus=true;
    }
    return {
      isPassVerify:localVerifyStatus,
      historyName:'goods',
    }
  },
  actions:{

  },
  getters:{

  }
})

export default useVerify

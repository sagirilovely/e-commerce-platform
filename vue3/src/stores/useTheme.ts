import {defineStore} from 'pinia'

const useTheme=defineStore('useTheme',{
  state:()=>{
    return {
      isDark:false
    }
  },
  actions:{
      changeTheme(isDark?:boolean){
        if(typeof isDark !== 'undefined'){
          this.isDark=isDark;
          return
        }
        this.isDark=!this.isDark;
        localStorage.setItem('isDark',this.isDark?'true':'false')
      }
  },
  getters:{
    nowTheme(){
      if(!this.isDark){
        return 'defaultAlgorithm'
      }else{
        return 'darkAlgorithm'
      }
    }
  }
})
export default useTheme

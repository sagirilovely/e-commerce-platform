import {defineStore} from 'pinia'

const useGoods = defineStore('goods',{
    state:()=>{
      return {
        category:'其他',
        selectedGoodsId:''
      }
    }
})
export default useGoods;

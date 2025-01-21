import useVerify from '@/stores/useVerify.ts'
import netPackage from '@/util/netPackage.ts'
interface eFetchData<T>{
  status:number;
  message:string;
  data:T
}

/**
 * 执行网络请求并处理响应数据:并更新 pinia验证状态 与 本地验证状态
 * 使用fetch API进行网络请求，并对请求参数和响应数据进行统一处理
 *
 * @param httpUrl 请求的URL地址
 * @param httpMethod HTTP请求方法，如GET、POST等
 * @param httpBody 请求体内容，将被序列化为JSON格式
 * @returns 返回一个Promise，解析为包含请求状态、消息和数据的对象
 */
function eFetch<T>(httpUrl:string,httpMethod:string,httpBody?:object):Promise<eFetchData<T>>{
  const options:{
    method:string,
    headers?:object,
    body?:string|object,
    credentials:RequestCredentials
  }={
    method:httpMethod,
    headers:{
      'Content-Type':'application/json',
    },
    credentials:'include'
  }
  if (httpMethod !== 'GET') {
    options.body = JSON.stringify(httpBody);
  }
  const httpData:eFetchData<T>={status:0,message:'',data:{}as T};
  return fetch((netPackage.originUrl+httpUrl),<object>options)
    .then((res)=>{
      httpData.status=res.status;
      useVerify().isPassVerify=!(httpData.status===401);
      localStorage.setItem('isPassVerify',String(useVerify().isPassVerify))
      return res.json();
    })
    .then((res)=>{
      httpData.message=res.message;
      httpData.data=res.data;
      return httpData;
    })
    .catch(()=>{
      useVerify().isPassVerify=false;
      httpData.status=500;
      httpData.message='网络错误';
      httpData.data={}as T;
      return Promise.reject(httpData)
    })
}

export default eFetch;

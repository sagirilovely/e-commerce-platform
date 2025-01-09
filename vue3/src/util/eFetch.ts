//封装一个fetch,处理收到status401
//思路:
//其他页面中调用此处封装好的fetch
//由这里的代码负责检查status是否为401
//若为401,则将pinia中的状态置false;此时用户如果在非登录注册页,则router跳转到登录页;reject()
// 否则 pinia中的状态为true;返回res.json()

//pinia中每次都应该将状态放入local中,每次从local中取值初始化

//在路由守卫中也加一道保险:如果用户正要前往非登录注册页面,则应该检查pinia中的状态
//若状态为false,则跳至登录页
//若状态为true,则next()
interface eFetchData{
  status:number,
  data:object
}
function changeAuthenticated(isAuthenticated:boolean):void{
    //todo:更新pinia中的状态
}

function eFetch(url:string,options:RequestInit):Promise<eFetchData>{
  return(
   fetch(url,options)
     .then((res)=>{
       if(res.status===401){
          changeAuthenticated(false);
         //todo:router跳转到登录页:


         return Promise.reject({
           message:'鉴权失败'
         })
       }else{
         changeAuthenticated(true);
         return (res.json().then((data)=>{return{
           status:res.status,
           data:data
         }}));
       }
     })
     .catch((error)=>{
       console.error('Fetch Error:', error);
       return Promise.reject({
         message:"请求出错"
       });
     })
  )
}
export default eFetch;

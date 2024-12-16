import VueRouter from "vue-router";

//引入组件
import LoginPage from "../pages/LoginPage.vue";
import UserInfoPage from "../pages/UserInfoPage.vue";

const router=new VueRouter({
    routes:[
        {
            name:'LoginPage',
            path:'/login',
            component:LoginPage
        },
        {
            name:'UserInfoPage',
            path:'/user',
            component:UserInfoPage
        }
    ]
})
router.beforeEach((to,from,next)=>{
    if(to.path==='/'){
        next({ name: 'UserInfoPage' });
    }
    if(to.name!=="LoginPage"){
        console.log('1111')
        fetch('http://localhost:2233',{
            method:'POST',
            headers:{
                'content-type':'application/json',
                "authorization":JSON.parse(localStorage.getItem('authorization'))["token"]
            }
        }).then((res)=>{
            localStorage.setItem('authorization',JSON.stringify({'token':res.headers.get('authorization')}));
            console.log(res.headers.get('authorization'));
            return res.json();
        })
            .then((data)=>{
                if(data['pass']==='true' ||data['pass']===true){
                    console.log('token 验证成功,通过')
                    next();
                }else{
                    next({ name: 'LoginPage' });
            }
            }).catch((err)=>{
                console.log('从服务器拿pass时失败'+err);
            next({ name: 'LoginPage' });
        })
    }else{
        console.log('2222')
        next();
    }
})
export default router;
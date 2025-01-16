import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'

//ant-design样式
import 'ant-design-vue/dist/reset.css';
//引入自己的全局样式
import './assets/css/global.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.mount('#app')

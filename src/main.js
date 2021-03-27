import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'



createApp(App).use(router).mount('#app')
const app = createApp(App)
app.use(VueAxios, axios)


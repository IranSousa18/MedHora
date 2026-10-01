import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.css'


import '@material-design-icons/font/filled.css'
import './assets/styles/global.css'

createApp(App)
  .use(router)
  .mount('#app')
import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)

app.mount('#app')

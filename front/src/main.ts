import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import vuetify0 from './plugins/vuetify0'
import router from './router'

import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {})
app.use(router)
vuetify0(app)

app.mount('#app')

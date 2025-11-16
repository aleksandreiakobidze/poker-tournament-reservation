import { createApp } from 'vue'
import AdminPanel from './AdminPanel.vue'
import i18n from './i18n'

const app = createApp(AdminPanel)
app.use(i18n)
app.mount('#admin-app')

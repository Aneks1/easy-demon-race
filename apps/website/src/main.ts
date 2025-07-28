import { createApp } from 'vue'
import App from './App.vue'
import UI from 'ivy-ui'

createApp(App).use(UI, {
    baseColor1: '#1b1b1bff',
    baseColor2: '#1b1b1bff',
    accentColor1: '#a200ffff',
    accentColor2: '#410066ff'
}).mount('#app')
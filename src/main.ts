import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { reveal } from './reveal';
import './style.css';
createApp(App).directive('reveal', reveal).use(router).mount('#app');

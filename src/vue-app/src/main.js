import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';


const app = createApp(App);
app.provide('bootstrap', bootstrap);
app.use(router).mount('#app');
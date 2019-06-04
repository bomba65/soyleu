import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'

import {setAuth} from './api'

import * as VueMoment from 'vue-moment'
import * as moment from 'moment'
import 'moment/locale/ru'

import CKEditor from '@ckeditor/ckeditor5-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/scss/main.scss'

import wysiwyg from "vue-wysiwyg"

Vue.use(wysiwyg, {});

Vue.use(VueMoment, {moment});
Vue.use( CKEditor )

Vue.config.productionTip = false

Vue.use(BootstrapVue)

// Проверка авторизации
const token = localStorage.getItem('user-token')
if (token) {
    setAuth(token) // Добавление хидэра Authentication в параметры HTTP сервиса axios
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

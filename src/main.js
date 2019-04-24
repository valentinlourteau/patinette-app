// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueSession from 'vue-session'
import axios from 'axios'
import VueAxios from 'vue-axios'
 
//Configuration de Axios
axios.defaults.baseURL = "http://localhost:8090/patinette-0.0.1-SNAPSHOT/api/"

Vue.use(VueAxios, axios)
Vue.use(VueSession)
Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

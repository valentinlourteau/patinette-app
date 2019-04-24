import Vue from 'vue'
import Router from 'vue-router'
import Carte from '@/components/Carte'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Carte',
      component: Carte
    }
  ]
})

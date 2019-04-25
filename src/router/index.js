import Vue from 'vue'
import Router from 'vue-router'
import Carte from '@/components/Carte'
import Rechargeur from '@/components/Rechargeur'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Carte',
      component: Carte
    },
    {
      path: '/rechargeur',
      name: 'Rechargeur',
      component: Rechargeur
    }
  ]
})

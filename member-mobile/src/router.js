import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Shopping from './views/Shopping.vue'
import Team from './views/Team.vue'
import Person from './views/Person.vue'
import Wallet from './views/Wallet.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: Shopping
    },
    {
      path: '/team',
      name: 'team',
      component: Team
    },
    {
      path: '/person',
      name: 'person',
      component: Person
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet
    }
  ]
})

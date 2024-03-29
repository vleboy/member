import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import User from './views/User.vue'
import Order from './views/Order.vue'
import Bill from './views/Bill.vue'
import BillOut from './views/BillOut.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/bill',
      name: 'bill',
      component: Bill
    },
    {
      path: '/billout',
      name: 'billout',
      component: BillOut
    }
  ]
})

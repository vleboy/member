import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const domain = 'http://localhost:3636'
// const domain = 'http://192.168.3.242:3636'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openRegister: false,
    openMyAccount: false,
    openMyBill: false,
    openMyAchievement: false,
    openMyDelivery: false
  },
  mutations: {
    openRegister(state, params) {
      state.openRegister = params
    },
    openMyAccount(state, params) {
      state.openMyAccount = params
    },
    openMyBill(state, params) {
      state.openMyBill = params
    },
    openMyAchievement(state, params) {
      state.openMyAchievement = params
    },
    openMyDelivery(state, params) {
      state.openMyDelivery = params
    }
  },
  actions: {
    async login(state, data) {
      const res = await axios.post(`${domain}/xserver/auth/login`, data)
      return res.data
    },
    async reg(state, data) {
      const res = await axios.post(`${domain}/xnosql/user/insert`, data)
      return res.data
    },
    async userGet(state, data) {
      const res = await axios.get(`${domain}/xnosql/user/get/${data._id}`, data)
      return res.data
    },
    async userUpdate(state, data) {
      const res = await axios.post(`${domain}/xnosql/user/update`, data)
      return res.data
    },
    async billInsert(state, data) {
      const res = await axios.post(`${domain}/xnosql/bill/insert`, data)
      return res.data
    },
    async billQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/bill/query`, data)
      return res.data
    },
    async orderInsert(state, data) {
      const res = await axios.post(`${domain}/xnosql/order/insert`, data)
      return res.data
    }
  }
})

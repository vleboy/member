import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const domain = 'http://localhost:3636'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openRegister: false,
    openMyAccount: false,
    openMyBill: false,
    openMyAchievement: false
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
    }
  },
  actions: {
    async reg(state, data) {
      const res = await axios.post(`${domain}/gserver/xnosql/user/create`, data)
      return res.data
    },
    async login(state, data) {
      const res = await axios.post(`${domain}/gserver/auth/login`, data)
      return res.data
    }
  }
})

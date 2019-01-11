import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// const domain = `http://${window.location.hostname}:3636`
const domain = 'http://home.vleboy.com:3636'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    openRegister: false,
    openUser: false,
    openUserBill: false,
    openUserAchievement: false,
    openLoading: false
  },
  mutations: {
    openRegister(state, params) {
      state.openRegister = params
    },
    openUser(state, params) {
      state.openUser = params
    },
    openUserBill(state, params) {
      state.openUserBill = params
    },
    openUserAchievement(state, params) {
      state.openUserAchievement = params
    },
    openLoading(state, params) {
      state.openLoading = params
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
      const res = await axios.get(`${domain}/xnosql/user/get/${data._id}`)
      return res.data
    },
    async userQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/user/query`, data)
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
    async productQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/product/query`, data)
      return res.data
    },
    async orderInsert(state, data) {
      const res = await axios.post(`${domain}/xnosql/order/insert`, data)
      return res.data
    }
  }
})
export default vuex

axios.defaults.timeout = 30000;
axios.interceptors.request.use((config) => {
  config.headers.token = localStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  return config;
}, err => {
  vuex.commit("openLoading", false);
  Promise.resolve(err);
})

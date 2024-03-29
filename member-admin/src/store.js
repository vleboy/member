import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// const domain = 'http://localhost:3636'
// const domain = 'http://192.168.3.157:3636'
// const domain = 'http://miyaokang.com:80'
const domain = `http://${window.location.hostname}:80`

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    openRegister: false,
    openUserInfo: false,
    openUserBill: false,
    openUserAchievement: false,
    openLoading: false
  },
  mutations: {
    openRegister(state, params) {
      state.openRegister = params
    },
    openUserInfo(state, params) {
      state.openUserInfo = params
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
      const res = await axios.post(`${domain}/xnosql/user/page`, data)
      return res.data
    },
    async userUpdate(state, data) {
      const res = await axios.post(`${domain}/xnosql/user/update`, data)
      return res.data
    },
    async userDelete(state, data) {
      const res = await axios.get(`${domain}/xnosql/user/delete/${data._id}`)
      return res.data
    },
    async billInsert(state, data) {
      const res = await axios.post(`${domain}/xnosql/bill/insert`, data)
      return res.data
    },
    async billQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/bill/page`, data)
      return res.data
    },
    async billUpdate(state, data) {
      const res = await axios.post(`${domain}/xnosql/bill/update`, data)
      return res.data
    },
    async serverBillQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/serverBill/page`, data)
      return res.data
    },
    async productQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/product/query`, data)
      return res.data
    },
    async orderQuery(state, data) {
      const res = await axios.post(`${domain}/xnosql/order/page`, data)
      return res.data
    },
    async orderInsert(state, data) {
      const res = await axios.post(`${domain}/xnosql/order/insert`, data)
      return res.data
    },
    async orderUpdate(state, data) {
      const res = await axios.post(`${domain}/xnosql/order/update`, data)
      return res.data
    },
    async achievementQuery(state, data) {
      const res = await axios.post(`${domain}/xserver/achievement/query`, data)
      return res.data
    },
    async achievementStat(state, data) {
      const res = await axios.post(`${domain}/xserver/achievement/stat`, data)
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
  if (err.response.status == 401) {
    localStorage.clear()
    window.location.href = window.location.href.split('#')[0]
  }
  vuex.commit("openLoading", false);
  Promise.resolve(err);
})

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const domain = 'http://localhost:3636'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: false
  },
  mutations: {
    changeDrawer(state, params) {
      state.drawer = params
    }
  },
  actions: {
    async spanDAG(state, data) {
      if (data.serviceName) {
        const res = await axios.get(`${domain}/nodetracing/echart/dag/${data.serviceName}`)
        return res.data
      } else {
        return {}
      }
    },
  }
})
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader)

Vue.use(Vuetify, {
  iconfont: 'md',
})

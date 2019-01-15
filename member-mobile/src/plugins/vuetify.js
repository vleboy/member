import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader)

import VueQr from 'vue-qr'
Vue.component('vue-qr', VueQr);

Vue.use(Vuetify, {
  iconfont: 'md',
})

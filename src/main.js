// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import msal from 'vue-msal'
import Axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'
import { server } from '@/helper'

Vue.use(VueSweetalert2)

Vue.config.productionTip = false

Vue.prototype.$http = Axios
const token = localStorage.getItem('token')

if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = token
}

Vue.use(msal, {
  auth: {
    clientId: 'e6c8b48b-cbab-433a-9b92-dcc7d4975435',
    tenantId: 'd2d2794a-61cc-4823-9690-8e288fd554cc',
    redirectUri: `${server.callbackURL}`,
  },
  request: { // Group
    scopes: ['user.read', 'profile', 'offline_access'],
  },
  graph: {
    callAfterInit: true,
    endpoints: {
      profile: '/me',
      photo: { url: '/me/photo/$value', responseType: 'blob', force: true },
    },
  },
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')

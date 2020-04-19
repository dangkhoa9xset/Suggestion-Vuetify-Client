<template>
  <router-view />
</template>

<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  import axios from 'axios'
  import { server } from '@/helper'
  import { msalMixin } from 'vue-msal'
  export default {
    name: 'App',
    mixins: [msalMixin],
    computed: {
      isLoggedIn: function () { return this.$store.getters.isLoggedIn },
    },
    created: async function () {
      this.$store.commit('SET_DRAWER', false)
      this.$store.commit('SET_APPBAR', false)
      const vm = this
      axios.interceptors.response.use(undefined, function (err) {
        return new Promise(function (resolve, reject) {
          const statusCode = err.response.status
          if (statusCode === 401 && err.config && !err.config.__isRetryRequest) {
            vm.showAlert()
          }
          throw err
        })
      })
      if (this.$msal.isAuthenticated()) {
        this.$store.commit('auth_request')
        console.warn('commit: ' + this.$store.getters.authStatus)
        console.warn('Log from App.vue: ' + this.$store.getters.isLoggedIn)
        if (!this.isLoggedIn) {
          this.loginwithMS()
        }
      } else {
        if (this.$router.currentRoute.name !== 'Login') {
          this.$router.push({ name: 'Login' })
        }
      }
    },
    methods: {
      async checkisloggedin () {
        const headersRequest = {
          Authorization: localStorage.getItem('token'),
        }
        await axios.get(`${server.baseURL}/user/isloggedin`, { headers: headersRequest }).then(response => {
        }).catch(async err => {
          if (err.response.data.statusCode === 401) {
            await this.$store.dispatch('logout')
            this.$router.push({ name: 'Login' })
          }
        })
      },
      showAlert () {
        // Use sweetalert2
        this.$swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Your session has been expired!',
          footer: '<a href>Why do I have this issue?</a>',
          confirmButtonText: 'Refresh',
        }).then((result) => {
          if (result.value) {
            this.loginwithMS()
          }
        })
      },
      async loginwithMS () {
        let accessToken
        while (!accessToken) {
          await this.$msal.acquireToken().catch(err => console.error(err))
          accessToken = this.$msal.data.accessToken
        }
        localStorage.setItem('msToken', 'Bearer ' + accessToken)
        await this.$store.dispatch('loginwithmicrosoft', { accessToken })
          .then((response) => {
            // if (this.$router.currentRoute.name === 'Login') {
            //   this.$router.push({ name: 'Dashboard' })
            // } else {
            //   window.location.reload()
            // }
            setTimeout(() => window.location.reload(), 1000)
          })
          .catch(err => {
            throw err
          })
        var msToken = 'Bearer ' + this.$msal.data.accessToken
        this.$store.dispatch('getUserPhoto', msToken)
        console.warn('Log from App.vue: ' + this.$msal.data.accessToken)
        console.warn('Log from App.vue: ' + this.$store.getters.isLoggedIn)
      },
    },
  }
</script>

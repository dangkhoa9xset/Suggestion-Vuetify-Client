import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { server } from '@/helper'
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    appbar: null,
    email: null,
    jobTitle: null,
    userPhoto: null,
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_APPBAR (state, payload) {
      state.appbar = payload
    },
    SET_EMAIL (state, payload) {
      state.email = payload
    },
    SET_JOBTITLE (state, payload) {
      state.jobTitle = payload
    },
    SET_USERPHOTO (state, payload) {
      state.userPhoto = payload
    },
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
      commit('auth_request')
      axios({ url: `${server.baseURL}/user/login`, data: user, method: 'POST' })
          .then(resp => {
          const token = resp.data.token
          const user = resp.data.user
          console.warn(token)
          localStorage.setItem('token', 'Bearer ' + token)
          localStorage.setItem('user', JSON.stringify(user))
          commit('SET_EMAIL', resp.data.user.mail)
          commit('SET_JOBTITLE', resp.data.user.jobTitle)
          // Add the following line:
          axios.defaults.headers.common.Authorization = 'Bearer ' + token
          commit('auth_success', token, user)
          resolve(resp)
          })
          .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err.response.data.message)
          })
      })
    },
    loginwithmicrosoft ({ commit, dispatch }, mstoken) {
      return new Promise((resolve, reject) => {
      commit('auth_request')
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }
      axios.post(`${server.baseURL}/user/loginwithmicrosoft`, mstoken, headers)
      .then(resp => {
        const token = resp.data.token
        const user = resp.data.user
        console.warn('Log from auth.js: ' + token)
        localStorage.setItem('token', 'Bearer ' + token)
        localStorage.setItem('user', JSON.stringify(user))
        commit('SET_EMAIL', resp.data.user.mail)
        commit('SET_JOBTITLE', resp.data.user.jobTitle)
        // Add the following line:
        var msToken = localStorage.getItem('msToken')
        dispatch('getUserPhoto', msToken)
        axios.defaults.headers.common.Authorization = 'Bearer ' + token
        commit('auth_success', token, user)
        resolve(resp)
        })
        .catch(err => {
        commit('auth_error')
        localStorage.removeItem('token')
        console.warn(err.response.data.message)
        reject(err.response.data.message)
        })
      })
    },
    register ({ commit }, user) {
      return new Promise((resolve, reject) => {
      commit('auth_request')
      axios({ url: `${server.baseURL}/user/register`, data: user, method: 'POST' })
          .then(resp => {
          const token = resp.data.token
          const user = resp.data.user
          localStorage.setItem('token', 'Bearer ' + token)
          localStorage.setItem('user', JSON.stringify(user))
          // Add the following line:
          axios.defaults.headers.common.Authorization = 'Bearer ' + token
          commit('auth_success', token, user)
          resolve(resp)
          })
          .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('token')
          reject(err)
          })
      })
    },
    getUserPhoto ({ commit }, msToken) {
      return new Promise((resolve, reject) => {
        const headersRequest = {
          Authorization: msToken,
        }
        axios({ url: 'https://graph.microsoft.com/v1.0/me/photo/$value', method: 'GET', headers: headersRequest, responseType: 'arraybuffer' })
            .then(resp => {
            const photo = 'data:' + resp.headers['content-type'] + ';base64,' + Buffer.from(resp.data, 'binary').toString('base64')
            commit('SET_USERPHOTO', photo)
            localStorage.setItem('userPhoto', photo)
            resolve(resp)
            })
            .catch(err => {
            console.warn('Profile photo not found!')
            reject(err)
            })
        })
    },
    logout ({ commit }) {
      return new Promise((resolve) => {
      commit('logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userPhoto')
      delete axios.defaults.headers.common.Authorization
      resolve()
      })
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
})

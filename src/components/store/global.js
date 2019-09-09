import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    user: {
      status: null,
      accessToken: ''
    }
  },
  getters: {
    status(state) {
      return state.user.status
    },
    accessToken(state) {
      return state.user.accessToken
    }
  },
  mutations: {
    LOGIN(state) {
      
    },
    GET_LOGIN_STATUS(state) {
      
    },
    SERVER_LOGIN(state) {

    },
  },
  actions: {
    login(context) {
      context.commit('LOGIN')
    },
    getLoginStatus(context) {
      context.commit('GET_LOGIN_STATUS')
    },
    serverLogin(context) {
      context.commit('SERVER_LOGIN')
    }
  }
})

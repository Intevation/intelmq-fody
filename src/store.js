import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  serverURI: '',
  user: null,
  token: null,
  userInfo: {
    messages: [],
    notifications: [],
    tasks: []
  },
  // Map email addresses to their status. The status is a string. It can
  // be either the empty string or 'disabled'. An empty string means the
  // email address is enabled. Email addresses not in emailStatusMap are
  // also considered to be enabled.
  emailStatusMap: {}
}

const mutations = {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_EMAIL_STATUS (state, payload) {
    Vue.set(state.emailStatusMap, payload.email,
            payload.value ? '' : 'disabled')
  }
}

export default new Vuex.Store({
  state,
  mutations
})

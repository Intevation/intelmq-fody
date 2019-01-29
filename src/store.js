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
  // Map email addresses to
  //  { status: String, tags: Object, lastFetched: Date }
  // Status can be either the empty string or 'disabled'.
  // An empty string means the email address is enabled.
  // Email addresses not in emailStatusMap are also considered to be enabled.
  //
  // lastFetched is a Date object that holds the last time this email address
  // was asked to be queried
  //
  // tags contains the tags associated with the email address. Each tag
  // has a category and a tag in that category. There may be only one
  // tag per category. Therefore the categories are represented as the
  // attributes of objects and the associated value, a string, is the
  // tag.
  emailStatusMap: {}
}

function updateEmailStatus (email, callback) {
  var status
  if (email in state.emailStatusMap) {
    status = state.emailStatusMap[email]
  } else {
    status = {
      'status': '',
      'lastFetched': Date.now(),
      'tags': {}
    }
  }
  callback(status)
  Vue.set(state.emailStatusMap, email, status)
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
    updateEmailStatus(payload.email, status => {
      status.status = payload.value ? '' : 'disabled'
      status.lastFetched = Date.now()
    })
  },
  SET_EMAIL_TAG (state, payload) {
    updateEmailStatus(payload.email, status => {
      if (payload.tag) {
        Vue.set(status.tags, payload.category, payload.tag)
      } else {
        Vue.delete(status.tags, payload.category)
      }
    })
  },
  SET_EMAIL_TAGS (state, payload) {
    updateEmailStatus(payload.email, status => {
      status.tags = payload.tags
    })
  }
}

function emailURL (email) {
  return '/api/contactdb/email/' + email
}

const actions = {
  SET_EMAIL_STATUS (context, payload) {
    // first assume that we well be able to set the status on the server
    // and change our internal status early to show that this is in progress.
    // We need to remember the previous state to go back, if there is a failure.
    var lastStatus = state.emailStatusMap[payload.email].status
    context.commit('SET_EMAIL_STATUS',
                   {'email': payload.email, 'value': payload.value})

    // Then try committing the change to the server
    Vue.http.put(emailURL(payload.email), {enabled: payload.value})
      .catch(response => {
        console.log('Setting email status failed. email = ' + payload.email +
                    ', status code = ' + response.status +
                    ' (' + response.statusText + ').')
        // go back to last value on failure
        context.commit('SET_EMAIL_STATUS',
                       {'email': payload.email, 'value': lastStatus})
      })
  },
  FETCH_EMAIL_STATUS (context, email) {
    Vue.http.get(emailURL(email)).then(response => {
      response.json().then((value) => {
        context.commit('SET_EMAIL_STATUS', {email: email, value: value.enabled})
        context.commit('SET_EMAIL_TAGS', {email: email, tags: value.tags})
      })
    }, response => {
      console.log('Fetching email status failed. email = ' + email +
                  ', status code = ' + response.status +
                  ' (' + response.statusText + ').')
    })
  },
  GET_EMAIL_STATUS (context, email) {
    if (!(email in state.emailStatusMap)) {
      // we need to fetch it the first time
      // assume email address is enabled and start request to get real value
      context.commit('SET_EMAIL_STATUS', {'email': email, 'value': ''})
      context.dispatch('FETCH_EMAIL_STATUS', email)
    } else if (Date.now() - state.emailStatusMap[email].lastFetched >
               30 * 1000) {
      // re-fetch after some time
      // keep old value, but indicate start of request by setting lastFetched
      context.commit('SET_EMAIL_STATUS',
        {'email': email,
          'value': state.emailStatusMap[email].status})
      context.dispatch('FETCH_EMAIL_STATUS', email)
    }
    // otherwise do nothing
  },
  SET_EMAIL_TAG (context, payload) {
    var lastTag = state.emailStatusMap[payload.email].tags[payload.category]
    context.commit('SET_EMAIL_TAG', payload)

    // Then try committing the change to the server
    Vue.http.put(emailURL(payload.email),
                 {tags: state.emailStatusMap[payload.email].tags})
      .catch(response => {
        console.log('Setting email tags failed. email = ' + payload.email +
                    ', status code = ' + response.status +
                    ' (' + response.statusText + ').')
        // go back to last value on failure
        context.commit('SET_EMAIL_TAG',
                       {'email': payload.email, 'category': payload.category, 'tag': lastTag})
      })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})

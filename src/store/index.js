import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  mutations: {
    setAuthenticated(state, value) {
      state.isAuthenticated = value
      localStorage.setItem('isAuthenticated', value)
    },
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthenticated', true)
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('setAuthenticated', false)
      commit('clearUser')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    }
  }
})

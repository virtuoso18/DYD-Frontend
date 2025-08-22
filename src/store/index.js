import { createStore } from 'vuex'

export default createStore({
  state: {
    // screen mode
    isDarkModeActivated: false,

    // Authentication
    isAuthenticated: false,
    token: '',
    user: null,   // 👈 store user JSON here

    isLoading: false,
    primary_color: '',
    root_api: 'http://127.0.0.1:8000/',
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getUserName: (state) => state.user?.full_name || state.user?.email || ''
  },

  mutations: {
    // theme
    changeMainThemeColor(state, color_code) {
      state.primary_color = color_code
    },
    toggleDarkModeTrue(state) {
      state.isDarkModeActivated = true
    },
    toggleDarkModeFalse(state) {
      state.isDarkModeActivated = false
    },

    // auth
    initializeStore(state) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token) {
        state.token = token
        state.isAuthenticated = true
      } else {
        state.token = ''
        state.isAuthenticated = false
      }

      if (user) {
        state.user = JSON.parse(user)
      } else {
        state.user = null
      }
    },

    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    removeUser(state) {
      state.user = null
      localStorage.removeItem('user')
    },

    setToken(state, token) {
      localStorage.setItem('token', token)
      state.token = token
      state.isAuthenticated = true
    },
    removeToken(state) {
      state.token = ''
      localStorage.removeItem('token')
      state.isAuthenticated = false
    },

    setIsLoading(state, status) {
      state.isLoading = status
    },
  },

  actions: {
    login({ commit }, { token, user }) {
      commit('setToken', token)
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('removeToken')
      commit('removeUser')
    }
  }
})

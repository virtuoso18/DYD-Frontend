import { createStore } from "vuex";

export default createStore({
  state: {
    // screen mode
    isDarkModeActivated: false,
    HomePageTryFeeSelectedFile: null,
    // Authentication
    isAuthenticated: false,
    token: "",
    user: null, // 👈 store user JSON here

    isLoading: false,
    primary_color: '',
   websockets_address:'ws://localhost:8000',
    root_api: 'http://127.0.0.1:8000/',
    root_media_api: 'http://127.0.0.1:8000',
  //  websockets_address:'wss://x84jzbcq98izuo-8000.proxy.runpod.net',
  //   root_api: 'https://x84jzbcq98izuo-8000.proxy.runpod.net/',
  //   root_media_api: 'https://x84jzbcq98izuo-8000.proxy.runpod.net',
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getUserName: (state) => state.user?.full_name || state.user?.email || "",
    getSelectedFile: (state) => state.HomePageTryFeeSelectedFile,
    getSelectedFileName: (state) =>
      state.HomePageTryFeeSelectedFile ? state.HomePageTryFeeSelectedFile.name : "",
  },

  mutations: {
    // theme
    changeMainThemeColor(state, color_code) {
      state.primary_color = color_code;
    },
    toggleDarkModeTrue(state) {
      state.isDarkModeActivated = true;
    },
    toggleDarkModeFalse(state) {
      state.isDarkModeActivated = false;
    },

    // auth
    initializeStore(state) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      } else {
        state.token = "";
        state.isAuthenticated = false;
      }

      if (user) {
        state.user = JSON.parse(user);
      } else {
        state.user = null;
      }
    },

    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    removeUser(state) {
      state.user = null;
      localStorage.removeItem("user");
    },

    setToken(state, token) {
      localStorage.setItem("token", token);
      state.token = token;
      state.isAuthenticated = true;
    },
    removeToken(state) {
      state.token = "";
      localStorage.removeItem("token");
      state.isAuthenticated = false;
    },

    setIsLoading(state, status) {
      state.isLoading = status;
    },
    setSelectedFile(state, file) {
      state.HomePageTryFeeSelectedFile = file;
    },

    clearSelectedFile(state) {
      state.HomePageTryFeeSelectedFile = null;
    },
  },

  actions: {
    login({ commit }, { token, user }) {
      commit("setToken", token);
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("removeToken");
      commit("removeUser");
    },
  },
});

import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    preferences: { unit: 'C' } 
  },
  mutations: {
    SET_USER(state, user) { 
      state.user = user; 
      state.isAuthenticated = true; 
    },
    CLEAR_USER(state) { 
      state.user = null; 
      state.isAuthenticated = false; 
    },
    UPDATE_PREF(state, p) { 
      state.preferences = { ...state.preferences, ...p }; 
    },
    ADD_FAVORITE(state, city) {
      if (state.user && !state.user.favorites.includes(city)) {
        state.user.favorites.push(city);
      }
    }
  },
  actions: {
   
    login({ commit }, { email, password }) {
      if (email && password.length >= 4) {
        commit('SET_USER', {
          name: email.split('@')[0],
          email,
          favorites: ['Londres', 'Tokio', 'Nueva York']
        });
        return Promise.resolve();
      }
      return Promise.reject(new Error('Usuario o contraseña incorrectos'));
    },

  
    register({ commit }, { email, password }) {
      if (email && password.length >= 4) {
        commit('SET_USER', {
          name: email.split('@')[0],
          email,
          favorites: [] 
        });
        return Promise.resolve();
      }
      return Promise.reject(new Error('Datos inválidos para el registro'));
    },

   
    logout({ commit }) { 
      commit('CLEAR_USER'); 
    }
  }
});
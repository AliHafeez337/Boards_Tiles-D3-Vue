import Vue from 'vue';
import Vuex from 'vuex';

import board from './board/board';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    board
  }
});
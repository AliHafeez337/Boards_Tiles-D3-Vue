import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import board from './board/board';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    modalTile: false,
    modalSection: false,
    modalBoard: false
  },
  mutations,
  actions,
  getters,
  modules: {
    board
  }
});
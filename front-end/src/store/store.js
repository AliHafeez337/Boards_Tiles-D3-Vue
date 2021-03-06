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
    modalBoard: false,
    modalColor: false,
    color: '',
    modalDetails: false,
    tile: {},
    profile: {},
    token: '' || sessionStorage.getItem('token'),
    modalProfile: false,
    modalUser: false,
    modalImport: false,
    logs: [],
    recenter: false,
    messages: [],
  },
  mutations,
  actions,
  getters,
  modules: {
    board
  }
});
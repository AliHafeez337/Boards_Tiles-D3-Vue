import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

Vue.use(Vuex);

const state = {
  board: '',
  boards: [],
  sections: [],
  sectionName: [],
  tiles: [],
  labels: [],
  sections1: [],
  sectionName1: [],
  tiles1: [],
  labels1: [],
  zoom: {
    k: null,
    x: null,
    y: null
  },
  search: null,
  err: false,
  errmsg: ''
}

export default {
  state,
  mutations,
  actions,
  getters
}
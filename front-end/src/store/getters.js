const getters = {
  getModalTile: function(state) {
    return state.modalTile;
  },
  getModalSection: function(state) {
    return state.modalSection;
  },
  getModalBoard: function(state) {
    return state.modalBoard;
  },
  getModalColor: function(state) {
    return state.modalColor;
  },
  getColor: function(state) {
    return state.color;
  },
  getModalDetails: function(state) {
    return state.modalDetails;
  },
  getTile: function(state) {
    return state.tile;
  },
  getProfile: function(state) {
    return state.profile;
  },
  getToken: function(state) {
    return state.token;
  },
  getModalProfile: function(state) {
    return state.modalProfile;
  },
  getModalUser: function(state) {
    return state.modalUser;
  },
  getModalImport: function(state) {
    return state.modalImport;
  },
  getLogs: function(state) {
    return state.logs;
  },
  getRecenter: function(state) {
    return state.recenter;
  },
  getMessages: function(state) {
    return state.messages;
  }
}

export default getters;
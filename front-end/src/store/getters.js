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
  }
}

export default getters;
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Schema.ObjectId;

const TileSchema = new mongoose.Schema({
  board: {
    type: ObjectId,
    required:true,
    ref: 'Board',
  },
  id: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#999'
  },
  backLeft: {
    type: Boolean,
    default: false
  },
  backLTitle: {
    type: String,
    default: ''
  },
  backRight: {
    type: Boolean,
    default: false
  },
  backRTitle: {
    type: String,
    default: ''
  },
  event_name: {
    type: String,
    default: ''
  },
  event_due: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

TileSchema.methods.toJSON = function () {
  var a = this;
  var aObject = a.toObject();
  var picked = _.pick(aObject,
    [
      'board',
      '_id',
      'id',
      'name',
      'x',
      'y',
      'color',
      'backLeft',
      'backLTitle',
      'backRight',
      'backRTitle',
      'event_name',
      'event_due',
      'createdAt'
    ]);

  return picked;
};

const Tile = mongoose.model('Tile', TileSchema);

module.exports = Tile;
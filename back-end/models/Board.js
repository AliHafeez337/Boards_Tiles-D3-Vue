const mongoose = require('mongoose');
const _ = require("lodash");

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

BoardSchema.methods.toJSON = function () {
  var a = this;
  var aObject = a.toObject();
  var picked = _.pick(aObject,
    [
      '_id',
      'name',
      'createdAt'
    ]);

  return picked;
};

const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Schema.ObjectId;

const LabelSchema = new mongoose.Schema({
  board: {
    type: ObjectId,
    required:true,
    ref: 'Board',
  },
  tile: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'white'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

LabelSchema.methods.toJSON = function () {
  var a = this;
  var aObject = a.toObject();
  var picked = _.pick(aObject,
    [
      'board',
      '_id',
      'tile',
      'color',
      'createdAt'
    ]);

  return picked;
};

const Label = mongoose.model('Label', LabelSchema);

module.exports = Label;
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Schema.ObjectId;

const SectionSchema = new mongoose.Schema({
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
  max_trucks: {
    type: Number,
    default: 2
  },
  max_trailers: {
    type: Number,
    default: 2
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
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
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

SectionSchema.methods.toJSON = function () {
  var a = this;
  var aObject = a.toObject();
  var picked = _.pick(aObject,
    [
      'board',
      '_id',
      'id',
      'name',
      'max_trucks',
      'max_trailers',
      'width',
      'height',
      'x',
      'y',
      'color',
      'createdAt'
    ]);

  return picked;
};

const Section = mongoose.model('Section', SectionSchema);

module.exports = Section;
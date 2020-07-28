const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Schema.ObjectId;

const HistorySchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required:true,
    ref: 'User',
  },
  change: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    default: function() {
      let d = new Date
      return d.getTime()
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

HistorySchema.methods.toJSON = function () {
  var a = this;
  var aObject = a.toObject();
  var picked = _.pick(aObject,
    [
      '_id',
      'user',
      'change',
      'time',
      'createdAt'
    ]);

  return picked;
};

const History = mongoose.model('History', HistorySchema);

module.exports = History;
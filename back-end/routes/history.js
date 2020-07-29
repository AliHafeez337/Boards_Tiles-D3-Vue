const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Types.ObjectId;

// Loading models
const History = require('../models/History');

// Local imports
const { ensureAuthenticated, adminAuthenticated } = require('../auth/auth');

router.get(
  '/get',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  adminAuthenticated,
  async (req, res) => {
    
    await History
      .find({ time: { $gte: req.query.from, $lte: req.query.to } })
      .populate('user', [ 'email', 'name', 'usertype', 'createdAt' ])
      .exec(function (err, history) {
        if (err) {
          res.status(400).send({
            errmsg: "Error...",
            err
          })
        }
        if (history.length){
          res.status(200).send(history.reverse())
        } else {
          res.status(400).send({
            errmsg: "No history found..."
          })
        }
      });
  }
)

router.delete(
  '/delete/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  adminAuthenticated,
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){

      const del = await History.deleteOne({'_id': req.params.id})
      if (del.deletedCount){
        res.status(200).send({
          msg: "History is deleted successfully..."
        })
      } else {
        res.status(400).send({
          errmsg: "Nothing to delete..."
        })
      }
    } else {
      res.status(400).send({
        errmsg: "Please specify a valid id..."
      })
    }
  }
)

module.exports = router;
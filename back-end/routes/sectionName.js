const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Schema.ObjectId;

// Loading models
const Board = require('../models/Board');
const Section = require('../models/Section');
const SectionName = require('../models/SectionName');

// Local imports
const { ensureAuthenticated, adminAuthenticated } = require('../auth/auth');

// Update a sectionName
router.patch(
  '/update/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      var body = null

      if (req.user.usertype === 'admin'){
        console.log("Admin is updating the sectionName.")

        var body = _.pick(req.body, [
          // 'board',
          // 'id',
          // 'name',
          'width',
          'height',
          'x',
          'y',
          'color'
        ])
      }
      if (req.user.usertype === 'user'){
        console.log("User is updating the sectionName.")
        
        var body = _.pick(req.body, [
          'color'
        ])
      }
      
      if (body) {
        var sectionName = await SectionName.findByIdAndUpdate(req.params.id, body, { new: true })

        if (sectionName){
          res.status(200).send({
            msg: "SectionName updated successfully...",
            sectionName
          })
        } else {
          res.status(400).send({
            errmsg: "Coudn't update the sectionName..."
          })
        }
      } else {
        res.status(400).send({
          errmsg: "You are not authorized to update the sectionName..."
        })
      }
    } else {
      res.status(400).send({
        errmsg: "Please specify a valid id..."
      })
    }
  }
)

// Get all sectionNames of a board
router.get(
  '/getAll',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  async (req, res) => {
    if (req.query.board.match(/^[0-9a-fA-F]{24}$/)){
      SectionName.find({ 'board': req.query.board })
        .exec(function(err, sectionNames){
          if (err){
            res.status(400).send({
              errmsg: "No sectionNames found..."
            })
          }
          if (sectionNames.length){
            res.status(200).send({
              sectionNames
            })
          } else {
            res.status(400).send({
              errmsg: "No sectionNames found..."
            })
          }
        });
    } else {
      res.status(400).send({
        errmsg: "Please specify a valid board id..."
      })
    }
  }
)

module.exports = router;
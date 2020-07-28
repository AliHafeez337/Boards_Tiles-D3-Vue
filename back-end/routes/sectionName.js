const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Schema.ObjectId;

// Loading models
const Board = require('../models/Board');
const History = require('../models/History');
const SectionName = require('../models/SectionName');

// Local imports
const { ensureAuthenticated } = require('../auth/auth');

// Update a sectionName
router.patch(
  '/update/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      const sectionName1 = await SectionName.findById(req.params.id)
      const board1 = await Board.findById(sectionName1.board)

      var body = null, x = false, y = false, color = false

      var body = null

      if (req.user.usertype === 'admin'){
        console.log("Admin is updating the sectionName.")

        var body = _.pick(req.body, [
          'width',
          'height',
          'x',
          'y',
          'color'
        ])
        
        if (body.x !== sectionName1.x){
          x = true
        }
        if (body.y !== sectionName1.y){
          y = true
        }
        if (body.color !== sectionName1.color){
          color = true
        }
      }
      if (req.user.usertype === 'user'){
        console.log("User is updating the sectionName.")
        
        var body = _.pick(req.body, [
          'color'
        ])
        
        if (body.color !== sectionName1.color){
          color = true
        }
      }
      
      if (body) {
        var sectionName = await SectionName.findByIdAndUpdate(req.params.id, body, { new: true })

        if (sectionName1.name && board1.name){
          if (x){
            var history = new History({
              user: req.user,
              change: `Updated the x of a sectionName naming '${sectionName1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
          if (y){
            var history = new History({
              user: req.user,
              change: `Updated the y of a sectionName naming '${sectionName1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
          if (color){
            var history = new History({
              user: req.user,
              change: `Updated the color of a sectionName naming '${sectionName1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
        }

        if (sectionName){
          res.status(200).send({
            msg: "SectionName updated successfully...",
            sectionName
          })
        } else {
          res.status(200).send({
            errmsg: "Coudn't update the sectionName..."
          })
        }
      } else {
        res.status(200).send({
          errmsg: "You are not authorized to update the sectionName..."
        })
      }
    } else {
      res.status(200).send({
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
            res.status(200).send({
              errmsg: "No location found..."
            })
          }
          if (sectionNames.length){
            res.status(200).send({
              sectionNames
            })
          } else {
            res.status(200).send({
              errmsg: "No location found..."
            })
          }
        });
    } else {
      res.status(200).send({
        errmsg: "Please specify a valid board id..."
      })
    }
  }
)

module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const _ = require("lodash");

var ObjectId = mongoose.Types.ObjectId;

// Loading models
const Board = require('../models/Board');
const Section = require('../models/Section');
const SectionName = require('../models/SectionName');
const Tile = require('../models/Tile');
const Label = require('../models/Label');

// Local imports
const { ensureAuthenticated, adminAuthenticated } = require('../auth/auth');

router.post(
  '/add',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminAuthenticated,
  async (req, res) => {
    var body = _.pick(req.body, ["name"])

    if (body.name){
      
      var board = new Board(body)
      board
        .save()
        .then(board => {
          res.status(200).send({
            'msg': "Board added successfully!",
            board
          });
        })
        .catch(err => {
          console.log(err)
          res.status(400).send({
            'errmsg': err
          });
        });
    } else {
      res.status(400).send({
        errmsg: "Invalid board name..."
      })
    }
  }
)

router.get(
  '/getAll',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  async (req, res) => {
    const boards = await Board.find()
    if (boards.length){
      res.status(200).send(boards)
    } else {
      res.status(400).send({
        errmsg: "No board found..."
      })
    }
  }
)

router.delete(
  '/delete/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      const del = await Board.deleteOne({'_id': req.params.id})
      if (del.deletedCount){
        await Section.deleteMany({'board': ObjectId(req.params.id)})
        await SectionName.deleteMany({'board': ObjectId(req.params.id)})
        await Tile.deleteMany({'board': ObjectId(req.params.id)})
        await Label.deleteMany({'board': ObjectId(req.params.id)})

        res.status(200).send({
          msg: "Board and all the associated sections, tiles, sectionNames and labels with that board are deleted successfully..."
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
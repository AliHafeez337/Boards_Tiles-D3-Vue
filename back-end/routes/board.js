const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");

// Loading models
const Board = require('../models/Board');

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
        res.status(200).send(del)
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
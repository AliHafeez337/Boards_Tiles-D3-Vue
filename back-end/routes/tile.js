const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");

// Loading models
const Board = require('../models/Board');
const Tile = require('../models/Tile');
const Label = require('../models/Label');

// Local imports
const { ensureAuthenticated, adminUserAuthenticated, adminUserFleetAuthenticated } = require('../auth/auth');

// Add a tile
router.post(
  '/add',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserAuthenticated,
  async (req, res) => {
    var body = _.pick(req.body, [
      'board',
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
      'event_due'
    ])

    if (!body.board.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).send({
        errmsg: "Valid board id must be provided..."
      })
    } else if (!body.name || !body.id){
      res.status(400).send({
        errmsg: "Tile name and id is required..."
      })
    } else {
      const board = await Board.findById(body.board);
      
      if (board){
        body.board = board;

        var tile = new Tile(body)
        tile
          .save()
          .then(async tile => {

            // tile = await tile.populate('board', [ '_id', 'name', 'createAt' ]);

            res.status(200).send({
              'msg': "Tile added successfully!",
              tile
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
          errmsg: "No board exists..."
        })
      }
    }
  }
)

// Update a tile by admin and user
router.patch(
  '/update/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserAuthenticated,
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      var body = _.pick(req.body, [
        'x',
        'y',
        'color',
      ])

      if (body) {
        var tile = await Tile.findByIdAndUpdate(req.params.id, body, { new: true })

        if (tile){
          res.status(200).send({
            msg: "Tile updated successfully...",
            tile
          })
        } else {
          res.status(400).send({
            errmsg: "Coudn't update the tile..."
          })
        }
      }
    } else {
      res.status(400).send({
        errmsg: "Please specify a valid id..."
      })
    }
  }
)

// Update a tile by admin, user and fleet
router.patch(
  '/update1/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserFleetAuthenticated,
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      var body = _.pick(req.body, [
        'backLeft',
        'backLTitle',
        'backRight',
        'backRTitle',
        'event_name',
        'event_due'
      ])

      if (body) {
        var tile = await Tile.findByIdAndUpdate(req.params.id, body, { new: true })

        if (tile){
          res.status(200).send({
            msg: "Tile updated successfully...",
            tile
          })
        } else {
          res.status(400).send({
            errmsg: "Coudn't update the tile..."
          })
        }
      }
    } else {
      res.status(400).send({
        errmsg: "Please specify a valid id..."
      })
    }
  }
)

// Get all tiles in a board
router.get(
  '/getAll',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserAuthenticated,
  async (req, res) => {
    if (req.query.board.match(/^[0-9a-fA-F]{24}$/)){
      Tile.find({ 'board': req.query.board })
        .exec(function(err, tiles){
          if (err){
            res.status(400).send({
              errmsg: "No tiles found..."
            })
          }
          if (tiles.length){
            res.status(200).send({
              tiles
            })
          } else {
            res.status(400).send({
              errmsg: "No tiles found..."
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

// Delete a tile
router.delete(
  '/delete/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserAuthenticated,
  async (req, res) => {
    if (req.params.id.length === 10){
      const del = await Tile.deleteOne({'id': req.params.id})
      if (del.deletedCount){

        await Label.deleteMany({'tile': req.params.id})

        res.status(200).send({
          msg: "Tile and all the associated labels with the tile are deleted..."
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
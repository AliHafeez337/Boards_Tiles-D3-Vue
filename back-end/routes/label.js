const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");

// Loading models
const Board = require('../models/Board');
const History = require('../models/History');
const Tile = require('../models/Tile');
const Label = require('../models/Label');

// Local imports
const { ensureAuthenticated, adminUserFleetAuthenticated, adminUserFleetWatcherAuthenticated } = require('../auth/auth');

// Add a label
router.post(
  '/add',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserFleetAuthenticated,
  async (req, res) => {
    var body = _.pick(req.body, [
      'board',
      'tile',
      'color'
    ])

    if (!body.board.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(200).send({
        errmsg: "Valid board id must be provided..."
      })
    } else if (!body.tile){
      res.status(200).send({
        errmsg: "Tile id must be provided..."
      })
    } else {
      const board = await Board.findById(body.board);
      const tile = await Tile.find({'id': body.tile});
      
      if (board && tile.length){
        body.board = board;

        var label = new Label(body)
        label
          .save()
          .then(async label => {
            
          if (tile[0].name && tile[0]._id && board.name && board._id){
            var history = new History({
              user: req.user,
              change: `Added a new label on '${tile[0].name}' in board '${board.name}'.`
            })
            history.save()
          }

            // tile = await tile.populate('board', [ '_id', 'name', 'createAt' ]);

            req.io.emit('messageOfUpdate', {
              type: 'new',
              subject: 'label',
              by: req.user,
              id: label._id,
              updated: label,
              tile: tile,
              board,
              message: `${req.user.name} (${req.user.usertype}) has added a label of color '${label.color}' on tile '${tile.name}', please refresh the board '${board.name}'.`
            })

            res.status(200).send({
              'msg': "Label added successfully!",
              label
            });
          })
          .catch(err => {
            console.log(err)
            res.status(200).send({
              'errmsg': err
            });
          });
      } else {
        res.status(200).send({
          errmsg: "No board or tile exists..."
        })
      }
    }
  }
)

// Delete a label
router.delete(
  '/delete/:tile',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserFleetAuthenticated,
  async (req, res) => {
    if (req.params.tile.length === 14){
      const tile = await Tile.find({'id': req.params.tile});
      const label = await Label.find({'tile': req.params.tile});
      const board = await Board.findById(tile[0].board);
      const del = await Label.deleteOne({'tile': req.params.tile})
      if (del.deletedCount){

        if (label[0].color && label[0]._id && tile[0].name && tile[0]._id && board.name && board._id){
          var history = new History({
            user: req.user,
            change: `Deleted a label of color '${label[0].color}' on tile '${tile[0].name}' in board '${board.name}'.`
          })
          history.save()
        }

        req.io.emit('messageOfUpdate', {
          type: 'delete',
          subject: 'label',
          by: req.user,
          id: label._id,
          updated: label,
          tile,
          board,
          message: `${req.user.name} (${req.user.usertype}) has deleted a label of color '${label.color}' on tile '${tile.name}', please refresh the board '${board.name}'.`
        })

        res.status(200).send({
          msg: "Labels deleted...",
          del
        })
      } else {
        res.status(200).send({
          errmsg: "Nothing to delete..."
        })
      }
    } else {
      res.status(200).send({
        errmsg: "Please specify a valid id..."
      })
    }
  }
)

// Get all labels
router.get(
  '/getAll',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminUserFleetWatcherAuthenticated,
  async (req, res) => {
    if (req.query.board.match(/^[0-9a-fA-F]{24}$/)){
      Label.find({ 'board': req.query.board })
        .exec(function(err, labels){
          if (err){
            res.status(200).send({
              errmsg: "No label found..."
            })
          }
          if (labels.length){
            res.status(200).send({
              labels
            })
          } else {
            res.status(200).send({
              errmsg: "No label found..."
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
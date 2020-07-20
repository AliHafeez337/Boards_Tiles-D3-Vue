const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");
const { MongoClient, ObjectId } = require('mongodb');

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
      res.status(200).send({
        errmsg: "Valid board id must be provided..."
      })
    } else if (!body.name || !body.id){
      res.status(200).send({
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
            res.status(200).send({
              'errmsg': err
            });
          });
      } else {
        res.status(200).send({
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
      var body = {...req.body}
      if (body.id){
        delete body.id
      }
      if (body._id){
        delete body._id
      }
      if (body.board){
        delete body.board
      }
      // console.log(body)

      if (body) {
        MongoClient.connect(
          process.env.DATABASE, 
          {
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true
          },
          async (err, client) => {
          if (err) {
            return console.log('Unable to connect to MongoDB server');
          }

          const db = client.db(process.env.DB_NAME);
          const collection = 'tiles';
          await db.collection(collection)
            .findOneAndUpdate(
              { '_id': new ObjectId(req.params.id) },
              { $set: body },
              { new: true }              
            )
            .then(async tile => {
              res.status(200).send({
                msg: "Tile updated successfully...",
                tile
              })
            })
            .catch(err => {
              console.log(err)
              res.status(200).send({
                errmsg: "Coudn't update the tile..."
              })
            })

          client.close();
        });
      }
    } else {
      res.status(200).send({
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
      var body = {...req.body}
      if (body.name){
        delete body.name
      }
      if (body.id){
        delete body.id
      }
      if (body._id){
        delete body._id
      }
      if (body.board){
        delete body.board
      }
      if (body.x){
        delete body.x
      }
      if (body.y){
        delete body.y
      }
      console.log(body)

      if (body) {
        MongoClient.connect(
          process.env.DATABASE, 
          {
            useNewUrlParser: true,
            useUnifiedTopology: true
          },
          async (err, client) => {
          if (err) {
            return console.log('Unable to connect to MongoDB server');
          }

          const db = client.db(process.env.DB_NAME);
          const collection = 'tiles';
          await db.collection(collection)
            .findOneAndUpdate(
              { '_id': new ObjectId(req.params.id) },
              { $set: body },
              { new: true }              
            )
            .then(async tile => {
              res.status(200).send({
                msg: "Tile updated successfully...",
                tile
              })
            })
            .catch(err => {
              console.log(err)
              res.status(200).send({
                errmsg: "Coudn't update the tile..."
              })
            })

          client.close();
        });
      }
    } else {
      res.status(200).send({
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

      MongoClient.connect(
        process.env.DATABASE, 
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        async (err, client) => {
        if (err) {
          return console.log('Unable to connect to MongoDB server');
        }

        const db = client.db(process.env.DB_NAME);
        const collection = 'tiles';

        await db.collection(collection)
        .find({ 'board': new ObjectId(req.query.board) })
        .toArray((err, results) => {
          if (err){
            // console.log(err)
            res.status(200).send({
              'errmsg': "Unable to find any labels for this board..."
            })
          };
          res.status(200).send(results)

          client.close();
        })
      });
    } else {
      res.status(200).send({
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

module.exports = router;
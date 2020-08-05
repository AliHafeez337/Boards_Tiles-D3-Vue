const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");
const { MongoClient, ObjectId } = require('mongodb');

// Loading models
const Board = require('../models/Board');
const History = require('../models/History');
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

            if (body.name && board.name){
              var history = new History({
                user: req.user,
                change: `Added a tile of name '${body.name}' in board '${board.name}'.`
              })
              history.save()
            }

            // tile = await tile.populate('board', [ '_id', 'name', 'createAt' ]);

            req.io.emit('messageOfUpdate', {
              type: 'new',
              subject: 'tile',
              by: req.user,
              id: tile._id,
              updated: tile,
              board,
              message: `${req.user.name} (${req.user.usertype}) has created a new tile with name ${tile.name}, please refresh the board ${board.name}.`
            })
            
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
      const tile1 = await Tile.findById(req.params.id)
      
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
      if (body.createdAt){
        delete body.createdAt
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
              const board1 = await Board.findById(tile.value.board)
              
              Object.keys(body).forEach(key => {
                if (body[key] !== tile1[key]){
                  var history = new History({
                    user: req.user,
                    change: `Updated the ${key} of a tile naming '${tile.value.name}' from board '${board1.name}'.`
                  })
                  history.save()
                }
              })

              req.io.emit('messageOfUpdate', {
                type: 'update',
                subject: 'tile',
                by: req.user,
                id: req.params.id,
                original: req.body,
                updated: tile.value,
                board: board1,
                message: `${req.user.name} (${req.user.usertype}) has updated the tile '${tile.value.name}', please refresh the board ${board1.name}.`
              })

              res.status(200).send({
                msg: "Tile updated successfully...",
                tile: tile.value
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
      const tile1 = await Tile.findById(req.params.id)

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
      // if (body.x){
      //   delete body.x
      // }
      // if (body.y){
      //   delete body.y
      // }
      if (body.createdAt){
        delete body.createdAt
      }
      // console.log(body)

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
              const board1 = await Board.findById(tile.value.board)
              
              Object.keys(body).forEach(key => {
                if (body[key] !== tile1[key]){
                  var history = new History({
                    user: req.user,
                    change: `Updated the ${key} of a tile naming '${tile.value.name}' from board '${board1.name}'.`
                  })
                  history.save()
                }
              })

              req.io.emit('messageOfUpdate', {
                type: 'update',
                subject: 'tile',
                by: req.user,
                id: req.params.id,
                original: req.body,
                updated: tile.value,
                board: board1,
                message: `${req.user.name} (${req.user.usertype}) has updated the tile '${tile.value.name}', please refresh the board ${board1.name}.`
              })

              res.status(200).send({
                msg: "Tile updated successfully...",
                tile: tile.value
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
    if (req.params.id.length === 14){
      const tile1 = await Tile.find({'id': req.params.id})
      const board = await Board.findById(tile1[0].board)
      const del = await Tile.deleteOne({'id': req.params.id})
      if (del.deletedCount){

        if (tile1[0].name && board.name){
          var history = new History({
            user: req.user,
            change: `Deleted a tile naming '${tile1[0].name}' from board '${board.name}'.`
          })
          history.save()
        }

        await Label.deleteMany({'tile': req.params.id})

        req.io.emit('messageOfUpdate', {
          type: 'delete',
          subject: 'tile & its labels',
          by: req.user,
          id: tile1[0]._id,
          original: tile1[0],
          updated: null,
          board,
          message: `${req.user.name} (${req.user.usertype}) has deleted the tile '${tile1[0].name}', please refresh the board ${board.name}.`
        })

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

// Delete a field from a tile
router.post(
  '/deleteField/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      const tile1 = await Tile.findById(req.params.id)
      
      if (
        !(
          req.body.field_name === 'name' || 
          req.body.field_name === 'backLTitle' || 
          req.body.field_name === 'backLeft' || 
          req.body.field_name === 'backRTitle' || 
          req.body.field_name === 'backRight' || 
          req.body.field_name === 'back_title' || 
          req.body.field_name === 'board' || 
          req.body.field_name === 'color' || 
          req.body.field_name === 'createdAt' || 
          // req.body.field_name === 'due1' || 
          req.body.field_name === 'event_due' || 
          req.body.field_name === 'event_name' || 
          req.body.field_name === 'id' || 
          req.body.field_name === 'x' || 
          req.body.field_name === 'y' || 
          req.body.field_name === '__v' || 
          req.body.field_name === '_id'
        )
      ){

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
            .find({ '_id': new ObjectId(req.params.id) })
            .toArray(async (err, result) => {
              if (err){
                // console.log(err)
                res.status(200).send({
                  'errmsg': "Unable to find any labels for this board..."
                })
              };
              var doc = {...result[0]}

              if  (req.body.field_name in doc){
                delete doc[req.body.field_name]

                const del = await Tile.deleteOne({'_id': doc._id})
                if (del.deletedCount){
                  
                  await db.collection(collection)
                    .save(doc)
                    .then(async tile => {
                      const board = await Board.findById(tile1.board)

                      if (tile1.name && board.name){
                        var history = new History({
                          user: req.user,
                          change: `Deleted a property ${req.body.field_name} of tile naming '${tile1.name}' from board '${board.name}'.`
                        })
                        history.save()
                      }

                      req.io.emit('messageOfUpdate', {
                        type: 'update',
                        subject: 'tile',
                        by: req.user,
                        id: tile._id,
                        original: tile1,
                        updated: tile,
                        board: tile.board,
                        message: `${req.user.name} (${req.user.usertype}) has deleted some fields/properties from the tile '${tile.name}', please refresh the board ${tile.board.name}.`
                      })

                      res.status(200).send({
                        'msg': "Tile updated successfully!",
                        tile: doc,
                        result: tile.result
                      });
                    })
                    .catch(err => {
                      console.log(err)
                      res.status(200).send({
                        'errmsg': err
                      });
                    });

                }

              } else {
                res.status(200).send({
                  'errmsg': "Unable to find this property in the tile...",
                  tile: doc
                })
              }
    
              client.close();
            })
          });  
      } else {
        res.status(401).send({
          errmsg: "Sorry, can not delete this field name..."
        });
      }
    } else {
      res.status(200).send({
        errmsg: "Please specify a valid tile id..."
      })
    }
  }
)

// Update tiles from file data
router.patch(
  '/getFile',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  async (req, res) => {
    if (req.query.board.match(/^[0-9a-fA-F]{24}$/)){
      // var board1 = {}
      const board1 = await Board.findById(req.query.board)
      
      var tiles = []

      console.log('board_id', req.query.board)
      req.body.tiles.forEach(async tile => {
        // console.log('Tile: ', tile)
        
        if (!(tile._id || tile.id || tile.x || tile.y || tile.color || tile.createdAt || tile.__v)){
          
          await MongoClient.connect(
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
              .find({ 'name': tile.name, 'board': ObjectId(req.query.board) })
              .toArray(async (err, result) => {
                if (result[0]){
                  // console.log('Tile found', result[0])
                  
                  // if (!board1.name){
                  //   board1 = await Board.findById(req.query.board)
                  // }
                  
                  await db.collection(collection)
                  .findOneAndUpdate(
                    { '_id': result[0]._id },
                    { $set: tile },
                    { new: true }              
                  )
                  .then(doc => {
                    client.close();
                    
                    Object.keys(tile).forEach(key => {
                      var history = new History({
                        user: req.user,
                        change: `Updated the ${key} of a tile naming '${tile.name}' from board '${board1.name}'.`
                      })
                      history.save()
                    })
                    tiles.push(doc)
                  })
                  .catch(e => {
                    client.close();
                    console.log(e)
                  })

                } else {
                  client.close();
                }
              })

            })

        }
      }
      )
      console.log(tiles)

      setTimeout(() => {
        req.io.emit('messageOfUpdate', {
          type: 'update',
          subject: 'tiles',
          by: req.user,
          board: board1,
          message: `${req.user.name} (${req.user.usertype}) has uploaded a file some seconds ago to update tiles, refresh the board ${board1.name} to see if there are any changes.`
        })
      }, 3000)

      res.status(200).send({
        msg: "wait..."
      })
    } else {
      res.status(200).send({
        errmsg: "Please specify a valid board id..."
      })
    }
  }
)

module.exports = router;
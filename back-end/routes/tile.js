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

// Delete a field from a tile
router.post(
  '/deleteField/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated,
  async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      
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
                    .then(tile => {
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
      
      var tiles = []

      // const da = JSON.parse(req.body.tiles)
      // console.log(da)
      // for (let index = 0; index < da.length; index++) {

      JSON.parse(req.body.tiles).forEach(async tile => {
        console.log('Tile: ', tile)
        // console.log('Tile: ', da[index])
        if (!(tile._id || tile.id || tile.x || tile.y || tile.color || tile.createdAt || tile.__v)){
        // if (!(da[index]._id || da[index].id || da[index].x || da[index].y || da[index].color || da[index].createdAt || da[index].__v)){

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
              .find({ 'name': tile.name })
              // .find({ 'name': da[index].name })
              .toArray(async (err, result) => {
                if (result[0]){
                  console.log('Tile found', result[0])
                  // Update result[0]
                  
                  await db.collection(collection)
                  .findOneAndUpdate(
                    { '_id': result[0]._id },
                    { $set: tile },
                    // { $set: da[index] },
                    { new: true }              
                  )
                  .then(doc => {
                    client.close();
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
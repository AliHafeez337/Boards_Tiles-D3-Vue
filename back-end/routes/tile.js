const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");

// Loading models
const Tile = require('../models/Tile');

// Local imports
const { ensureAuthenticated, adminAuthenticated } = require('../auth/auth');

module.exports = router;
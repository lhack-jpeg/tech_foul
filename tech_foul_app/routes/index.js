const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

router.route('/').get(controllers.getAllMatches);
// router.route('/id').get(controllers.matchcontroller.match_detail);

module.exports = router;

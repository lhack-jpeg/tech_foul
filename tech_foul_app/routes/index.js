const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

router.route('/').get(controllers.getAllMatches);
router.route('/:match_id').get(controllers.match_detail);

module.exports = router;

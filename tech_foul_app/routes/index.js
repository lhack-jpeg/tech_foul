const express = require('express')
const controllers = require('../controllers')
const wrapAsync = require('../utilities/wrapAsync')
const router = express.Router()

router.route('/').get(wrapAsync(controllers.getAllMatches))
router.route('/:match_id').get(wrapAsync(controllers.match_detail))

module.exports = router

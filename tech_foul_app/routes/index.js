const express = require('express');
const mysqlController = require('../controllers/mySQL');
const router = express.Router();

router.route('/').get(mysqlController);

module.exports = router;

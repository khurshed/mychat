const path = require('path');
const router = require('express').Router();
const SiteController = require('./../controllers/SiteController');

router.get('/',SiteController.renderIndex);


module.exports = router; 
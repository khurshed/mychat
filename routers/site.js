const path = require('path');
const router = require('express').Router();
const verify = require('./verifyToken');
const SiteController = require('./../controllers/SiteController');


router.get('/login',SiteController.renderLogin);
router.post('/login',SiteController.login);

router.get('/register', SiteController.renderRegister);
router.post('/register', SiteController.register);

router.get('/reset-password', SiteController.renderResetPassword);

router.get('/users', verify,SiteController.getUsers);

module.exports = router; 


//router.get('/', verify, (req, res) => {
  // res.json({"chat":[{"name" : "khurshed", "msg" : "hi"},{"name" : "me", "msg" : "Hello"}]});
//});
const path = require('path');
const router = require('express').Router();
const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/auth');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');







router.post('/register', async (req, res) => {
    //res.send(Object.keys(registerValidation));
	const { error } = registerValidation(req.body);
    if(error)
    res.send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist)
     return res.status(400).send("This email allready exist");
 const salt = await bcryptjs.genSalt(10);
 const hashPassword = await bcryptjs.hash(req.body.password, salt);

    const user = new User({
    	name:req.body.name,
    	email:req.body.email,
    	password:hashPassword,
    });
    try{
         const saveUser = await user.save(); 
         res.status(200).send(saveUser);
    }catch(err){
    	res.status(400).send(err.message)
    }
});

router.get('/login',(req, res) => {
    res.sendFile('login.html', {
    	root: path.join(__dirname, "../public")
    })
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if(error)
    res.send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user)
     return res.status(400).send("This email does not exist");

    bcryptjs.compare(req.body.password, user.password, function(err, result) {
      if (err){
        return res.send(err); 
      }
      if (result){
        const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET)
        return res.header('auth-token', token).status(200).send(token); 
      } else {
        return res.send("Invalid. password"); 
      }
    });
});
module.exports = router; 
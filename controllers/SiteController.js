const path = require('path');
const User = require('./../models/User');
const {registerValidation, loginValidation} = require('./../validations/auth');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');
const session = require('express-session');


exports.renderIndex = (req, res) => {
  if(typeof req.session.loggedin !== "undefined" && req.session.loggedin){
   res.sendFile('index.html', {
      root: path.join(__dirname, "../public")
    })
  }else{
    res.redirect('/site/login');
  }
}

exports.renderLogin = (req, res) => {
	res.sendFile('login.html', {
    	root: path.join(__dirname, "../public")
    })
} 

exports.login = async (req, res) => {
	const { error } = loginValidation(req.body);
    if(error)
    return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user)
     return res.status(400).send("This email does not exist");

    bcryptjs.compare(req.body.password, user.password, function(err, result) {
      if (err){
        return res.status(400).send(err); 
      }
      if (result){
        const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET);
        req.session.username = user.name;
        req.session.loggedin = true;
        return res.header('auth-token', token).status(200).send({"success" : true,"loggedin": true, "username": user.name, "id": user._id, "chatroom":req.body.chatroom, "auth_token" : token});
      } else {
        return res.status(400).send("Invalid password"); 
      }
    });
} 

exports.renderRegister = (req, res) => {
	res.sendFile('register.html', {
    	root: path.join(__dirname, "../public")
    })
}
exports.register = async (req, res) => {
	const { error } = registerValidation(req.body);
    if(error)
    res.status(400).send(error.details[0].message);

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
         //res.redirect('/site/login');
         return res.status(200).send({"success" : true,"user":saveUser});
    }catch(ex){
  
      return res.status(400).send({"success" : false,"error":ex.message});
    }
};

exports.renderResetPassword = (req, res) => {
	res.sendFile('reset-password.html', {
    	root: path.join(__dirname, "../public")
    })
}

exports.getUsers = async (req, res) => {

    const users = await User.find({}, {_id:1, name:1, email:1});
    if(!users)
     return res.status(400).send("This email does not exist");
     return res.status(200).send({"success":true, "users":users});
    bcryptjs.compare(req.body.password, user.password, function(err, result) {
      if (err){
        return res.send(err); 
      }
      if (result){
        const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET);
        req.session.username = user.name;
        req.session.loggedin = true;
        return res.header('auth-token', token).status(200).send({"success" : true,"loggedin": true, "username": user.name, "id": user._id, "chatroom":req.body.chatroom});
      } else {
        return res.send("Invalid password"); 
      }
    });
} 
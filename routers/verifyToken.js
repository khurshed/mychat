const jwt = require('jsonwebtoken');

module.exports= function(req,res,next)
{
const token = req.header('Authorization');
if(!token) 
	return res.status(401).send('Access Denied');
	try{
          const varified = jwt.verify(token, process.env.TOKEN_SECRET);
          req.user = varified;
          next();
	   }catch(error){
        res.status(400).send(error);
	   }
}
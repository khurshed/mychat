const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const moment = require('moment');
const date_ob = new Date();
const current_time = moment(date_ob.getHours() + "." + date_ob.getMinutes(),["HH.mm"]).format("hh:mm a");
const PORT = process.env.PORT || 2003;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const chatMessage = require('./models/ChatMessage');
const {messageValidation} = require('./validations/message');



dotenv.config();

//connect to db
mongoose.connect(process.env.MONGO_URL
   ,{useNewUrlParser: true, useUnifiedTopology: true}
   ).then(console.log('db connected successfully'))
    .catch(error => {
      console.log('DB Connection Error:'+ error.message);
    });

// middle ware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    name:"sid",
    resave:false,
    saveUninitialized:false,
    secret : process.env.SESSION_SECRET,
    cookie:{
      maxAge: 1000*60*60*2,
      sameSite:true,
    }
}));



// import routs
const siteRout = require('./routers/site');
const homeRout = require('./routers/home');



// Route middleware
app.use(express.json());
app.use('/site', siteRout);
app.use('/', homeRout);

app.use('/static', express.static(path.join(__dirname, 'public')));

// run when a client connect

io.on('connect', socket => {
   socket.on('user_connected', function(user) {
    socket.join(user.room_id);
    
  });
   socket.emit("message", {"message": 'Welcome to chat world', "time": current_time, "user_detail":{"name":"Admin" }});

   socket.broadcast.emit("message", {"message": "new user join us", "time": current_time, "user_detail":{"name":"Admin" }});

   socket.on("disconnect", () => {
   	io.emit("message", {"message": "A user has left the chat", "time": current_time, "user_detail":{"name":"Admin" }});
   });
   socket.on('send_message', msg => {
    msg['time'] = current_time;
    socket.broadcast.to(msg.receiver).emit('message', msg);
  });
})

server.listen(PORT, () => {
	console.log(`server running on port:${PORT}`);
});


const saveMessage = async (message) => {
  let my_message = {"message" : message.message, "sender":message.user_detail.id.toString(),"to":Math.random().toString(36).substring(1)}
  const { error } = messageValidation(my_message);
    if(error)
    return error.details[0].message;
    const chatMsg = new chatMessage({
      message:my_message.message,
      sender:my_message.sender,
      to:my_message.to
    });
    try{
         const saveMsg = await chatMsg.save();
         return  saveMsg;
    }catch(err){
      return err.message;
    }
};

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type:String,
		require: true,
		min: 6,
		max: 255
	},
	email: {
		type : String,
		require: true,
		max: 255,
		min : 3
	},
	password:{
		type : String,
		require: true,
		max: 1000,
		min : 6
	},
	chatroom:{
		type : String,
		require: false,
		max: 255,
		min : 3
	},
	date: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('User', userSchema) ;
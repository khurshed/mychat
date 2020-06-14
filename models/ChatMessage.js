const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
	message: {
		type:String,
		require: true,
		min: 1,
		max: 2048
	},
	sender: {
		type : String,
		require: true
	},
	to:{
		type : String,
		require: true
	},
	group_chat: {
		type: Number,
		default: 0
	},
	date: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('ChatMessage', chatMessageSchema) ;
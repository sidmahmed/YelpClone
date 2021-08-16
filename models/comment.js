const mongoose = require("mongoose");
const { Schema } = mongoose;

// Setup database schema
const commentSchema = new Schema({
	text: {
		type: String,
		required: [true, "Text is required"]
	},
	rating: {
		type: Number
	},
	author : {
		type: String,
		required: [true, "Author is required"]		
	}
});

module.exports = mongoose.model("Comment", commentSchema);
const mongoose = require("mongoose");
const Comment = require("./comment");

// Setup database schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: Number,
	location: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		},
	],
});

// Creating a post middleware so that we can delete all comments that

campgroundSchema.post("findOneAndDelete", async (campground) => {
	if (campground.comments.length) {
		const res = await Comment.deleteMany({ _id: { $in: campground.comments } });
		console.log(res);
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);

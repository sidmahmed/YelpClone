const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchasync.js");
const ExpressError = require("../utils/expresserror.js");
const Joi = require("joi");

const { commentSchema } = require("../schemas.js");
var Comment = require("../models/comment");

const { campgroundSchema } = require("../schemas.js");
const Campground = require("../models/campground");


// Comment Routes

// commend validation middleware
const validateComment = (req, res, next) => {
	const { error } = commentSchema.validate(req.body);

	if (error) {
		const message = error.details.map((el) => el.message).join(",");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

// CREATE route
router.get(
	"/new",
	catchAsync(async (req, res) => {
		//Collect id and find the campground
		const { id } = req.params;
		const campground = await Campground.findById(id);

		res.render("./comments/new", { campground: campground });
	})
);

router.post(
	"/",
	validateComment,
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);

		const newComment = new Comment(req.body.comment);

		campground.comments.push(newComment);
		await newComment.save();

		await campground.save();

		req.flash("success", "New comment posted!")

		res.redirect(`/campgrounds/${id}`);
	})
);

// Delete route for comment
router.delete(
	"/:commentId",
	catchAsync(async (req, res) => {
		const { commentId } = req.params;
		const { id } = req.params;
		
		// Delete reference from the campground
		await Campground.findByIdAndUpdate(id, { $pull: {comments:commentId}})
		// delete the comment
		await Comment.findByIdAndDelete(commentId);
		req.flash("success", "Successfully deleted comment!")
		res.redirect(`/campgrounds/${id}`)

	})
);

module.exports = router;
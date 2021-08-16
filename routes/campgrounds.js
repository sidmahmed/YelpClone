const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchasync.js");
const ExpressError = require("../utils/expresserror.js");
const Joi = require("joi");
const { campgroundSchema } = require("../schemas.js");
const Campground = require("../models/campground");


// Parse form request body
router.use(express.urlencoded({ extended: true }));

// Campground routes

//INDEX Route
router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds: campgrounds });
	})
);

//CREATE route
router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

//SHOW route
router.get(
	"/:id",
	catchAsync(async (req, res) => {
		//find the campground with provided ID
		const id = req.params.id;
		//Find unit
		const campground = await Campground.findById(id).populate("comments");

		// console.log(campground.comments);
		res.render("campgrounds/show", { campground: campground });
	})
);


// campground validation middleware
const validateCampground = (req, res, next) => {
	// server side validations

	const { error } = campgroundSchema.validate(req.body);

	if (error) {
		const message = error.details.map((el) => el.message).join(",");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

router.post(
	"/",
	validateCampground,
	catchAsync(async (req, res, next) => {
		const newCampground = new Campground(req.body.campground);
        
		await newCampground.save();

		// Flash Message
		req.flash('success',"Successfully made a new campground!")
		// redirect
		res.redirect(`/campgrounds/${newCampground.id}`);
	})
);

// GET route
router.get(
	"/:id/edit",
	catchAsync(async (req, res) => {
		// get id from request body
		const id = req.params.id;

		// find the campground with provided ID
		const campground = await Campground.findById(id);

		if(!campground) {
			req.flash("error", "Campground not found!");
			return res.redirect("/campgrounds");
		}

		// render the edit page and pass the campground
		res.render("campgrounds/edit", { campground: campground });
	})
);

// UPDATE ROUTE
router.put(
	"/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		// collect id from request body
		const id = req.params.id;
		// find campground provided ID and update the
		const campground = await Campground.findByIdAndUpdate(
			id,
			req.body.campground,
			{ runValidators: true, new: true }
		);

		if(!campground) {
			req.flash("error", "Campground not found!");
			return res.redirect("/campgrounds");
		}
		

		// Flash Message
		req.flash("success", "Campground updated successfully!")

		res.redirect(`/campgrounds/${campground.id}`);
	})
);

// DELETE ROUTE
router.delete(
	"/:id",
	catchAsync(async (req, res) => {
		const id = req.params.id;

		await Campground.findByIdAndDelete(id);

		// Need to delete comments on a campground

		res.redirect("/campgrounds");
	})
);

module.exports = router;

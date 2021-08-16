//Modules
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require("joi");
const session = require("express-session")
const flash = require("connect-flash");

// Utilitiees
const catchAsync = require("./utils/catchasync.js");
const ExpressError = require("./utils/expresserror.js");

// Server side error checking schemas
const { campgroundSchema } = require("./schemas.js");
const { commentSchema } = require("./schemas.js");

// Route files
const campgrounds = require("./routes/campgrounds");
const comments = require("./routes/comments");

// Connect to database
mongoose
	.connect("mongodb://localhost:27017/yelp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true
	})
	.then(() => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(`Error connecting to server: ${err}`);
	});

//import database models
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// Middleware
const { resolveMx } = require("dns");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Parse form request body
app.use(express.urlencoded({ extended: true }));

// Configuration for session cookies
const sessionConfig = {
	secret : "secretkey",
	resave: false,
	saveUninitialized: true,
	// expires after 1 week
	cookie : {
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true
	}

}
app.use(session(sessionConfig));
app.use(flash());

// Flashing middleware
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

// Using routes
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/comments", comments)

//Landing page
app.get("/", function (req, res) {
	res.render("home");
});


// Errors
app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});


//Error handler
app.use((err, req, res, next) => {
	const { statusCode = 500, message = "Something went wrong" } = err;
	if (!err.message) {
		err.message = "Oh no, something went wrong!";
	}
	if (!err.statusCode) {
		err.statusCode = 500;
	}

	res.status(statusCode).render("error", { err: err });
});

//Set us listener
app.listen(3000, function () {
	console.log("Server running on localhost:3000");
});

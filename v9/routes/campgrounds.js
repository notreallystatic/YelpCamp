const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment");

// Index: Show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user});
		}
	});
});

// New: Show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
})
// Create: Add new campgrounds to the DB
router.post("/", isLoggedIn, (req, res) => {
	// Get data from the form and add it to our array
	// Redirect back to the campgrounds page
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};	
	// Create a new Campground and save it to the DB
	Campground.create(newCampground, (err, addedCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");	
		}
	});
});
// Show: Displays details of a specific Campground
router.get("/:id", (req, res) => {
	// Find the Campground with provided ID
	// Show template of that specific Campground
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});	
		}
	});
});

// Middleware to check if a user is logged in or not?
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect("/login");
}

module.exports = router;
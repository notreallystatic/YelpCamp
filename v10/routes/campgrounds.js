const express 		= require("express"),
	  router 		= express.Router(),
	  Campground 	= require("../models/campground"),
	  Comment 		= require("../models/comment"),
	  middleware 	= require("../middleware");	// No need to write "../middleware/index.js" explicitly

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
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});
// Create: Add new campgrounds to the DB
router.post("/", middleware.isLoggedIn, (req, res) => {
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
			res.redirect("campgrounds/new");	
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
// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {

	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	// Find and update the Current campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			// Redirect somewhere
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
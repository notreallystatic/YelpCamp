const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment");

// COMMENT ROUTES

// Comments Create
router.get("/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});
// Comments Create
router.post("/", isLoggedIn, (req, res) => {
	// Lookup campground using id
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// Create new comment -> connect comment to the campground
			// Redirect to campground show page
			Comment.create(req.body.comment, (err, addedComment) => {
				if (err) {
					console.log(err);
				} else {
					foundCampground.comments.push(addedComment);
					foundCampground.save();
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
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
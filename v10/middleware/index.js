const Campgrounds 	= require("../models/campground"),
	  Comment 		= require("../models/comment");
	  
let middlewareObj 	= {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	// First of all check if a user is logged in or not
	if (req.isAuthenticated()) {
		// If User is logged in?
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				res.redirect("back");
			} else {
				// check if the user is authorized or not
				// NOTE:-> foundCampground.author.id is a "mongoose object"
				// 		-> req.user._id is a "string"
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		// If not logged in, redirect
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	// First of all check if a user is logged in or not
	if (req.isAuthenticated()) {
		// If User is logged in?
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			} else {
				// check if the user is authorized or not
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		// If not logged in, redirect
		res.redirect("back");
	}
}
// Middleware to check if a user is logged in or not?
middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect("/login");
}

module.exports = middlewareObj;
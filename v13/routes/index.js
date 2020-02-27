const express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user"),
	Campground = require("../models/campground");

router.get("/", (req, res) => {
	res.render("landing");
});

// AUTHENTICATION ROUTES

// Show Register form
router.get("/register", (req, res) => {
	res.render("register", { page: "register" });
});

// Signup Logic
router.post("/register", (req, res) => {
	var newUser = new User(
		{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			avatar: req.body.avatar
		}
	);
	// Check if the new user has the secret code
	if (req.body.isAdmin === process.env.SECRET)
		newUser.isAdmin = true;
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render("register", { error: err.message });
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp, " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// Show Login form
router.get("/login", (req, res) => {
	res.render("login", { page: "login" });
});
// Handling Login Logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {
	});

// Logout Route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

// User Profile
router.get("/users/:id", (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {
			req.flash("error", "No such user found...");
			res.redirect("/");
		} else {
			Campground.find().where('author.id').equals(foundUser._id).exec((err, foundCampgrounds) => {
				if (err) {
					req.flash("error", "No such user found...");
					res.redirect("/");
				} else {
					res.render("users/show", { user: foundUser, campgrounds: foundCampgrounds });
				}
			});
		}
	});
});

module.exports = router;
const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user");

router.get("/", (req, res) => {
	res.render("landing");
});

// AUTHENTICATION ROUTES

// Show Register form
router.get("/register", (req, res) => {
	res.render("register");	
});

// Signup Logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render("/register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds");
		});
	});
});

// Show Login form
router.get("/login", (req, res) => {
	res.render("login");
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
	res.redirect("/campgrounds");
});

// Middleware to check if a user is logged in or not?
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect("/login");
}

module.exports = router;
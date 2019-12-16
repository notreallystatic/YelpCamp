const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),
	  User = require('./models/user'),
	  Campground = require('./models/campground'),
	  seedDB = require('./seeds'),
	  Comment = require('./models/comment');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, function(error) {});

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Passport Configuration
app.use(require('express-session')({
	secret: "Million Years Ago",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To make user info available in all the routes
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.get("/", (req, res) => {
	res.render("landing");
});

// Index: Show all campgrounds
app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user});
		}
	});
});

// New: Show form to create new campground
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
})
// Create: Add new campgrounds to the DB
app.post("/campgrounds", (req, res) => {
	// Get data from the form and add it to our array
	// Redirect back to the campgrounds page
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};	
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
app.get("/campgrounds/:id", (req, res) => {
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
// Comment Routes
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// AUTHORIZATION ROUTES

// Show Register form
app.get("/register", (req, res) => {
	res.render("register");	
});

// Signup Logic
app.post("/register", (req, res) => {
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

// Login form
app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {
});

// Logout Route
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

// Middleware to check if a user is logged in or not?
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect("/login");
}

app.listen(3000, ()=> {
	console.log("YelpCamp Server has started...");
});
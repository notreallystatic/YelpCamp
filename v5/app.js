const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose'),
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

app.get("/", (req, res) => {
	res.render("landing");
});

// Index: Show all campgrounds
app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds : allCampgrounds});
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
app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", (req, res) => {
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

app.listen(3000, ()=> {
	console.log("YelpCamp Server has started...");
});
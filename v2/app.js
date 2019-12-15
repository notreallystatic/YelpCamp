const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost:27017/yelpCamp', {useNewUrlParser: true},function(error) {});


// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Winter Paradise",
// 		image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 		description: "Feel the cold night's stars dancing at your beats!"
// 	}, (err, Campground) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log("Added a new Campground!!!");
// 		}
// 	}
// )

app.get("/", (req, res) => {
	res.render("landing");
})

// Index: Show all campgrounds
app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {campgrounds : allCampgrounds});
		}
	});
})
// New: Show form to create new campground
app.get("/campgrounds/new", (req, res) => {
	res.render("new");
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
})
// Show: Displays details of a specific Campground
app.get("/campgrounds/:id", (req, res) => {
	// Find the Campground with provided ID
	// Show template of that specific Campground
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});	
		}
	});
})

app.listen(3000, ()=> {
	console.log("YelpCamp Server has started...");
})
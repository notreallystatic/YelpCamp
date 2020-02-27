const express 		= require("express"),
	  router 		= express.Router(),
	  Campground 	= require("../models/campground"),
	  Comment 		= require("../models/comment"),
	  middleware 	= require("../middleware"),  // No need to write "../middleware/index.js" explicitly
	  NodeGeocoder	= require('node-geocoder');	

let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
let geocoder = NodeGeocoder(options);

// Index: Show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user, page: "campgrounds"});
		}
	});
});

// New: Show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});
// Create: Add new campgrounds to the DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	// get data from form and add to campgrounds array
  	let name = req.body.name;
  	let image = req.body.image;
  	let desc = req.body.description;
	let price = req.body.price;
  	let author = {
		id: req.user._id,
    	username: req.user.username
  	}
  	geocoder.geocode(req.body.location,	(err, data) => {
		if (err || !data.length) {
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		let lat = data[0].latitude;
		let lng = data[0].longitude;
		let location = data[0].formattedAddress;
		let newCampground = {name: name, image: image, description: desc,price: price, author:author, location: location, lat: lat, lng: lng};
		// Create a new campground and save to DB
		Campground.create(newCampground, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else {
				//redirect back to campgrounds page
				console.log(newlyCreated);
				res.redirect("/campgrounds");
			}
		});
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
		if (err) {
			req.flash("error", "Campgrounds not found.")
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});	
		}
	});
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
      		req.flash('error', 'Invalid address');
      		return res.redirect('back');
    	}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;

		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
			if(err) {
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success","Successfully Updated!");
				res.redirect("/campgrounds/" + campground._id);
			}
		});
 	});
});
// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			req.flash("error", "Error in deleting the Campground.")
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Successfuly delete the Campground.")
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
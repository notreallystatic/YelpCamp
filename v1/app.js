const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{
			name: "Salmon Creek", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
		},
		{
			name: "Granite Hill", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
		},
		{
			name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
		}
	];

app.get("/", (req, res) => {
	res.render("landing");
})

app.get("/campgrounds", (req, res) => {
	res.render("campgrounds", {campgrounds : campgrounds});
})

app.get("/campgrounds/new", (req, res) => {
	res.render("new");
})

app.post("/campgrounds", (req, res) => {
	// Get data from the form and add it to our array
	// Redirect back to the campgrounds page
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};	
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
})

app.listen(3000, ()=> {
	console.log("YelpCamp Server has started...");
})
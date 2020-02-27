 const mongoose = require('mongoose'),
	  Campground = require('./models/campground'),
	  Comment = require("./models/comment");

var data = [
	{
		name: "Off Whites",
		image: "https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}, 
	{
		name: "Wilder Nights",
		image: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Summer Song",
		image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
];

function seedDB() {
	// Remove all Campgrounds
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.log(err);	
		} else {
			console.log("Removed Campgrounds.");
			// Comment.deleteMany({}, (err) => {
			// 	if (err) {
			// 		console.log(err);
			// 	} else {
			// 		// Add few Campgrounds
			// 		data.forEach((seed) => {
			// 			Campground.create(seed, (err, addedCampground) => {
			// 				if (err) {
			// 					console.log(err);
			// 				} else {
			// 					console.log("Added a Campground!");
			// 					// Create a Comment
			// 					Comment.create(
			// 						{
			// 							text: "This place is exquisite",
			// 							author: "FSociety"
			// 						}, (err, addedComment) => {
			// 							if (err) {
			// 								console.log(err);
			// 							} else {
			// 								addedCampground.comments.push(addedComment);
			// 								addedCampground.save();
			// 								console.log("Created new Comment!");
			// 							}
			// 						}
			// 					);
			// 				}
			// 			})
			// 		});
			// 	}
			// });
		}
	});
}

module.exports = seedDB;
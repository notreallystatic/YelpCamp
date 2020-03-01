const Campground = require('../models/campground'),
  Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // First of all check if a user is logged in or not
  if (req.isAuthenticated()) {
    // If User is logged in?
    Campground.findOne({ slug: req.params.slug }, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found.');
        res.redirect('back');
      } else {
        // check if the user is authorized or not
        // NOTE:-> foundCampground.author.id is a "mongoose object"
        // 		-> req.user._id is a "string"
        if (
          foundCampground.author.id.equals(req.user._id) ||
          req.user.isAdmin
        ) {
          next();
        } else {
          req.flash('error', 'You are not authorized to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    // If not logged in, redirect
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // First of all check if a user is logged in or not
  if (req.isAuthenticated()) {
    // If User is logged in?
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'Error in finding Comment.');
        res.redirect('back');
      } else {
        // check if the user is authorized or not
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', 'You are not authorized to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    // If not logged in, redirect
    res.redirect('back');
  }
};
// Middleware to check if a user is logged in or not?
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You need to be logged in to to do that.');
  res.redirect('/login');
};

module.exports = middlewareObj;

const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware');

// COMMENT ROUTES

// Comments Create
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findOne({ slug: req.params.slug }, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});
// Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
  // Lookup campground using id
  Campground.findOne({ slug: req.params.slug }, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // Create new comment -> connect comment to the campground
      // Redirect to campground show page
      Comment.create(req.body.comment, (err, newComment) => {
        if (err) {
          req.flash('error', 'Something went wrong.');
          console.log(err);
        } else {
          // Add username and id to comment
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          // Save the comment
          newComment.save();
          foundCampground.comments.push(newComment);
          foundCampground.save();
          req.flash('success', 'Successfully added your comment.');
          res.redirect('/campgrounds/' + foundCampground.slug);
        }
      });
    }
  });
});
// Comments Edit
router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          campground_slug: req.params.slug,
          comment: foundComment
        });
      }
    });
  }
);
//Comments Update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.redirect('/campgrounds/' + req.params.slug);
      }
    }
  );
});
//Comments Destroy Route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted.');
      res.redirect('/campgrounds/' + req.params.slug);
    }
  });
});

module.exports = router;

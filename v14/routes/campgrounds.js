const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware'), // No need to write "../middleware/index.js" explicitly
  NodeGeocoder = require('node-geocoder'),
  multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'sk92907',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

let geocoder = NodeGeocoder(options);

// Index: Show all campgrounds
router.get('/', (req, res) => {
  if (req.query.search) {
    let toSearch = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({ name: toSearch }, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        if (allCampgrounds.length < 1) {
          req.flash('error', 'No such Campground found...');
          res.redirect('/campgrounds');
        } else {
          res.render('campgrounds/index', {
            campgrounds: allCampgrounds,
            currentUser: req.user,
            page: 'campgrounds'
          });
        }
      }
    });
  } else {
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/index', {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          page: 'campgrounds'
        });
      }
    });
  }
});

// New: Show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
// Create: Add new campgrounds to the DB
router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {
  // get data from form and add to campgrounds array
  let newCampground = req.body.campground;
  newCampground.author = {
    id: req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.campground.location, (err, data) => {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    cloudinary.uploader.upload(req.file.path, (err, result) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      } else {
        // add cloudinary url for the image to the campground object under image property
        newCampground.image = result.secure_url;
        // Add image's public_id to the campground object
        req.body.campground.imageId = result.public_id;
        newCampground.lat = data[0].latitude;
        newCampground.lng = data[0].longitude;
        newCampground.location = data[0].formattedAddress;
        Campground.create(newCampground, (err, campground) => {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/campgrounds/' + campground._id);
        });
      }
    });
  });
});
// Show: Displays details of a specific Campground
router.get('/:id', (req, res) => {
  // Find the Campground with provided ID
  // Show template of that specific Campground
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});
// Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      req.flash('error', 'Campgrounds not found.');
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});
// UPDATE CAMPGROUND ROUTE
router.put(
  '/:id',
  middleware.checkCampgroundOwnership,
  upload.single('image'),
  (req, res) => {
    Campground.findById(req.params.id, async (err, campground) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      if (req.file) {
        try {
          // Delete the old image
          await cloudinary.uploader.destroy(campground.imageId);
          // Upload the new one
          let result = await cloudinary.uploader.upload(req.file.path);
          // Add cloudinary url to the image attribute of the campground object
          req.body.campground.image = result.secure_url;
          // Add image's public_id to the campground object
          req.body.campground.imageId = result.public_id;
        } catch (err) {
          req.flash('error', err);
          return res.redirect('back');
        }
      }
      try {
        let data = await geocoder.geocode(req.body.location);
        if (!data.length) throw err;
        req.body.campground.lat = data[0].latitude;
        req.body.campground.location = data[0].formattedAddress;
        req.body.campground.lng = data[0].longitude;
      } catch (err) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, campground) => {
          if (err) {
            req.flash('error', err.message);
            res.redirect('back');
          } else {
            req.flash('success', 'Successfully Updated!');
            res.redirect('/campgrounds/' + campground._id);
          }
        }
      );
    });
  }
);
// Destroy Campground Route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    // Delete the file from cloudinary
    cloudinary.uploader.destroy(campground.imageId, (err, result) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      Campground.findByIdAndRemove(req.params.id, err => {
        if (err) {
          req.flash('error', 'Error in deleting the Campground.');
          res.redirect('/campgrounds');
        } else {
          req.flash('success', 'Successfuly deleted the Campground.');
          res.redirect('/campgrounds');
        }
      });
    });
  });
});

// function for regex to help in fuzzy search
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;

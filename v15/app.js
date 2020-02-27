require('dotenv').config();
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  Campground = require('./models/campground'),
  seedDB = require('./seeds'),
  Comment = require('./models/comment'),
  methodOverride = require('method-override'),
  flash = require('connect-flash');
// Requiring Routes
const campgroundsRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  indexRoutes = require('./routes/index');

mongoose.connect(
  'mongodb://localhost:27017/yelpCamp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(error) {}
);
mongoose.set('useFindAndModify', false);

app.locals.moment = require('moment');
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// Seed the DB
//seedDB();

// Passport Configuration
app.use(
  require('express-session')({
    secret: 'Million Years Ago',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To make user info available in all the routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:slug/comments', commentRoutes);

app.listen(3000, () => {
  console.log('YelpCamp Server has started...');
});

const express = require('express'),
	app = express(),
	ejs = require('ejs'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	LocalStrategy = require('passport-local'),
	Campground = require('./models/campground'),
	User = require('./models/user'),
	// seedDB = require('./seeds'),
	Comment = require('./models/comments'),
	flash = require('connect-flash');

//Require Routes
const commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost/yelpcamp_v12', {
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//sedd the database
// seedDB();

//Passport config.
app.use(
	require('express-session')({
		secret: 'yelpcamp is my first real project',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//RESTFUL Routes
//campround routes
//comments routes
//auth routes

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, () => {
	console.log('YelpCamp Server has started!');
});
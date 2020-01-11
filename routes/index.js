const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user');

//Root route
router.get('/', (req, res) => {
	res.render('landing');
});
//Auth routes
//show register form
router.get('/register', (req, res) => {
	res.render('register');
});
//handle signup logic
//handle sign up logic
router.post("/register", function (req, res) {
	let newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register", {
				error: err.message
			});
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", `Successfully Signed Up! Nice to meet you "${req.body.username}"`);
			res.redirect("/campgrounds");
		});
	});
});
//show login form
router.get('/login', (req, res) => {
	res.render('login');
});
//handling login logic
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

//logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect('/campgrounds');
});

//login authentication
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect('/login');
// }

module.exports = router;
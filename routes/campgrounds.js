const express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require("../models/comments"),
	middleware = require("../middleware");

//Index - show all campgrounds
router.get('/', (req, res) => {
	//Get all campgrounds from the DB
	Campground.find({}, (err, allcampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {
				campgrounds: allcampgrounds,
				currentUser: req.user
			});
		}
	});
	//res.render("campgrounds", { campgrounds: campgrounds });
});
//Create - create new campgrounds
router.post('/', middleware.isLoggedIn, (req, res) => {
	//get data from form
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {
		name: name,
		price: price,
		image: image,
		description: description,
		author: author
	};
	//campgrounds.push(newCampground);
	//Create a new campground and save to the DB
	Campground.create(newCampground, (err, newCreated) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
	//redirect back to campgrounds page
	//res.redirect("/campgrounds");
});

//New - Show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

//Show - shows info. about one campground
router.get('/:id', (req, res) => {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err || !foundCampground) {
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("back");
		} else {
			console.log(foundCampground);
			//render show template with that campground
			res.render('campgrounds/show', {
				campground: foundCampground
			});
		}
	});
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
		}
		res.render("campgrounds/edit", {
			campground: foundCampground
		});
	});
});
//Update route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	//redirect somewhere?
});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
		if (err) {
			res.redirect("/campgrounds");
		}
		Comment.deleteMany({
			_id: {
				$in: campgroundRemoved.comments
			}
		}, (err) => {
			if (err) {
				console.log(err);
			}
			res.redirect("/campgrounds");
		});
	});
});

module.exports = router;
var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Location = require("../models/location"),
    Comment = require("../models/comment");

var { isLoggedIn, forwardAuthenticated } = require("../config/auth");

//INDEX ROUTE - show all locations
router.get("/", function(req, res) {
    //find the locations in database and pass them to locations page
    Location.find({}, function(error, allLocations) {
        if (error) {
            console.log(error);
        } else {
            res.render("locations/index", { locations: allLocations });
        }
    });
});

//CREATE ROUTE - add new location to database
router.post("/", isLoggedIn, function(req, res) {
    var title = req.body.title,
        images = [],
        desc = req.body.desc,
        author = {
            id: req.user._id,
            username: req.user.username
        };
    // find if location already exists by title
    Location.findOne({ title: req.body.title }, function(error, foundLocation) {
        // updating existing location
        if (foundLocation != null && ((req.user._id + "") == (foundLocation.author.id + ""))) {
            foundLocation.images.push(req.body.image);
            foundLocation.description = desc;
            foundLocation.save();
            res.redirect("/locations/" + foundLocation._id);
        }
        // creating new location 
        else {
            images.push(req.body.image);
            var newLocation = { title: title, images: images, description: desc, author: author };
            Location.create(newLocation, function(error, newLocation) {
                if (error) {
                    res.json(error);
                } else {
                    //redirect back to locations page
                    res.redirect("/locations");
                }
            });
        }
    });
});

//NEW ROUTE - show form to create new location
router.get("/new", isLoggedIn, function(req, res) {
    res.render("locations/new", { location: null });
});

//SHOW ROUTE - show description about one location
router.get("/:id", function(req, res) {
    //find the location with provided id
    Location.findById(req.params.id).populate("comments").exec(function(error, foundLocation) {
        if (error) {
            res.json(error);
        } else {
            //render show template with that location
            res.render("locations/show", { location: foundLocation });
        }
    });
});

router.get("/:id/edit", isLoggedIn, function(req, res) {
    // find location by id
    Location.findById(req.params.id, function(error, foundLocation) {
        // match current user with location's author
        if ((req.user._id + "") == (foundLocation.author.id + "")) {
            // render add location page with this locations info
            res.render("locations/new", { title: foundLocation.title, description: foundLocation.description });
        } else {
            res.json("Only creator of the post are allowed to edit it.");
        }
    });
});

router.get("/:id/delete", isLoggedIn, function(req, res) {
    // find location by id
    Location.findById(req.params.id).populate("comments").exec(function(error, foundLocation) {
        if (error) {
            res.json(error);
        } else {
            // match current user with location's author
            if ((req.user._id + "") == (foundLocation.author.id + "")) {
                // delete all comments of the location
                foundLocation.comments.forEach(function(comment) {
                    Comment.deleteOne(comment, function(error) {
                        if (error) {
                            res.json(error);
                            break;
                        }
                    });
                });
                // delete location by id
                Location.deleteOne(foundLocation, function(error) {
                    if (error) {
                        res.json(error);
                    } else {
                        // redirect to locations route
                        res.redirect("/locations");
                    }
                });
            } else {
                res.json("Only creator of the post are allowed to delete it.");
            }
        }
    });
});



module.exports = router;
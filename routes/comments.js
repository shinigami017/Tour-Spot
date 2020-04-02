var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Location = require("../models/location"),
    Comment = require("../models/comment");

var { isLoggedIn, forwardAuthenticated } = require("../config/auth");

//Comments CREATE
router.post("/", isLoggedIn, function(request, response) {
    Location.findById(request.params.id, function(error, foundLocation) {
        if (error) {
            res.json(error);

        } else {
            Comment.create({ text: request.body.text }, function(error, comment) {
                if (error) {
                    console.log(error);
                } else {
                    //add username to comment
                    comment.author.id = request.user._id;
                    comment.author.username = request.user.username;
                    //save comment
                    comment.save();
                    foundLocation.comments.push(comment);
                    foundLocation.save();
                    response.redirect("/locations/" + foundLocation._id);
                }
            });
        }
    });
});

router.get("/:cid/delete", isLoggedIn, function(req, res) {
    // find location by id 
    Location.findById(req.params.id).populate("comments").exec(function(error, foundLocation) {
        if (error) {
            res.json(error);

        } else {
            // then find comment by id
            Comment.findById(req.params.cid, function(error, foundComment) {
                if (error) {
                    res.json(error);

                } else {
                    // match comment's author with current user
                    if (("" + req.user._id) == ("" + foundComment.author.id)) {
                        // then remove this comment instance from location then delete comment too
                        let index = foundLocation.comments.indexOf(foundComment);
                        if (index > -1) { foundLocation.comments.splice(index, 1); }
                        Comment.deleteOne(foundComment, function(error) {
                            if (error) {
                                res.json(error);
                            } else {
                                //redirect back to location with id 
                                res.redirect("/locations/" + req.params.id);
                            }
                        });
                    } else {
                        res.json("Only writer of the comments are allowed to delete it.");
                    }
                }
            });
        }
    });
});

module.exports = router;
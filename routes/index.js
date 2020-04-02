var express = require("express"),
    router = express.Router();
var { isLoggedIn, forwardAuthenticated } = require("../config/auth");

// Get landing page
router.get("/", forwardAuthenticated, function(request, response) {
    response.render("landing");
});

// Get homepage
router.get("/home", isLoggedIn, function(request, response) {
    response.redirect("/locations");
});

module.exports = router;
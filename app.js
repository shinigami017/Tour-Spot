var express = require("express"),
    flash = require("connect-flash"),
    session = require("express-session"),
    passport = require("passport"),
    mongoose = require("mongoose");

// Init App
var app = express();

// EJS and View Engine
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Set Static Folder
app.use(express.static(__dirname + "/public"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost/TourSpot", { useNewUrlParser: true, useUnifiedTopology: true });

// Express Session Middleware
app.use(session({
    secret: "session secret",
    saveUninitialized: true,
    resave: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require("./config/passport")(passport);

// Connect Flash Middleware
app.use(flash());

// Global vars for flash messages
app.use(function(request, response, next) {
    response.locals.success_msg = request.flash("success_msg");
    response.locals.error_msg = request.flash("error_msg");
    response.locals.error = request.flash("error");
    response.locals.currentUser = request.user;
    next();
});

// Routes
var indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users"),
    locationRoutes = require("./routes/locations"),
    commentRoutes = require("./routes/comments");
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/locations", locationRoutes);
app.use("/locations/:id/comments", commentRoutes);

// Port Setup
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port") + "!");
    console.log("Press Ctrl + C to stop the server.");
    console.log("\n--------------------------------------------------\n");
});
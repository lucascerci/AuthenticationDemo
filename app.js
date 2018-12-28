var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
    

mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });



var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//run as a function and pass some arguments, have to pass 3 diferent options 
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world", //secret is used to encode and decode the sections
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//--------------------------------------
//ROUTES
//--------------------------------------


app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

//--------------------------------------
// Auth Routes
//--------------------------------------

//show sign up form
app.get("/register", function(req, res) {
    res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
                                //pass the user object that we wanna create and then pass the password separaly[
                                //and then if everything goes well that will return a new user that has everything inside of it (the username and de hash password as well)
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }else{
            //that line will log the user in, it will take care of everything in the session. -> Store the correct information and run the serialize previusly defined on line 30/31
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started")
});
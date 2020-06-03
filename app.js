var express    =    require("express"),
    app        =    express(),
    mongoose   =    require("mongoose"),
    bodyParser =    require("body-parser"),
    passport   =    require("passport"),
    localStrategy=  require("passport-local"),
    passportLocalMongoose= require("passport-local-mongoose"),
    sanitizer  =    require("express-sanitizer"),
    flash      =    require("connect-flash")
    camp       =    require("./modules/camp"),
    comment    =    require("./modules/comment"),
    user       =    require("./modules/user"),
    campRoute  =    require("./route/camp-route"),
    commentRoute=   require("./route/comment-route");
  
    
    mongoose.connect(process.env.DATABASEURL || "mongodb//localhost:27017/yelpCamp",{useNewUrlParser:true});
   
app.set("view engine","ejs");
// passport
app.use(require("express-session")({
    secret:"my first dog name is sammy",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport. session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
passport.use(new localStrategy(user.authenticate()));
app.use(flash());
app.use(function(req,res,next)
{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("InvalidAcsess");
    res.locals.success= req.flash("success");
   next();
 })
app.use (express.static("public"));
app.use("/campground",campRoute);
app.use("/comment",commentRoute);
app.use(bodyParser.urlencoded({extended:true}));


// ========================
// index
// ========================

    app.get("/",(req,res)=>
    {
        res.render("index")
    })
    
// =============================
// auth
// =============================

app.get("/signup",(req,res)=>
{
res.render("register");
})

app.get("/login",(req,res)=>
{
    res.render("login");
})

app.get("/logout",(req,res)=>
{
    req.logout();
    res.redirect("/");
})


 //post
 app.post("/signup",(req,res)=>
 {
  user.register(new user({username:req.body.username,email:req.body.email}),req.body.password,(err,user)=>{
      if(err)
      {
         console.log(err); 
         return res.redirect("/signup");
      }
     passport.authenticate('local')(req,res,function()
     {
        res.redirect("/campground/add"); 
     })
  }) 
 })


 app.post("/login",passport.authenticate("local",
 {   
     successRedirect:"/campground",
     failureRedirect:"/login"
 }),(req,res)=>{ });


var port =process.env.PORT || 8080;

    app.listen( port,()=>{
        console.log("server is started ");
    })


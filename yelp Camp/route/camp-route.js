
// campground

var express =  require("express");
var router  =  express.Router(),
bodyParser =    require("body-parser");
var camp    =  require("../modules/camp");
var passport = require("passport");
var mongoose = require("mongoose");
router.use(passport.initialize());
router.use(passport.session());

router.use(bodyParser.urlencoded({extended:true}));

router.get("",(req,res)=>
{
  camp.find({}).populate("comment").populate("user").exec((err,AllCamp)=>
  { 
  res.render("campground",{camp:AllCamp});
  });
})

// 
router.get("/add",loggedIn,(req,res)=>{
  res.render("new");
})
// 

router.post("/add",loggedIn,(req,res)=>
{
  camp.create(req.body.campReq,(err,saved)=>
  {
    if(err) console.log("error while loading db"+err);
    else
    {
      saved.user=req.user;
      saved.save();
      console.log("loading Successful");
      res.redirect("/campground");
    }
  })
})
// 

router.get("/:id",(req,res)=>
{ 
   camp.findById(req.params.id).populate({
    path: 'comment',
    populate: {
        path: 'user',
        model: 'user'
    }
}).populate("user").exec((err,selectCamp)=>
   {  
    res.render("camp",{camp:selectCamp}); 
   })
})

router.get("/edit/:id",loggedIn,campAuthentication,(req,res)=>
{
   camp.findById(req.params.id).populate("user").exec((err,campBody)=>
   { 
       res.render("edit",{camp:campBody});
     })
  
})

router.get("/delete/:id",loggedIn,campAuthentication,(req,res)=>
{
  camp.findById(req.params.id).populate("user").populate("comment").exec((err,campBody)=>
  { 



       campBody.comment.forEach((comBody)=>
       {
         comment.findByIdAndDelete(comBody._id,(err,body)=>{})
       })
      camp.findByIdAndDelete(req.params.id,(err,success)=>
       {
      res.redirect("/campground");
       });
  
  
   
  })
})


router.post("/edit/:id",loggedIn,campAuthentication,(req,res)=>
{
  camp.where({ _id:req.params.id }).update(req.body.campReq,(err,updated)=>{
  res.redirect("/campground/"+req.params.id);
});
})

function loggedIn(req,res,next)
{  console.log(req.isAuthenticated())
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
     res.redirect("/login");
    }
}

function campAuthentication(req,res,next)
{
  camp.findById(req.params.id).populate("user").exec((err,campBody)=>
  { 
   var requestedId = String(campBody.user._id);
   var loggedId    = String(req.user._id);

   if(requestedId===loggedId)
   {
     next();
     
   }
   else
   {
     res.redirect("back");
   }
  })
}



module.exports=router;
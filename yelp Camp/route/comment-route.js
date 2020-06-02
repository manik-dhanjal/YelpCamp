var express= require("express");
    camp    = require("../modules/camp"),
    bodyParser = require("body-parser"),
    comment = require("../modules/comment");

 var   router  = express.Router();

   router.use(bodyParser.urlencoded({extended:true}))


   router.post("/add/:id",loggedIn,(req,res)=>
 {
    camp.findById(req.params.id,(err,campBody)=>
    {
      comment.create({comment:req.body.com},(err,createdComment)=>
      { 
         
          createdComment.user=req.user;
        
          createdComment.save((err,lastComment)=>
          {
               console.log(lastComment);
               console.log(campBody)
               campBody.comment.push(lastComment);
               campBody.save();
               res.redirect("/campground/"+req.params.id);
          });

      })
    })
 })


 router.get("/camp/:campId/edit/:id",loggedIn,comAuthentication,(req,res)=>
 {
    comment.findById(req.params.id,(err,commentBody)=>
    {
      res.render("commentEdit",{com:commentBody,campId:req.params.campId});
    })
 })

 router.post("/camp/:campId/edit/:id",loggedIn,comAuthentication,(req,res)=>
 {   

    comment.findByIdAndUpdate(req.params.id,{$set :{comment:req.body.comment}},(err,comBody)=>
    { 
       if(err)
      {
        console.log(err);
      } 
        console.log(comBody);
        res.redirect("/campground/"+req.params.campId);
    })
 })

 router.get("/delete/:id",loggedIn,comAuthentication,(req,res)=>
 {
    comment.findByIdAndDelete(req.params.id,(err,comBody)=>
    {
       if(err) console.log(err);
       res.redirect("back");
    })
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

  
function comAuthentication(req,res,next)
{
  comment.findById(req.params.id).populate("user").exec((err,comBody)=>
  { 
   var requestedId = String(comBody.user._id);
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
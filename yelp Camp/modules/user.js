var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String

});

userSchema.plugin(passportLocalMongoose);

module.exports=new mongoose.model("user",userSchema);
var mongoose = require("mongoose"),
comment    =    require("./comment"),
user       =    require("./user");

var campSchema= new mongoose.Schema({
    place:String,
    url:String,
    desc:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
      comment:[{
          type:mongoose.Schema.Types.ObjectId,
          ref:"comment"
      }]
  })

  module.exports = mongoose.model("camps",campSchema);
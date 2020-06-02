var mongoose = require("mongoose");
var user     = require("./user")

var commentSchema = new mongoose.Schema({
    comment:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})

module.exports = mongoose.model("comment",commentSchema)
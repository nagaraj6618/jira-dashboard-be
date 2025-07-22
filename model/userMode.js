const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true,
   },
   jiraTokenId:{
      type:String,
      default:"empty"
   }
},{
   timestamps:true
});

module.exports = mongoose.model('user',userSchema);
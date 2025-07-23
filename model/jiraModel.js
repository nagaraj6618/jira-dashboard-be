const mongoose = require("mongoose");

const jiraTokenSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true,
   },
   baseUrl:{
      type:String,
      required:true,
   },
   token:{
      type:String,
      required:true
   },
   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
      required:true,
   }
},{timestamps:true});


module.exports = mongoose.model('jira',jiraTokenSchema);
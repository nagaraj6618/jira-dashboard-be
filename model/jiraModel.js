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
   }
},{timestamps:true});


module.exports = mongoose.model('jira',jiraTokenSchema);
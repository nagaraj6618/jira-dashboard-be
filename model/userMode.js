const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true,
   },
   jiraTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'jira', // refers to the Jira model
      default: null, // optional and initially empty
}
},{
   timestamps:true
});

module.exports = mongoose.model('user',userSchema);
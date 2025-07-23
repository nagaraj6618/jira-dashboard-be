const { verifyToken } = require("../middleware/authVerify");
const Jira = require("../model/jiraModel")
const User = require('../model/userMode');

const addJiraData = async (req, res) => {
  try {
    const { userEmail,jiraEmail, baseUrl, token } = req.body;

    if (!userEmail || !baseUrl || !token ||!jiraEmail) {
      return res.status(400).json({ success: false, message: 'Email, Base URL, and Token are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email:userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if Jira record already exists
    let jiraRecord = await Jira.findOne({ email:jiraEmail, baseUrl,userId:user._id });

    if (jiraRecord) {
      jiraRecord.token = token;
      // jiraRecord.userId = user._id;
      await jiraRecord.save();
    } else {
      jiraRecord = await Jira.create({ email:jiraEmail, baseUrl, token,userId:user._id });
    }

    // Update user's jiraTokenId
    user.jiraTokenId = jiraRecord._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jira data saved and user updated',
      jiraId: jiraRecord._id
    });

  } catch (error) {
    console.error('Error adding Jira data:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getJiraData = async(req,res) => {
  try{
    const decoded = verifyToken(req.headers.authorization)
    const userId = decoded.userId;
    console.log(decoded)
    const jiraData = await Jira.find({ userId });
    console.log(jiraData);
    if (jiraData.length == 0) {
      return res.status(404).json({ message: 'No Jira data found for this user',success:false });
    }

    return res.status(200).json({ data: jiraData,success:true });
  }catch(error){
    console.error('Error fetching Jira data:', error);
    return res.status(500).json({ message: error.message,success:false });
  }
}
const deleteJiraRecord = async(req,res) => {
  try{
    const decoded = verifyToken(req.headers.authorization)
    const userId = decoded.userId;
    const jiraId = req.params.id;
    const jiraRecord = await Jira.findOne({ _id: jiraId, userId });
    if (!jiraRecord) {
      return res.status(404).json({ message: 'Jira record not found or unauthorized',success:false });
    }

    await Jira.deleteOne({ _id: jiraId });

    return res.status(200).json({ message: 'Jira record deleted successfully',success:true });

  }catch(error){
    return res.status(500).json({ message: 'Server error', error: error.message,succes:false });
  }
}
module.exports = {addJiraData,getJiraData,deleteJiraRecord}
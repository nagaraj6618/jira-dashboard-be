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
    let jiraRecord = await Jira.findOne({ email:jiraEmail, baseUrl });

    if (jiraRecord) {
      jiraRecord.token = token;
      await jiraRecord.save();
    } else {
      jiraRecord = await Jira.create({ email:jiraEmail, baseUrl, token });
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

module.exports = {addJiraData}
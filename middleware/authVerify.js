const jwt = require('jsonwebtoken');
const User = require('../model/userMode');
const Jira = require('../model/jiraModel');

const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const decoded = verifyToken(authHeader)
    req.user = decoded; // { userId, email }
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const jiraAuthMiddleware = async (req, res, next) => {
  try {
    const decoded = verifyToken(req.headers.authorization);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;

    if (user.jiraTokenId) {
      const jiraData = await Jira.findById(user.jiraTokenId);
      if (jiraData) {
        req.jira = jiraData;
      }
    }

    next();
  } catch (error) {
    console.error('Jira Auth Middleware Error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = {authMiddleware,jiraAuthMiddleware,verifyToken};

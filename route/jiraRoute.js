const express = require('express');
const { addJiraData } = require('../controller/JiraController');
const { authMiddleware } = require('../middleware/authVerify');
const router = express.Router();

router.post('/operation',authMiddleware,addJiraData);
module.exports = router
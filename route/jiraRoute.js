const express = require('express');
const { addJiraData, getJiraData, deleteJiraRecord } = require('../controller/JiraController');
const { authMiddleware } = require('../middleware/authVerify');
const router = express.Router();

router.post('/operation',authMiddleware,addJiraData);
router.get("/getJiraData",authMiddleware,getJiraData);
router.delete("/:id",authMiddleware,deleteJiraRecord);
module.exports = router
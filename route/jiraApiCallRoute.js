const { getWorkFlowSchems, getTheResourceBasedOnParams } = require('../controller/jiraApiCallController');
const { authMiddleware, jiraAuthMiddleware } = require('../middleware/authVerify');

const router  = require('express').Router();

// router.get('/workflow-schemes',getWorkFlowSchems);
router.get('/:resource',jiraAuthMiddleware,getTheResourceBasedOnParams);

module.exports = router;
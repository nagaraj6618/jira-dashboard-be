const { getWorkFlowSchems, getTheResourceBasedOnParams } = require('../controller/jiraApiCallController');
const { authMiddleware } = require('../middleware/authVerify');

const router  = require('express').Router();

// router.get('/workflow-schemes',getWorkFlowSchems);
router.get('/:resource',authMiddleware,getTheResourceBasedOnParams);

module.exports = router;
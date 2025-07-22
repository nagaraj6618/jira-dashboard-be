const { getWorkFlowSchems, getTheResourceBasedOnParams } = require('../controller/jiraApiCallController');

const router  = require('express').Router();

// router.get('/workflow-schemes',getWorkFlowSchems);
router.get('/:resource',getTheResourceBasedOnParams);

module.exports = router;
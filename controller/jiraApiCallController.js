const {fetchWorkflowSchemes, fetchWorkflows, fetchScreens, fetchScreenSchemes, getCustomFields, fetchNotificationSchemes, fetchPermissionSchemes, fetchPrioritySchemes, fetchIssueTypeScreenSchemes, fetchIssueTypes, fetchFieldConfigurations, fetchFieldConfigurationSchemes, fetchPriorities, fetchStatuses, fetchResolutions, fetchIssueSecuritySchemes, fetchProjects, fetchIssueLinkTypes, fetchFilters, fetchBoards, fetchDashboards, fetchAllGroups, fetchAllUsers} = require('./jiraApiCallFunctions');

const getWorkFlowSchems = async (req, res) => {
    try {
        const schemes = await fetchWorkflowSchemes();
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Workflow schemes fetched successfully',
            data: schemes
        });
    } catch (error) {
        console.error(error);
        res.status(error.response?.status || 500).json({
            status: error.response?.status || 500,
            success: false,
            message: error.message,
            data: []
        });
    }
}

const getTheResourceBasedOnParams = async (req, res) => {
  try {
    const fns = {
      "workflows": fetchWorkflows,
      "workflow-schemes" : fetchWorkflowSchemes,
      "screens" : fetchScreens,
      "screens-schemes" : fetchScreenSchemes,
      "custom-field":getCustomFields,
      "notification-schemes":fetchNotificationSchemes,
      "permission-schemes":fetchPermissionSchemes,
      "priority-schemes":fetchPrioritySchemes,
      "issue-type-screen-schemes":fetchIssueTypeScreenSchemes,
      "issue-types":fetchIssueTypes,
      "field-configuration":fetchFieldConfigurations,
      "field-configuration-schemes":fetchFieldConfigurationSchemes,
      "priorities":fetchPriorities,
      "statuses":fetchStatuses,
      "resolutions":fetchResolutions,
      "issue-security-schemes":fetchIssueSecuritySchemes,
      "projects":fetchProjects,
      "issue-link-types":fetchIssueLinkTypes,
      "filters":fetchFilters,
      "boards":fetchBoards,
      "dashboards":fetchDashboards,
      "groups":fetchAllGroups,
      "users":fetchAllUsers

    //   screens: fetchScreens,
      // … include all others based on req.params.resource
    };
    const fn = fns[req.params.resource];
    if (!fn) return res.status(404).json({ success: false, message: 'Unknown resource' });
    const data = await fn(req.jira);
    res.status(200).json({ success: true, message: `${req.params.resource} fetched`, data ,length : data.length});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}
module.exports = {getWorkFlowSchems,getTheResourceBasedOnParams}
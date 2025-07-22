const axios = require('axios');

async function fetchWorkflowSchemes(JIRA_SITE, headers, auth) {
    const url = `${JIRA_SITE}/rest/api/3/workflowscheme`;
    let startAt = 0;
    const maxResults = 50;
    let workflowSchemes = [];

    try {
        while (true) {
            const response = await axios.get(url, {
                headers: headers,
                auth: auth, // { username: 'email', password: 'api_token' }
                params: {
                    startAt: startAt,
                    maxResults: maxResults
                }
            });

            const data = response.data;
            workflowSchemes = workflowSchemes.concat(data.values || []);

            if (data.isLast) {
                break;
            }

            startAt += maxResults;
        }

        return workflowSchemes;

    } catch (error) {
        console.error(`❌ Error ${error.response?.status || ''}: ${error.message}`);
        throw error;
    }
}

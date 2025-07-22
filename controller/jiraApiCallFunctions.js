const axios = require('axios');
// const JIRA_SITE = process.env.JIRA_SITE;
// const EMAIL = process.env.EMAIL;
// const API_TOKEN = process.env.API_TOKEN;
// const auth = {
//   username: EMAIL,
//   password: API_TOKEN
// };

const headers = {
  'Accept': 'application/json'
};

async function fetchWorkflowSchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const url = `${JIRA_SITE}/rest/api/3/workflowscheme`;
  const all = await fetchPaginated(url,auth, 50);
  return all;

}

async function fetchPaginated(url,auth, maxResults = 50, valueKey = 'values') {
  //   console.log(valueKey)
  let startAt = 0, all = [];
  while (true) {
    const r = await axios.get(url, { headers, auth, params: { startAt, maxResults } });
    const data = r.data;
    const vals = data[valueKey] || [];
    all = all.concat(vals);
    // console.log(all)
    if (data.isLast || vals.length < maxResults) break;
    startAt += maxResults;
  }
  //   console.log(all)
  return all;
}

async function fetchWorkflows(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/workflow/search`,auth, 50);
  return all;
}
async function fetchScreens(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  return await fetchPaginated(`${JIRA_SITE}/rest/api/3/screens`,auth, 100);
}
async function fetchScreenSchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  return await fetchPaginated(`${JIRA_SITE}/rest/api/3/screenscheme`,auth, 50);
}
async function getCustomFields(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/field`, { headers, auth });
  return data.filter(f => f.custom);
}
async function fetchNotificationSchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/notificationscheme`, { headers, auth });
  const schemes = data.values || [];
  let assigned = 0, unassigned = 0;
  const processed = await Promise.all(schemes.map(async sch => {
    const projectId = sch.scope?.project?.id;
    let projectName = 'Not assigned to any project';
    if (projectId) {
      assigned++;
      try {
        const pr = await axios.get(`${JIRA_SITE}/rest/api/3/project/${projectId}`, { headers, auth });
        projectName = pr.data.name;
      } catch {
        projectName = `(Unknown ID: ${projectId})`;
      }
    } else unassigned++;
    return { "Notification Scheme": sch.name, "Project Assigned": projectName };
  }));
  return { data: processed, total: schemes.length, assigned, unassigned };
}
async function fetchPermissionSchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/permissionscheme`, { headers, auth });
  const list = data.permissionSchemes || [];
  return { data: list.map(s => ({ "Permission Scheme": s.name, Description: s.description })), total: list.length };
}
async function fetchPrioritySchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/priorityscheme`, { headers, auth });
  return (data.values || []).map(s => ({ "Priority Scheme": s.name, Description: s.description }));
}
async function fetchIssueTypeScreenSchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/issuetypescreenscheme`,auth, 50);
  return all.map(s => ({ "Issue Type Screen Scheme": s.name, Description: s.description }));
}
async function fetchIssueTypes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data: types } = await axios.get(`${JIRA_SITE}/rest/api/3/issuetype`, { headers, auth });
  const seen = new Set();
  const results = [];
  let totalCount = 0;

  for (const it of types) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    let count = 'Error';
    try {
      const cr = await axios.get(`${JIRA_SITE}/rest/api/3/search`, {
        headers, auth, params: { jql: `issuetype = ${it.id}`, maxResults: 0 }
      });
      count = cr.data.total;
      if (typeof count === 'number') totalCount += count;
    } catch { }
    results.push({ ID: it.id, "Issue type": it.name, "Issue Count": count });
  }

  results.push({ ID: '', "Issue type": `Total Issue Types: ${seen.size}`, "Issue Count": `Total Issue Count: ${totalCount}` });
  return results;
}
async function fetchFieldConfigurations(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/fieldconfiguration`,auth, 50);
  const formatted = all.map(c => ({ ID: c.id, Name: c.name, Description: c.description || '' }));
  formatted.push({ ID: '', Name: `Total Count: ${formatted.length}`, Description: '' });
  return formatted;
}
async function fetchFieldConfigurationSchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/fieldconfigurationscheme`,auth, 50);
  const formatted = all.map(s => ({ ID: s.id, Name: s.name, Description: s.description || '' }));
  formatted.push({ ID: '', Name: `Total Count: ${formatted.length}`, Description: '' });
  return formatted;
}
async function fetchPriorities(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/priority`, { headers, auth });
  return data.map(p => ({ ID: p.id, Name: p.name, Description: p.description || '' }));
}
async function fetchStatuses(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/status`, { headers, auth });
  const arr = data.map(s => ({
    ID: s.id,
    Name: s.name,
    Description: s.description || '',
    Category: s.statusCategory?.name || ''
  }));
  arr.push({ ID: '', Name: `Total Count: ${arr.length}`, Description: '', Category: '' });
  return arr;
}
async function fetchResolutions(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/resolution`, { headers, auth });
  const arr = data.map(r => ({ ID: r.id, Name: r.name, Description: r.description || '' }));
  arr.push({ ID: '', Name: `Total Count: ${arr.length}`, Description: '' });
  return arr;
}
async function fetchIssueSecuritySchemes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/issuesecurityschemes`, { headers, auth });
  return (data.issueSecuritySchemes || []).map(s => ({ ID: s.id, Name: s.name, Description: s.description || '' }));
}
async function fetchProjects(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/project/search`,auth, 50, 'values');
  return all.map(p => ({ ID: p.id, Key: p.key, Name: p.name, "Project Type": p.projectTypeKey }));
}
async function fetchIssueLinkTypes(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const { data } = await axios.get(`${JIRA_SITE}/rest/api/3/issueLinkType`, { headers, auth });
  return (data.issueLinkTypes || []).map(lt => ({
    ID: lt.id, Name: lt.name, "Inward Description": lt.inward, "Outward Description": lt.outward
  }));
}
async function fetchFilters(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  return await fetchPaginated(`${JIRA_SITE}/rest/api/3/filter/search`,auth, 50);
}
async function fetchBoards(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  return await fetchPaginated(`${JIRA_SITE}/rest/agile/1.0/board`,auth, 50);
}
async function fetchDashboards(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/dashboard`, auth,50, 'dashboards');
  return all.map(d => ({ ID: d.id, Name: d.name, Owner: d.owner?.displayName, ViewURL: d.view }));
}
// async function fetchAllGroups() {
//   const names = new Set();
//   const groups = [];

//   for (const q of 'abcdefghijklmnopqrstuvwxyz') {

//     const all = await fetchPaginated(`${JIRA_SITE}/rest/api/3/groups/picker?query=${q}`, 50, 'groups');
//     all.forEach(g => {
//       if (!names.has(g.name)) {
//         names.add(g.name);
//         groups.push({ Name: g.name, GroupID: g.groupId });
//       }
//     });
//   }

//   return groups;
// }
async function fetchAllGroups(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const groups = [];
  const seenNames = new Set();

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  for (const letter of alphabet) {
    let start = 0;

    while (true) {
      const url = `${JIRA_SITE}/rest/api/3/groups/picker?query=${letter}`;

      try {
        const response = await axios.get(url, { headers, auth, params: { startAt: 0, maxResults: 50 } });

        if (response.status !== 200) {
          console.error(`❌ Failed for '${letter}' - ${response.status}`);
          break;
        }

        const data = response.data;
        const groupList = data.groups || [];

        if (!groupList.length) break;

        let newFound = 0;
        for (const group of groupList) {
          const name = group.name;
          if (name && !seenNames.has(name)) {
            seenNames.add(name);
            groups.push({
              Name: name,
              GroupID: group.groupId
            });
            newFound += 1;
          }
        }

        if (newFound === 0 || groupList.length < 50) break;

        start += 50;

      } catch (err) {
        console.error(`❌ Error fetching for '${letter}' at startAt=${start}:`, err.message);
        break;
      }
    }
  }


  return groups;
}
// async function fetchAllUsers() {
//   return await fetchPaginated(`${JIRA_SITE}/rest/api/3/users/search`, 50);

// }
async function fetchAllUsers(jira) {
  const JIRA_SITE = jira.baseUrl;
  const EMAIL = jira.email;
  const API_TOKEN = jira.token;
  const auth = {
    username: EMAIL,
    password: API_TOKEN
  };
  const url = `${JIRA_SITE}/rest/api/3/users/search`;
  let startAt = 0;
  const maxResults = 50;
  const allUsers = [];

  while (true) {
    try {
      const response = await axios.get(url, {
        headers,
        auth,
        params: {
          startAt,
          maxResults
        }
      });

      if (response.status !== 200) {
        console.error("❌ Failed to fetch users:", response.status, response.statusText);
        return [];
      }

      const users = response.data;
      if (!users || users.length === 0) break;

      users.forEach(user => {
        allUsers.push({
          'Account ID': user.accountId,
          'Display Name': user.displayName,
          'Email': user.emailAddress || 'N/A',
          'Active': user.active,
          'Account Type': user.accountType
        });
      });

      if (users.length < maxResults) break;
      startAt += maxResults;

    } catch (error) {
      console.error("❌ Error fetching users:", error.message);
      break;
    }
  }

  return allUsers;
}



module.exports = {
  fetchWorkflowSchemes,
  fetchWorkflows,
  fetchScreens,
  fetchScreenSchemes,
  getCustomFields,
  fetchNotificationSchemes,
  fetchPermissionSchemes,
  fetchPrioritySchemes,
  fetchIssueTypeScreenSchemes,
  fetchIssueTypes,
  fetchFieldConfigurations,
  fetchFieldConfigurationSchemes,
  fetchPriorities,
  fetchStatuses,
  fetchResolutions,
  fetchIssueSecuritySchemes,
  fetchProjects,
  fetchIssueLinkTypes,
  fetchFilters,
  fetchBoards,
  fetchDashboards,
  fetchAllGroups,
  fetchAllUsers

};
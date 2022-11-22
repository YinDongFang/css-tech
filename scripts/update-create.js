const axios = require('axios');
const { getProjects, saveProjects } = require('./utils');

// support specifice filename
// exp: pnpm update-version Sass 'Tailwind CSS'
let projects = getProjects();

const targetProjects = process.argv.slice(2).map((filename) => filename.toLowerCase());
if (targetProjects.length) {
  projects = projects.filter(project => {
    const filename = project.filename.replace('.yaml', '').toLowerCase();
    return targetProjects.includes(filename);
  });
}

async function getRepoCreatedAt(project) {
  const { data } = await axios.get(`https://api.github.com/repos/${project.repo}`, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
    },
  });
  project.create = data.created_at.substr(0, 7).replace('-', '/');
  return project;
}

Promise.all(projects.map(getRepoCreatedAt)).then(saveProjects);
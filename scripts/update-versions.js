const axios = require('axios');
const { getProjects, saveProjects, getNpmPkgName, formatDate } = require('./utils');

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

async function updateProjectVersions(project) {
  const npmPkgName = getNpmPkgName(project);

  const { data } = await axios.get(`https://registry.npmjs.org/${npmPkgName}`);

  const versions = {};
  Object.keys(data.versions)
    .filter(version => npmPkgName !== 'tailwindcss' || !version.includes('insiders'))
    .forEach(version => {
      const time = formatDate(data.time[version]);
      versions[time] = version;
    });

  project.versions = versions;

  return project;
}

Promise.all(projects.map(updateProjectVersions)).then(saveProjects);
const axios = require('axios');
const { getProjects, saveProjects, getNpmPkgName } = require('./utils');

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

async function updateProjectVersion(project) {
  const npmPkgName = getNpmPkgName(project);

  const { data } = await axios.get(`https://registry.npmjs.org/${npmPkgName}`);

  const versions = {};
  let lastVersion;
  Object.keys(data.versions)
    .filter(version => npmPkgName !== 'tailwindcss' || !version.includes('insiders'))
    .forEach(version => {
      const time = data.time[version].substr(0, 7).replace('-', '/');
      if (lastVersion) {
        while (lastVersion.time < time) {
          const [year, month] = lastVersion.time.split('/').map(Number);
          const nextMonth = month === 12 ? `${year + 1}/01` : `${year}/${month + 1 < 10 ? `0` + (month + 1) : (month + 1)}`;
          versions[nextMonth] = lastVersion.version;
          lastVersion.time = nextMonth;
        }
      }
      versions[time] = version;
      lastVersion = { time, version };
    });

  project.versions = versions;

  return project;
}

Promise.all(projects.map(updateProjectVersion)).then(saveProjects);
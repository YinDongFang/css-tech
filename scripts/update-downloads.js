const axios = require('axios');
const { getProjects, saveProjects, getStringDate, getNpmPkgName } = require('./utils');

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

async function getDownloadsOfDate(year, month, npmPkgNames) {
  const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const endTime = `${year}-${month < 10 ? '0' + month : month}-${daysOfMonth[month - 1]}`;
  return await axios.get(`https://api.npmjs.org/downloads/point/${year}-01-01:${endTime}/${npmPkgNames.join(',')}`);
}

// https://github.com/npm/registry/blob/master/docs/download-counts.md
// The earliest date for which data will be returned is January 10, 2015
async function updateProjectDownloads(projects) {
  const FROM = 2015;
  const current = new Date();
  const currentYear = current.getFullYear();
  const currentMonth = current.getMonth() + 1;

  const totalDownloads = {};
  const npmPkgNames = [];
  projects.forEach(project => {
    const npmPkgName = getNpmPkgName(project);
    totalDownloads[npmPkgName] = 0;
    npmPkgNames.push(npmPkgName);
    project.downloads = project.downloads || {};
  });

  for (let year = FROM; year <= currentYear; year++) {
    const endMonth = year === currentYear ? currentMonth : 12;
    for (let month = 1; month <= endMonth; month++) {
      const stringDate = getStringDate(year, month);
      const missedProjects = projects
        .filter(project => {
          const firstVersionTime = Object.keys(project.versions)[0];
          return firstVersionTime < stringDate || firstVersionTime === stringDate;
        })
        .filter(project => {
          return !project.downloads?.[stringDate];
        });
      if (missedProjects.length) {
        const { data } = await getDownloadsOfDate(year, month, npmPkgNames);
        missedProjects.forEach(project => {
          const npmPkgName = getNpmPkgName(project);
          const downloads = npmPkgNames.length === 1 ? data.downloads : data[npmPkgName].downloads;
          project.downloads[stringDate] = downloads + totalDownloads[npmPkgName];
        });
      }
      if (month === 12) {
        projects.forEach(project => {
          const npmPkgName = getNpmPkgName(project);
          totalDownloads[npmPkgName] = project.downloads[stringDate] || 0;
        });
      }
    }
  }

  return projects;
}

updateProjectDownloads(projects).then(saveProjects);
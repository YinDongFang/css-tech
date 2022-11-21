const { getProjects, updateVersion, saveProjects } = require('./api');

const targetProjects = process.argv.slice(2);
const projects = targetProjects.length
  ? getProjects().filter(project => targetProjects.includes(project.filename.replace('.yaml', '')))
  : getProjects();
Promise.all(projects.map(updateVersion)).then(saveProjects);
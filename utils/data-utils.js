import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

export const YAML_DIR_PATH = path.join(process.cwd(), 'data');

export function getProjectsData() {
  const categorysYaml = fs.readFileSync(path.join(YAML_DIR_PATH, 'categorys.yaml'));
  const { categorys } = load(categorysYaml);

  const projectFiles = fs.readdirSync(path.join(YAML_DIR_PATH, 'projects'));
  const projects = projectFiles.map(filename => {
    const project = load(fs.readFileSync(path.join(YAML_DIR_PATH, 'projects', filename)));
    project.name = filename.replace('.yaml', '');
    return project;
  });

  categorys.forEach(category => {
    category.projects = projects.filter(project => project.category === category.name).sort(({ create: a }, { create: b }) => (a > b ? 1 : -1));
  });

  return categorys.sort((ca, cb) => {
    const ta = ca.time ? ca.time : ca.projects[0].create;
    const tb = cb.time ? cb.time : cb.projects[0].create;
    return ta > tb ? 1 : -1;
  });
}

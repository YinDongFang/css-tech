import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

export const YAML_PATH = path.join(process.cwd(), 'data.yaml');

export function getData() {
  const yaml = fs.readFileSync(YAML_PATH);
  const { categorys, projects } = load(yaml);
  categorys.forEach((category) => {
    category.items = projects.filter(
      (project) => project.category === category.name
    );
  });
  return categorys;
}

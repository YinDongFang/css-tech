import { Project } from './Project';

export function Category({ name, projects, talks, github }) {
  return (
    <div>
      <div className="text-2xl text-black dark:text-white font-bold opacity-70 pb-3 mt-6">
        <span>{name}</span>
      </div>
      <div className='flex flex-wrap gap-x-5 gap-y-3'>
        {projects.map((project) => (
          <Project key={project.name} {...project} />
        ))}
      </div>
    </div>
  );
}

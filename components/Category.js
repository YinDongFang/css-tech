import { Project } from './Project';

export function Category({ name, items, talks, github }) {
  return (
    <div>
      <div className="text-2xl text-black dark:text-white font-bold opacity-70 pb-3 mt-6">
        <span>{name}</span>
      </div>
      <div>
        {items.map((item) => (
          <Project key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

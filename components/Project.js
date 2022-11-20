import Image from 'next/image';

export function Project({ name, icon, github, home, talks }) {
  return (
    <div>
      <Image src={icon} alt={name} />
      <span>{name}</span>
    </div>
  );
}

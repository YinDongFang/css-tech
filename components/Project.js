import { githubCircleIcon } from "./Icons";

export function Project({ name, icon, version, home, repo }) {
  return (
    <div className="flex gap-2 items-center rounded-full px-5 py-1 opacity-2" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
      <a href={home} target="_blank" className="bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${icon})`, width: 30, height: 30 }} rel="noreferrer" />
      <span className="text-lg text-black opacity-90">{name}</span>
      <a className="opacity-80" href={`https://github.com/${repo}`} target="_blank" style={{ width: 19, height: 19 }} rel="noreferrer">{githubCircleIcon}</a>
      {!!version && <img alt={version} src={`https://img.shields.io/static/v1?label=npm&message=${version}&color=blue`} />}
    </div>
  );
}

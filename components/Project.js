export function Project({ name, icon, home, integrations = [] }) {
  return (
    <div className="flex gap-1 items-center rounded-full px-5 py-1 opacity-2" style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
      <div className="bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${icon})`, width: 35, height: 35 }}></div>
      <span className="text-lg text-black opacity-90">{name}</span>
    </div>
  );
}

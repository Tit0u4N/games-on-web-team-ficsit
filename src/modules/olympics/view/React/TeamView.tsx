import { Character } from '@character/model/Character.ts';

interface TeamViewProps {
  team: { color: string; candidats: Character[]; name: string };
}

export const TeamView: React.FC<TeamViewProps> = ({ team }) => {
  const colors = [
    { colorHex: '#22c55e', colorBg: 'bg-green-500', colorText: 'text-green-500' },
    { colorHex: '#dc2626', colorBg: 'bg-red-600', colorText: 'text-red-600' },
    { colorHex: '#f97316', colorBg: 'bg-orange-500', colorText: 'text-orange-500' },
    { colorHex: '#ec4899', colorBg: 'bg-pink-500', colorText: 'text-pink-500' },
    { colorHex: '#7c2d12', colorBg: 'bg-orange-900', colorText: 'text-orange-900' },
    { colorHex: '#a16207', colorBg: 'bg-yellow-700', colorText: 'text-yellow-700' },
    { colorHex: '#84cc16', colorBg: 'bg-green-500', colorText: 'text-green-500' },
    { colorHex: '#166534', colorBg: 'bg-green-800', colorText: 'text-green-800' },
    { colorHex: '#10b981', colorBg: 'bg-emerald-500', colorText: 'text-emerald-500' },
    { colorHex: '#4c1d95', colorBg: 'bg-violet-900', colorText: 'text-violet-900' },
    { colorHex: '#14b8a6', colorBg: 'bg-teal-500', colorText: 'text-teal-500' },
    { colorHex: '#7e22ce', colorBg: 'bg-purple-700', colorText: 'text-purple-700' },
    { colorHex: '#3b82f6', colorBg: 'bg-blue-500', colorText: 'text-blue-500' },
    { colorHex: '#6366f1', colorBg: 'bg-indigo-500', colorText: 'text-indigo-500' },
    { colorHex: '#78716c', colorBg: 'bg-stone-500', colorText: 'text-stone-500' },
    { colorHex: '#8b5cf6', colorBg: 'bg-purple-500', colorText: 'text-purple-500' },
    { colorHex: '#facc15', colorBg: 'bg-yellow-400', colorText: 'text-yellow-400' },
    { colorHex: '#d946ef', colorBg: 'bg-fuchsia-500', colorText: 'text-fuchsia-500' },
    { colorHex: '#f43f5e', colorBg: 'bg-rose-500', colorText: 'text-rose-500' },
    { colorHex: '#06b6d4', colorBg: 'bg-cyan-500', colorText: 'text-cyan-500' },
    { colorHex: '#047857', colorBg: 'bg-emerald-700', colorText: 'text-emerald-700' },
    { colorHex: '#1e40af', colorBg: 'bg-blue-800', colorText: 'text-blue-800' },
    { colorHex: '#6b7280', colorBg: 'bg-gray-500', colorText: 'text-gray-500' },
  ];

  const classes = 'p-2 pb-4 rounded-lg ' + colors.find((value) => value.colorHex == team.color)?.colorBg;
  return (
    <div className={'flex flex-col items-center justify-center rounded-lg'}>
      <div className={classes}>
        <div>
          <h2>{team.name}</h2>
          {team.candidats.map((character, index) => (
            <div key={index}>{character.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

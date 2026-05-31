export const dynamic = 'force-dynamic';
import StatsChart from '../components/StatsChart';
import { Target, Skull, Activity, Crosshair, Swords, Trophy } from 'lucide-react';

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/steam', { cache: 'no-store' });
  const result = await res.json();
  const stats = result?.current;
  const history = result?.history;
  //デバッグ
  console.log("DBから届いた生の最新データ:", stats);
  console.log("DBから届いた履歴の数: ", history?.length);
  const displayKills = stats?.kills;

  return (
    <main className="h-screen flex flex-col bg-slate-950 text-slate-200 p-8 font-sans overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-8xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
          CS2 Stats Dashboard
        </h1>
        
        {stats ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              
              <StatCard title="K/D rate" value={(stats.kills / stats.deaths).toFixed(2)} icon={<Activity className="text-blue-400" />} />
              <StatCard title="HS rate" value={`${stats.hsRate.toFixed(1)}%`} icon={<Target className="text-emerald-400" />} />
              <StatCard title="kills" value={stats.kills} icon={<Crosshair className="text-red-400" />} />
              <StatCard title="deaths" value={stats.deaths} icon={<Skull className="text-gray-400" />} />
              <StatCard title="games played" value={stats.matches} icon={<Swords className="text-purple-400" />} />
              <StatCard title="Avg. Rounds Won per Match" value={(stats.wins / stats.matches).toFixed(1)} icon={<Trophy className="text-yellow-400" />} />
              
            </div>

            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-7 rounded-2xl shadow-2xl flex flex-col justify-center">
              <h2 className="text-lg font-bold mb-4 text-slate-300 flex items-center gap-2">
                <Activity size={20} className="text-blue-500"/> K/D graph
              </h2>
              <StatsChart historyData={history} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Could not retrieve data</p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 h-full flex flex-col justify-center rounded-2xl shadow-lg hover:border-slate-600 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-950 rounded-lg shadow-inner">
          {icon}
        </div>
        <p className="text-sm font-medium text-slate-0">{title}</p>
      </div>
      <p className="text-7xl font-black tracking-wider">{value}</p>
    </div>
  );
}
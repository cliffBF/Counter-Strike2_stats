export const dynamic = 'force-dynamic';
import Image from 'next/image';
import StatsChart from '../components/StatsChart';
import MetricCard from '../components/MetricCard';
import RangeCard from '../components/RangeCard';

type PlayerStats = {
  kills: number;
  deaths: number;
  matches: number;
  hsRate: number;
  wins: number;
  createdAt: string;
};

function average(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/steam', { cache: 'no-store' });
  const result = await res.json();
  const stats: PlayerStats | undefined = result?.current;
  const history: PlayerStats[] | undefined = result?.history;

  return (
    <main className="relative min-h-screen text-[#e5e7eb]">
        <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/endgame.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[center_60%]"
        />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/55" />
      </div>

      <div className="mx-auto max-w-[1000px] p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white 
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">Dashboard</h1>
        </div>

        {stats ? (
          <DashboardBody stats={stats} history={history ?? []} />
        ) : (
          <div className="flex items-center justify-center h-64 rounded-2xl border border-[#1e2530] bg-[#12161f]/80">
            <p className="text-[#6b7280]">Could not retrieve data</p>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d1d5db] mb-1 
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">CS2</p>
            <h1 className="text-3xl font-bold text-white 
            drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">Stats Dashboard</h1>

          </div>
        )}
      </div>
    </main>
  );
}

function DashboardBody({ stats, history }: { stats: PlayerStats; history: PlayerStats[] }) {
  const { kills, deaths, matches, hsRate, wins } = stats;

  const kd = deaths > 0 ? kills / deaths : kills;
  const avgKillsPerMatch = matches > 0 ? kills / matches : 0;
  const avgDeathsPerMatch = matches > 0 ? deaths / matches : 0;
  const avgRoundsWon = matches > 0 ? wins / matches : 0;
  const headshotsApprox = Math.round(kills * (hsRate / 100));

  const prev = history.length >= 2 ? history[history.length - 2] : null;
  const prevKd = prev && prev.deaths > 0 ? prev.kills / prev.deaths : prev?.kills;
  const kdTrend = prev ? (kd >= (prevKd ?? kd) ? 'up' : 'down') : null;
  const hsTrend = prev ? (hsRate >= prev.hsRate ? 'up' : 'down') : null;

  const sessionDiffs = history
    .map((d, i, arr) => {
      if (i === 0) return null;
      const sessionKills = d.kills - arr[i - 1].kills;
      const sessionDeaths = d.deaths - arr[i - 1].deaths;
      return { sessionKills, sessionDeaths };
    })
    .filter((d): d is { sessionKills: number; sessionDeaths: number } =>
      d !== null && (d.sessionKills !== 0 || d.sessionDeaths !== 0)
    );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="K/D Ratio"
          value={kd.toFixed(2)}
          trend={kdTrend}
          rows={[
            { label: 'Avg Kills / Match', value: avgKillsPerMatch.toFixed(1) },
            { label: 'Avg Deaths / Match', value: avgDeathsPerMatch.toFixed(1) },
            { label: 'Matches Played', value: matches.toLocaleString() },
          ]}
        />
        <MetricCard
          title="HS Rate"
          value={hsRate.toFixed(1)}
          unit="%"
          trend={hsTrend}
          rows={[
            { label: 'Kills', value: kills.toLocaleString() },
            {
              label: 'Headshots',
              value: headshotsApprox.toLocaleString(),
              info: 'Kills × HS Rate から算出した概算値',
            },
            { label: 'Deaths', value: deaths.toLocaleString() },
          ]}
        />
        <MetricCard
          title="Rounds Won"
          value={avgRoundsWon.toFixed(1)}
          ring={Math.min(100, (avgRoundsWon / 13) * 100)}
          rows={[
            { label: 'Matches Played', value: matches.toLocaleString() },
            { label: 'Total Rounds Won', value: wins.toLocaleString() },
          ]}
        />
        <MetricCard
          title="Matches Played"
          value={matches.toLocaleString()}
          rows={[
            { label: 'Total Rounds Won', value: wins.toLocaleString() },
            { label: 'Avg Rounds Won / Match', value: avgRoundsWon.toFixed(1) },
          ]}
        />
      </div>

      {sessionDiffs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SessionRangeCard
            title="Kills per Session"
            values={sessionDiffs.map((d) => d.sessionKills)}
            higherIsBetter
          />
          <SessionRangeCard
            title="Deaths per Session"
            values={sessionDiffs.map((d) => d.sessionDeaths)}
            higherIsBetter={false}
          />
          <SessionRangeCard
            title="K/D per Session"
            values={sessionDiffs.map((d) => (d.sessionDeaths > 0 ? d.sessionKills / d.sessionDeaths : d.sessionKills))}
            higherIsBetter
            decimals={2}
          />
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-[#1e2530] p-6">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/session-bg.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-[#12161f]/90" />
        </div>
        <h2 className="text-sm font-semibold tracking-[0.15em] text-[#6b7280] uppercase mb-4">
          Session History
        </h2>
        <StatsChart historyData={history} />
      </div>
    </>
  );
}

function SessionRangeCard({
  title,
  values,
  higherIsBetter,
  decimals = 0,
}: {
  title: string;
  values: number[];
  higherIsBetter: boolean;
  decimals?: number;
}) {
  const latest = values[values.length - 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = average(values);
  const percent = max > min ? ((latest - min) / (max - min)) * 100 : 50;
  const good = higherIsBetter ? latest >= avg : latest <= avg;

  return (
    <RangeCard
      title={title}
      value={latest.toFixed(decimals)}
      good={good}
      subtitle={`session average ${avg.toFixed(decimals)}`}
      min={min.toFixed(decimals)}
      max={max.toFixed(decimals)}
      percent={percent}
    />
  );
}
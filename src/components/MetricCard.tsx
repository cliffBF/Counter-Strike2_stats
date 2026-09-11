import { ArrowDown, ArrowUp, Info } from 'lucide-react';

type Row = { label: string; value: string; info?: string };

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  ring,
  rows,
}: {
  title: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | null;
  ring?: number;
  rows?: Row[];
}) {
  return (
    <div className="rounded-2xl border border-[#1e2530] bg-[#12161f]/80 backdrop-blur-sm px-6 py-5 flex flex-col">
      <p className="text-xs font-semibold tracking-[0.15em] text-[#9ca3af] uppercase text-center mb-4">
        {title}
      </p>

      <div className="flex items-center justify-center gap-2 mb-1 min-h-[3rem]">
        {ring !== undefined ? (
          <RingGauge percent={ring} value={value} unit={unit} />
        ) : (
          <>
            <span className="text-4xl font-bold text-[#8fd14f] tabular-nums">
              {value}
              {unit}
            </span>
            {trend && (
              <span className={trend === 'up' ? 'text-[#8fd14f]' : 'text-[#e5484d]'}>
                {trend === 'up' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
              </span>
            )}
          </>
        )}
      </div>

      {rows && rows.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1e2530] flex flex-col gap-2.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-[#8a93a6] flex items-center gap-1">
                {r.label}
                {r.info && (
                  <span title={r.info}>
                    <Info size={12} className="text-[#4b5563]" />
                  </span>
                )}
              </span>
              <span className="text-white font-medium tabular-nums">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RingGauge({ percent, value, unit }: { percent: number; value: string; unit?: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1e2530" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#8fd14f"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white tabular-nums">
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}
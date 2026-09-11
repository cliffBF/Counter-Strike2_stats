export default function RangeCard({
  title,
  value,
  good,
  subtitle,
  min,
  max,
  percent,
}: {
  title: string;
  value: string;
  good: boolean;
  subtitle: string;
  min: string;
  max: string;
  percent: number;
}) {
  const clamped = Math.max(2, Math.min(98, percent));
  const accent = good ? '#8fd14f' : '#e5484d';

  return (
    <div
      className="rounded-2xl border border-[#1e2530] bg-[#12161f]/80 backdrop-blur-sm p-5 flex-1"
      style={{ borderLeftWidth: 3, borderLeftColor: accent }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-lg font-bold tabular-nums" style={{ color: accent }}>
          {value}
        </span>
      </div>
      <p className="text-xs text-[#6b7280] mb-3">{subtitle}</p>
      <div
        className="relative h-1.5 rounded-full"
        style={{ background: 'linear-gradient(90deg,#e5484d,#e8c547,#8fd14f)' }}
      >
        <div
          className="absolute top-1/2 w-1 h-3 bg-white rounded-full shadow"
          style={{ left: `${clamped}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-[#6b7280] tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
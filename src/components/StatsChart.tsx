"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatsChart({ historyData }: { historyData: any[] }) {
  const allDiffData = historyData.map((d, index, array) => {
    const date = new Date(d.createdAt);
    const sessionKills = index === 0 ? 0 : d.kills - array[index - 1].kills;
    const sessionDeaths = index === 0 ? 0 : d.deaths - array[index - 1].deaths;

    return {
      ...d,
      sessionKills,
      sessionDeaths,
      displayDate: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
    };
  })

  .filter((d, index) => index > 0 && (d.sessionKills !== 0 || d.sessionDeaths !== 0));

  const recentData = allDiffData.slice(-20).map((d, index, array) => ({
    ...d,
    matchIndex: `match ${index + 1}`
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={recentData} margin={{ top: 10, right: 35, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="matchIndex" 
            stroke="#9CA3AF"
            interval={0}
            angle={-30}
            textAnchor="end"
            fontSize={11}
          />
          <YAxis 
            stroke="#9CA3AF" 
            domain={[0, (dataMax: number) => Math.max(dataMax + 5, 30)]} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} 
            labelFormatter={(label, payload) => payload?.[0]?.payload?.displayDate} 
          />
          <Legend verticalAlign="top" height={36} />
          <Line 
            type="monotone" 
            dataKey="sessionKills" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            name="Kills" 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="sessionDeaths" 
            stroke="#ef4444" 
            strokeWidth={3} 
            name="Deaths" 
            dot={{ r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
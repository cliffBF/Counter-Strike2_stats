"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// どんなデータが来るか型を定義
export default function StatsChart({ historyData }: { historyData: any[] }) {
  // DBの長すぎる日時データを「MM/DD HH:mm」の短い形式に変換
  const formattedData = historyData.map((d, index, array) => {
    const date = new Date(d.createdAt);
    const sessionKills = index === 0 ? 0 : d.kills - array[index - 1].kills;
    const sessionDeaths = index === 0 ? 0 : d.deaths - array[index - 1].deaths;
    return {
      ...d,
      displayDate: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
      matchIndex: `${index + 1}`
    };
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="matchIndex" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={(label, payload) => payload?.[0]?.payload?.displayDate} />
          <Legend />
          <Line type="monotone" dataKey="sessionKills" stroke="#3b82f6" strokeWidth={3} name="kills" />
<Line type="monotone" dataKey="sessionDeaths" stroke="#ef4444" strokeWidth={3} name="deaths" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
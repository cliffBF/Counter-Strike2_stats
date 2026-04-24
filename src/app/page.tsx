// src/app/page.tsx

export default async function Home() {
  const API_KEY = '3218CF8742015245AB58A12D3D06ECE6';
  const STEAM_ID = '76561199152725726';

  //プレイヤーの基本情報を取得するエンドポイントに変更
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`;
  const res = await fetch(url);
  const data = await res.json();

  //取得したJSONからプレイヤー情報を抽出
  const player = data.response?.players[0];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">CS2 Stats</h1>
      
      {player ? (
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm w-fit bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={player.avatarfull} alt="Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{player.personaname}</h2>
            <p className="text-sm text-green-600 font-bold">✓ Steam API連携済み</p>
          </div>
        </div>
      ) : (
        <p className="text-red-500">プレイヤー情報が取得できませんでした</p>
      )}
    </main>
  );
}
export const dynamic = 'force-dynamic';

import {NextResponse} from 'next/server';
//prismaを使うためにインポート
import {PrismaClient} from '@prisma/client';

//prisma初期化
//constはjavaで言うfinal、cppもconst
const prisma = new PrismaClient();

/*
    javaのinterfaceはメソッド実装を支持するが、
    TSはデータはどのプロパティと型を持っているかを定義する
*/

//戦績データの型を定義
interface SteamStat{
    name: string;
    value: number; //cpp javaと違いtsは数字系の型はすべてnumberでok
}

//Steamサーバから届くデータの型を定義
interface SteamApiResponse{
    playerstats?:{
        steamID: string;
        gameName: string;
        stats: SteamStat[];
    };
}

export async function GET(){
    const apiKey = process.env.STEAM_API_KEY;
    const steamId = process.env.STEAM_ID;
    const appId = 730;
    
    if (!apiKey || !steamId){
        return NextResponse.json(
        {error: 'APIキー/SteamIDが設定されていません'},
        {status: 500}
        );
    }

    const url = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${apiKey}&steamid=${steamId}&cacheBust=${Date.now()}`;

    try{
        const response = await fetch(url, {cache: 'no-store'});

    if(!response.ok){
        return NextResponse.json(
            {error: 'failed to getting data. is your steam profile public?'},
            {status: response.status}
        );
    }

    const data: SteamApiResponse = await response.json();

    //データが空だった場合
    if(!data.playerstats || !data.playerstats.stats){
        return NextResponse.json({error: '404 not found'}, {status: 404});
    }

    const statsArray = data.playerstats.stats;

    const killsData = statsArray.find(s => s.name === 'total_kills');
    const deathsData = statsArray.find(s => s.name === 'total_deaths');
    const matchesData = statsArray.find(s => s.name === 'total_matches_played');
    const headshotsData = statsArray.find(s => s.name === 'total_kills_headshot');
    const winsData = statsArray.find(s => s.name === 'total_wins');

    const kills = killsData ? killsData.value : 0;
    const deaths = deathsData ? deathsData.value : 0;
    const matches = matchesData ? matchesData.value : 0;
    const headshots = headshotsData ? headshotsData.value : 0;
    const wins = winsData ? winsData.value : 0;

    //HSrate計算
    const hsRate = kills > 0 ? (headshots / kills) * 100 : 0;

    //最新データを1件だけ取得
    const lastSaved = await prisma.playerStats.findFirst({
        where: {steamId: steamId},
        orderBy: {createdAt: 'desc'},
    })

    //初回保存とmatchsが増えた時のみDBに保存する
    if(!lastSaved || matches > lastSaved.matches){
        await prisma.playerStats.create({
            data: {
                steamId: steamId,
                kills: kills,
                deaths: deaths,
                matches: matches,
                hsRate: hsRate,
                wins: wins,
            },
        });
        console.log(`dyou won, the data saved. (total matches: ${matches})`);
    }else{
        console.log('data saving was skipped(you played deathmatch?)');
    }
    
    const historyData = await prisma.playerStats.findMany({
        where: { steamId: steamId },
        orderBy: { createdAt: 'asc' },
    });

    const latestData = historyData[historyData.length - 1];

    return NextResponse.json({
        message: 'success_confirmed',
        current: latestData,
        history: historyData 
    });

    }catch(error){
        console.error('APi Error:', error);
        return NextResponse.json(
            {error: '内部エラー'},
            {status: 500}
        );
    }
}

//デモンストレーション用のスクリプト

/*interface DemoPostRequest {
    kills: number;
    deaths: number;
    matches: number;
    wins: number;
    headshots: number;
}

export async function POST(request: Request) {
    const steamId = process.env.STEAM_ID;

    if (!steamId) {
        return NextResponse.json({ error: 'SteamIDが設定されていません' }, { status: 500 });
    }

    try {
        //デモスクリプトから送るJSON
        const body: DemoPostRequest = await request.json();
        const { kills, deaths, matches, wins, headshots } = body;

        //確認
        console.log(`[Demo POST] データ受信: matches=${matches}, kills=${kills}`);

        //最新のデータを取得して比較
        const lastSaved = await prisma.playerStats.findFirst({
            where: { steamId: steamId },
            orderBy: { createdAt: 'desc' },
        });

        //matchesが増えた時のみ保存(理由はdevmemo)
        if (!lastSaved || matches > lastSaved.matches) {
            const hsRate = kills > 0 ? (headshots / kills) * 100 : 0;

            await prisma.playerStats.create({
                data: {
                    steamId: steamId,
                    kills: kills,
                    deaths: deaths,
                    matches: matches,
                    hsRate: hsRate,
                    wins: wins,
                },
            });
            console.log(`[Demo POST] 試合終了: DBに保存しました (Total matches: ${matches})`);
        } else {
            console.log('[Demo POST] 試合数に変化がないため、保存をスキップしました');
        }

        //全履歴を更新画面
        const historyData = await prisma.playerStats.findMany({
            where: { steamId: steamId },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({
            message: 'demo_post_success',
            current: historyData[historyData.length - 1],
            history: historyData
        });

    } catch (error) {
        console.error('[Demo POST] Error:', error);
        return NextResponse.json({ error: '内部エラー' }, { status: 500 });
    }
}*/

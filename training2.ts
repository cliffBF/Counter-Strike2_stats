const fetchMatchData = async(): Promise<string> => {
    console.log("Steamサーバーにデータを要求中...");

    await new Promise(resolve => setTimeout(resolve, 2000));

    return "Mirageの試合データ(20キル)";
};

const main = async () => {
    const result = await fetchMatchData();

    console.log(`取得完了: ${result}`);
};

main();
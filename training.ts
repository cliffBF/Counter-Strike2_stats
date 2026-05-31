interface Match{
    map: string;
    kills: number;
}

const matches: Match[] = [
    {map: "Mirage", kills: 20},
    {map: "inferno", kills: 15},
    {map: "Nuke", kills: 25}
];

//const goodMatches = matches.filter(match => match.kills >= 20);
//const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
const calcKD = (kills: number, deaths: number): number => {
    return kills / deaths;
};

const myKills = 20;
const myDeaths = 8;
console.log(`KD: ${calcKD(myKills, myDeaths)} です`);
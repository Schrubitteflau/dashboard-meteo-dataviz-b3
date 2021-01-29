const fs = require("fs");

const data = fs.readFileSync("meteo.json", "utf8");
const meteo = JSON.parse(data);

const stationsToRemove = [
    "ST-BARTHELEMY METEO",
    "SAINT LAURENT",
    "CAYENNE-MATOURY",
    "MARIPASOULA",
    "KERGUELEN",
    "NOUVELLE AMSTERDAM",
    "GILLOT-AEROPORT",
    "TROMELIN",
    "EUROPA",
    "JUAN DE NOVA",
    "PAMANDZI",
    "GLORIEUSES"
];

function filterStations(stationsList)
{
    return stationsList.filter(station => !stationsToRemove.includes(station.n));
}

function getTotalPrecipitations(stationsList)
{
    return stationsList.reduce((total, station) => total + station.p, 0);
}

function getAverageTemperature(stationsList)
{
    const totalTemperatures = stationsList.reduce((total, station) => total + station.t, 0);

    return (totalTemperatures / stationsList.length);
}

function roundNumber(number)
{
    return +(number.toFixed(2));
}

for (const day of meteo)
{
    day.station = filterStations(day.station);
    day.p = roundNumber(getTotalPrecipitations(day.station));
    day.t = roundNumber(getAverageTemperature(day.station));
}

const json = JSON.stringify(meteo);
fs.writeFileSync("meteo_filtered.json", json, "utf8");
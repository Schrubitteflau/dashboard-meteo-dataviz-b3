/* Tableau d'objets de la forme (chaque objet correspond à 1 jour du mois) :
{
	d: Jour du mois (entier de 1 à 28)
	t: Températeur moyenne pour ce jour
    p: Total des précipitations de toutes les stations
    station: Tableau de toutes les stations :
    [
        {
            lat: Latitude (flottant)
            lng: Longitude (flottant)
            n: Nom de la station (chaîne de caractères en majuscule)
            p: Total de toutes les précipitations
            t: Température moyenne (de toutes les heures enregistrées)
            hours:
            [
                {
                    h: Heure de l'observation (nombre entier)
                    t: Température observée
                    p: Précipitations enregistrées depuis la dernière observation
                }
            ]
            ... ~7 autres heures (nombre variable)
        }
        ... ~50 autres stations (nombre variable)
    ]
}
Attention, le nombre d'heures enregistrées (par station et par jour) et le nombre de stations (par jour)
ne sont pas toujours identiques.
*/

export function transformTemperature(temperature)
{
    return +(temperature / 100).toFixed(2);
}

// Classe qui permet de récupérer les données d'un jour spécifique
class DayData
{
    constructor(data)
    {
        this.rawData = data;
    }

    getValueByKey(key)
    {
        return this.rawData[key];
    }

    getDayNumber()
    {
        return this.getValueByKey("d");
    }

    getStations()
    {
        const stationsRaw = this.getValueByKey("station");
        const stations = stationsRaw.map(data => new StationData(data, this));

        return stations;
    }

    getStationsCount()
    {
        return this.getValueByKey("station").length;
    }

    // Température moyenne pour ce jour
    getAverageTemperature()
    {
        return transformTemperature(this.getValueByKey("t"));
    }

    // Températures moyennes minimales et maximales en prenant en compte toutes les stations de ce jour
    getAverageTemperatureBounds()
    {
        // Toutes les stations de ce jour
        const stations = this.getStations();
        // Toutes les températures moyennes des stations
        const averageTemperatures = stations.map(station => station.getAverageTemperature());
        // Valeur de température moyenne minimum
        const min = Math.min(...averageTemperatures);
        // Toutes les stations ayant pour valeur moyenne de température la température minimale
        const minStations = stations.filter(station => station.getAverageTemperature() === min);
        // Valeur de température moyenne maximum
        const max = Math.max(...averageTemperatures);
        // Toutes les stations ayant pour valeur moyenne de température la température maximale
        const maxStations = stations.filter(station => station.getAverageTemperature() === max);

        return {
            min,
            minStations,
            max,
            maxStations
        };
    }

    getTotalPrecipitations()
    {
        return this.getValueByKey("p");
    }

    // Niveaux de précipitations minimums et maximums en prenant en compte toutes les stations de ce jour
    getPrecipitationsBounds()
    {
        // Toutes les stations de ce jour
        const stations = this.getStations();
        // Tous les totaux de précipitations des stations
        const precipitations = stations.map(station => station.getTotalPrecipitations());
        // Valeur de total de précipitations minimum
        const min = Math.min(...precipitations);
        // Toutes les stations ayant pour valeur totale de précipitations le total minimal
        const minStations = stations.filter(station => station.getTotalPrecipitations() === min);
        // Valeur de total de précipitations maximale
        const max = Math.max(...precipitations);
        // Toutes les stations ayant pour valeur totale de précipitations le total maximal
        const maxStations = stations.filter(station => station.getTotalPrecipitations() === max);

        return {
            min,
            minStations,
            max,
            maxStations
        };
    }
}

// Classe qui permet de récupérer les données d'un jour spécifique
class StationData
{
    constructor(data, day)
    {
        this.rawData = data;
        this.relatedDay = day;
    }

    getValueByKey(key)
    {
        return this.rawData[key];
    }

    getRelatedDay()
    {
        return this.relatedDay;
    }

    getLongitude()
    {
        return this.getValueByKey("lng");
    }

    getLatitude()
    {
        return this.getValueByKey("lat");
    }

    getName()
    {
        return this.getValueByKey("n");
    }

    getAverageTemperature()
    {
        // On divise la température par 100 et on l'arrondit à 2 chiffres après la virgule
        // Le "+" devant permet de caster en nombre
        return transformTemperature(this.getValueByKey("t"));
    }

    getTotalPrecipitations()
    {
        return this.getValueByKey("p");
    }

    getHoursList()
    {
        return new HoursListData(this.getValueByKey("hours"), this);
    }

    // Nombre d'observations effectuées ce jour-ci pour cette station
    getHoursCount()
    {
        return this.getValueByKey("hours").length;
    }

    toString()
    {
        return this.getName();
    }
}

// Récupérer des valeurs depuis une liste d'heures pour une station précise dans un jour précis
class HoursListData
{
    constructor(data, relatedStation)
    {
        this.hours = data.map(hour => new HourData(hour, this));
        this.relatedStation = relatedStation;
    }

    getHours()
    {
        return this.hours;
    }

    // Bornes de températures concernant une liste d'heures (d'une station et pour un jour)
    getTemperatureBounds()
    {
        // Tableau de toutes les valeurs de température
        const temperatures = this.hours.map(hourData => hourData.getTemperature());
        // Valeur de température la plus petite
        const min = Math.min(...temperatures);
        // Valeur de température la plus grande
        const max = Math.max(...temperatures);
        // Liste des heures (objets HourData) qui ont pour valeur de température la plus petite de la liste
        const minHours = this.hours.filter(hourData => hourData.getTemperature() === min);
        // Liste des heures (objets HourData) qui ont pour valeur de température la plus grande de la liste
        const maxHours = this.hours.filter(hourData => hourData.getTemperature() === max);

        return {
            min: transformTemperature(min),
            minHours,
            max: transformTemperature(max),
            maxHours
        };
    }

    // Bornes de précipitations concernant une liste d'heures (d'une station et pour un jour)
    getPrecipitationsBounds()
    {
        // Tableau de toutes les valeurs de précipitations
        const precipitations = this.hours.map(hourData => hourData.getPrecipitations());
        // Valeur de précipitations la plus petite
        const min = Math.min(...precipitations);
        // Valeur de précipitations la plus grande
        const max = Math.max(...precipitations);
        // Liste des heures (objets HourData) qui ont pour valeur de précipitations la plus petite de la liste
        const minHours = this.hours.filter(hourData => hourData.getPrecipitations() === min);
        // Liste des heures (objets HourData) qui ont pour valeur de précipitations la plus grande de la liste
        const maxHours = this.hours.filter(hourData => hourData.getPrecipitations() === max);

        return {
            min,
            minHours,
            max,
            maxHours
        };
    }
}

// Récupérer des valeurs concernant une observation à une heure précise pour une station
class HourData
{
    constructor(data, relatedHoursList)
    {
        this.rawData = data;
        this.relatedHoursList = relatedHoursList;
    }

    getValueByKey(key)
    {
        return this.rawData[key];
    }

    getHour()
    {
        return this.getValueByKey("h");
    }

    getTemperature()
    {
        return this.getValueByKey("t");
    }

    getPrecipitations()
    {
        return this.getValueByKey("p");
    }

    toString()
    {
        return `${this.getHour()}h`
    }
}

class MeteoDataProvider
{
    // path : fichier à récupérer
    constructor(path)
    {
        this.path = path;
        this.isLoaded = false;
    }

    /* Chargement du fichier JSON spécifié dans le constructeur et on retourne une promesse
    résolue sans passer de valeur car on interagira avec les données via la classe MeteoDataProvider */
    async load()
    {
        // Si les données sont déjà chargées, on résout la promesse
        if (this.isLoaded) return;

        // Chargement des données au format JSON
        const req = await fetch(this.path);
        const json = await req.json();
    
        // Formattage
        this.formatData(json);
        this.daysList = json;

        this.isLoaded = true;
    }

    /* Formattage des données : on utilisera soit un tableau des jours, soit un objet
    dont les clés seront les jours du mois selon les besoins */
    formatData(data)
    {
        const formatted = {};

        for (const dayData of data)
        {
            formatted[dayData.d] = dayData;
        }

        this.days = formatted;
    }

    // Récupérer les données d'un jour du mois
    getDay(dayNumber)
    {
        return new DayData(this.days[dayNumber]);
    }

    // Retourne le dernier jour
    getLastDay()
    {
        const daysCount = this.daysList.length;

        return new DayData(this.daysList[daysCount - 1]);
    }

    // Récupérer tous les jours
    getAllDays()
    {
        return this.daysList.map(day => new DayData(day));
    }
}

// Création d'une instance unique qui sera utilisée partout dans le programme
const provider = new MeteoDataProvider("data/meteo_filtered.json");

// On l'exporte du module
export default provider;
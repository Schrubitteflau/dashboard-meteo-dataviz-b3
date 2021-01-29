import provider, { transformTemperature } from "./MeteoDataProvider.js";

// Permet de préparer les données nécessaires à la création des différents graphiques
// On part du principe que les données sont déjà chargées par MeteoDataProvider
class DataPreparator
{
    // Prépare les données nécessaires pour créer la carte
    forMap(day)
    {
        const stations = day.getStations();

        // Nom de la station, coordonnées et température moyenne
        const points = stations.map(station => ({
            name: station.getName(),
            value: [
                station.getLongitude(),
                station.getLatitude(),
                station.getAverageTemperature(),
                station.getTotalPrecipitations()
            ]
        }));
    
        // Bornes des températures moyennes (minimum et maximum)
        const temperatureBounds = day.getAverageTemperatureBounds();
    
        // Bornes des précipitations totales
        const precipitationsBounds = day.getPrecipitationsBounds();
    
        return { points, temperatureBounds, precipitationsBounds };
    }

    // Prépare les données nécessaires pour créer le line chart d'une station
    forStationLineChart(station)
    {
        const hoursList = station.getHoursList().getHours();
        // Un tableau de tableaux au format [ Temps, Température, Précipitations ]
        const data = hoursList.map(hour =>
        {
            return [
                `${hour.getHour()}h`,
                transformTemperature(hour.getTemperature()),
                hour.getPrecipitations()
            ];
        });

        return data;
    }

    // Prépare les données nécessaires pour créer le line chart de tous les jours
    forDaysLineChart()
    {
        const days = provider.getAllDays();
        
        const data = days.map(day =>
        {
            return [
                `j${day.getDayNumber()}`,
                day.getAverageTemperature(),
                +(day.getTotalPrecipitations().toFixed(2))
            ]
        });

        return data;
    }
}

const preparator = new DataPreparator();

export default preparator;
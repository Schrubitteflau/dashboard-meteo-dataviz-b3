// Graphiques
import daysLineChartController from "./DaysLineChartController.js";
import mapController from "./MapController.js";
import stationLineChartController from "./StationLineChartController.js";

// Gestion des informations textuelles
import MapInfosController from "./MapInfosController.js";

// Gestion des mises à jour de données dynamiques
import FiltersController from "./FiltersController.js";

// Prépare les données pour les différents graphiques
import dataPreparator from "./DataPreparator.js";

// Permet de récupérer des données météo après chargement
import provider from "./MeteoDataProvider.js";

const mapInfosController = new MapInfosController({
    day: {
        title: document.getElementById("dayTitle"),
        infos: document.getElementById("dayGenerals"),
        precipitations: document.getElementById("dayPrecipitations"),
        temperature: document.getElementById("dayTemperature")
    },
    station: {
        title: document.getElementById("stationTitle"),
        infos: document.getElementById("stationGenerals"),
        precipitations: document.getElementById("stationPrecipitations"),
        temperature: document.getElementById("stationTemperature")
    },
});

const filtersController = new FiltersController({
    day: {
        filter: document.getElementById("daySlider"),
        dynamicLabel: document.getElementById("selectedDayLabel"),
    }
});

stationLineChartController
    .setXAxisName("Heure")
    .setTitle("Aucune station sélectionnée")
    .init(document.getElementById("stationLineChart"))
;

daysLineChartController
    .setTitle("Évolution des températures et des précipitations au fil des jours")
    .setXAxisName("Jour")
    .init(document.getElementById("dayLineChart"))
;

async function main()
{
    // Chargement de la carte
    await mapController.init(document.getElementById("mapChart"));

    // À partir de là, les données météo sont chargées, on peut utiliser "provider"
    await provider.load();

    // Jour maximum dynamique pour le slider
    filtersController.setMaxDay(provider.getLastDay().getDayNumber());

    // Initialisation avec le jour par défaut
    const selectedDay = filtersController.getSelectedDay();
    mapInfosController.showDayDetails(selectedDay);
    mapController.setDay(selectedDay);

    // Initialisation avec tous les jours
    daysLineChartController
        .setData(dataPreparator.forDaysLineChart())
        .update()
    ;

    // Lors du changement de jour
    filtersController.on("dayChange", day =>
    {
        // On met à jour la carte
        mapController.setDay(day);

        // On met à jour les informations textuelles concernant le jour
        mapInfosController.showDayDetails(day);
    });

    // Lors du clic sur une station, on met à jour les données affichées (texte + graphiques)
    mapController.on("stationClick", station =>
    {
        const stationLineChartData = dataPreparator.forStationLineChart(station);
        const stationName = station.getName();
        const day = station.getRelatedDay().getDayNumber();

        // Mise à jour des données texte
        mapInfosController.showStationDetails(station);
        
        // Mise à jour du graphique de cette station
        stationLineChartController
            .setTitle(`Station ${stationName}, jour ${day}`)
            .setData(stationLineChartData)
            .update()
        ;
    });

    // Lorsque l'on redimensionne la fenêtre, on redimensionne également les graphiques
    window.addEventListener("resize", () =>
    {
        stationLineChartController.resize();
        daysLineChartController.resize();
        mapController.resize();
        console.log("resize");
    });
}

main();
import mapConfig from "./MapConfig.js";
import preparator from "./DataPreparator.js";
import EventEmitter from "./EventEmitter.js";

async function loadGeoJSON()
{
    // Chargement des données GeoJSON pour créer les contours des départements
    const response = await fetch("/data/departements_FR.json");
    return response.json();
}

class MapController extends EventEmitter
{
    constructor()
    {
        super();

        this.resetMergeOptions();
    }

    resize()
    {
        this.mapChart.resize();
    }

    resetMergeOptions()
    {
        // Objet utilisé pour mettre à jour les options du graphique (mise à jour de données)
        this.mergeOptions = { };
    }

    async init(container)
    {
        // Récupération des données GeoJSON
        const geoJSON = await loadGeoJSON();

        // Création de la carte dans ECharts
        echarts.registerMap("France", geoJSON/*, {
           Guyane: {
                left: 0,
                top: 41,
                width: 1
            }
        }*/);

        // Création de l'objet qui permet de manipuler la carte
        this.mapChart = echarts.init(container, null, {
            // Par défaut, le graphique est créé dans un <canvas>
            //renderer: "svg"
        });

        // Obligé de faire comme ça, sinon ECharts rebind la valeur de this
        this.mapChart.on("click", (params) => this.handleClick(params));

        // On initialise la carte avec les options statiques (sans les données)
        this.mapChart.setOption(mapConfig);
    }

    // Lors du clic sur la carte
    handleClick({ componentType, seriesName, dataIndex })
    {
        // Si on a cliqué sur un point correspondant à une station météo
        if (componentType === "series" && seriesName === "stations_points")
        {
            // dataIndex permet de retrouver les informations concernant la station
            const stationData = this.currentDay.getStations()[dataIndex];

            this.emit("stationClick", stationData);
        }
    }

    // Mise à jour de l'objet mergeOptions pour définir de nouveaux points sur la carte
    setPoints(points)
    {
        this.mergeOptions.series = [ { data: points } ];
    }

    // Mise à jour de l'objet mergeOptions pour définir de nouvelles bornes de températures
    setTemperatureBounds({ min, max })
    {
        this.mergeOptions.visualMap = [ {
            min,
            max
        } ];
    }

    setPrecipitationBounds({ max })
    {
        this.mergeOptions.visualMap = [ {
            min: 0,
            max
        } ];
    }

    // Mise à jour de la carte en fonction des nouvelles données spécifiées
    update()
    {
        // L'objet mergeOptions sera fusionné avec la configuration déjà présente
        this.mapChart.setOption(this.mergeOptions);
        
        // Puis on réinitialise cet objet
        this.resetMergeOptions();
    }

    setDay(day)
    {
        // Affichage du chargement
        this.showLoading();

        // Sauvegarde du jour sélectionné
        this.currentDay = day;

        // Préparation des données météo pour le jour spécifié
        const { points, precipitationsBounds } = preparator.forMap(day);

        // Modification des données
        this.setPoints(points);
        this.setPrecipitationBounds(precipitationsBounds);

        // Application de ces données
        this.update();

        // Suppression du chargement
        this.hideLoading();
    }

    // Affiche un écran de chargement sur la carte
    showLoading()
    {
        this.mapChart.showLoading();
    }

    // Supprime l'écran de chargement de la carte
    hideLoading()
    {
        this.mapChart.hideLoading();
    }
}

const controller = new MapController();

export default controller;
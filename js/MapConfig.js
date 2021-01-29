import { map as colors } from "./Colors.js";

// Configuration statique de la carte interactive
export default {
    backgroundColor: colors.background,
    title: {
        text: "Carte des précipitations et températures pour chaque station",
        subtext: "Style inspiré de cette page",
        sublink: "https://echarts.apache.org/examples/en/editor.html?c=scatter-map",
        x: "center",
        textStyle: {
            color: colors.titleText
        },
        subtextStyle: {
            color: colors.titleSubtext
        }
    },
    tooltip: {
        // Zone de texte affichée lorsque l'on passe la souris sur un point
        trigger: "item",
        formatter: ({ name, value }) =>
            `${name}<br>
            Température moyenne : ${value[2]} °C<br>
            Précipitations totales : ${value[3]} mm<br>
            Cliquez pour plus de détails`
    },
    visualMap: [
        {
            // Ce n'est pas une liste de valeurs, mais une intervalle
            type: "continuous",
            // L'index 3 du tableau values correspond au total des précipitations
            dimension: "3",

            // Définition des bornes (précipitations)
            min: 0,
            //max est défini dynamiquement
            text: [ "Humide", "Sec" ],

            // Permet de calculer des valeurs intermédiaires entre les paliers
            calculable: true,
            inRange: {
                // Paliers de couleurs du plus sec au plus humide
                color: [ colors.dry, colors.wet ]
            },
            textStyle: {
                color: colors.visualMapText
            }
        }
    ],
    // Composant de coordonnées géographiques (permet de prendre en charge latitudes et longitudes)
    geo: {
        // S'applique pour la carte enregistrée précédemment "France"
        map: "France",
        // On ne peut pas zoomer/dézoomer
        roam: false,
        // Style de la carte
        itemStyle: {
            // Couleur de fond
            areaColor: colors.geoArea,
            // Couleur des contours
            borderColor: colors.geoBorder
        },
        // Style de la carte au survol de la souris
        emphasis: {
            itemStyle: {
                // Couleur de fond
                areaColor: colors.geoEmphasisArea,
                // Couleur des contours
                borderColor: colors.geoEmphasisBorder
            },
            label: {
                // On n'affiche pas le nom de la région au survol de la souris
                show: false
            }
        }
    },
    // Une série représente une série de valeurs, traduites visuellement par un diagramme
    series: [
        {
            // Nom unique
            name: "stations_points",
            // Utilisera le composant "geo" précédemment défini
            coordinateSystem: "geo",
            // Données utilisées
            //data: stationPoints,
            // Point avec effet sympa
            type: "effectScatter",
            // Effet affiché uniquement lorsque l'on passe la souris sur le point
            showEffectOn: "emphasis",
            rippleEffect: {
                brushType: "stroke"
            },
            // Largeur du point fixe
            symbolSize: 20,
            // Affichage de texte pour chaque point
            label: {
                show: true,
                // Position relative à celle du point
                position: ["100%", "-50%"],
                // Le texte correspond à la température en °C arrondie à l'entier le plus proche
                formatter: ({ value }) => Math.round(value[2]),
                // Taille de la police
                fontSize: 14,
                // Écrit en gras
                fontWeight: "bold"
            }
        },
    ]
};
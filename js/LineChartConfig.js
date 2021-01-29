import { lineChart as colors } from "./Colors.js";

export default {
    // Couleur de fond
    backgroundColor: colors.background,
    // Titre
    title: {
        subtext: "Activer les deux ordonnées permet de comparer leurs évolutions",
        x: "center",
        textStyle: {
            color: colors.titleText,
            overflow: "break",
            width: 400
        },
        subtextStyle: {
            color: colors.titleSubtext
        }
    },
    dataset: {
        source: [], //données dynamiques
        dimensions: [ "Time", "Temperature", "Precipitations" ]
    },
    // Lorsque l'on passe la souris sur le graphique, une infobulle est affichée
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "cross"
        }
    },
    textStyle: {
        color: colors.text
    },
    legend: {
        data: [ "Température", "Précipitations" ],
        top: "bottom",
        textStyle: {
            color: colors.legendText
        }
    },
    // Axe des abscisses
    xAxis: {
        // Catégorie (et non pas une liste de valeurs)
        type: "category",
        //name : Identifiant unique de l'axe (dynamique car vaut soit "Heure" soit "Jour")
        // Affiché au milieu
        nameLocation: "middle",
        // Les courbes partiront toujours de l'axe gauche vers l'axe droit sans espace vide
        boundaryGap: false,
        // Les paliers de cet axe sont alignés avec les points
        axisTick: {
            alignWithLabel: true
        },
        // Ligne de l'axe
        axisLine: {
            lineStyle: {
                color: colors.timeAxis
            },
            // S'affichera en bas du graphique, et non pas à la valeur 0 des ordonnées
            onZero: false
        }
    },
    yAxis: [
        {
            // Liste de valeurs
            type: "value",
            // Identifiant unique de l'axe
            name: "Température",
            // Valeur minimale dynamique
            min: value => Math.floor(value.min - 2),
            // Valeur maximale dynamique
            max: value => Math.floor(value.max + 2),
            // À gauche du graphique
            position: "left",
            // Ligne verticale gauche (ligne de l'axe)
            axisLine: {
                show: true,
                lineStyle: {
                    color: colors.temperatureSerie
                }
            },
            // Label textuel pour représenter les paliers de valeurs
            axisLabel: {
                formatter: "{value} °C"
            },
            // Ne pas afficher de ligne intermédiaire
            splitLine: {
                show: false
            }
        },
        {
            // Liste de valeurs
            type: "value",
            // Identifiant unique de l'axe
            name: "Précipitations",
            // Valeur minimale dynamique
            min: value => Math.floor(value.min - 2),
            // Valeur maximale dynamique
            max: value => Math.floor(value.max + 2),
            // À droite du graphique
            position: "right",
            // Ligne verticale droite (ligne de l'axe)
            axisLine: {
                show: true,
                lineStyle: {
                    color: colors.precipitationsSerie
                }
            },
            // Label textuel pour représenter les paliers de valeurs
            axisLabel: {
                formatter: "{value} mm"
            },
            // Ne pas afficher de ligne intermédiaire
            splitLine: {
                show: false
            }
        }
    ],
    series: [
        {
            // Identifiant de la série
            name: "Température",
            type: "line",
            // Axe vertical n°1
            yAxisIndex: 0,
            // Dimensions du dataset auxquelles se référer
            encode: {
                x: "Time",
                y: "Temperature"
            },
            // Couleur de la ligne
            lineStyle: {
                color: colors.temperatureSerie
            },
            // Couleur des points de la ligne
            itemStyle: {
                color: colors.temperatureSerie
            },
            // Taille des points de la ligne
            symbolSize: 8,
            // La ligne sera courbe
            smooth: true
        },
        {
            // Identifiant de la série
            name: "Précipitations",
            type: "line",
            // Axe vertical n°2
            yAxisIndex: 1,
            // Dimensions du dataset auxquelles se référer
            encode: {
                x: "Time",
                y: "Precipitations"
            },
            // Couleur de la ligne
            lineStyle: {
                color: colors.precipitationsSerie
            },
            // Couleur des points de la ligne
            itemStyle: {
                color: colors.precipitationsSerie
            },
            // Taille des points de la ligne
            symbolSize: 8,
            // La ligne sera courbe
            smooth: true
        },
    ]
};
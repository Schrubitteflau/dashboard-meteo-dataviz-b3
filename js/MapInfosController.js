/* Retourne une chaîne de caractères qui représente tous les éléments du tableau array, séparées
par separator, avec un paramètre maxIterations pour indiquer un nombre maximum d'éléments à
ajouter dans la chaîne de caractères */
function enumArray(array, separator, maxIterations)
{
    if (array.length > maxIterations)
    {
        let ret = "";

        for (let i = 0; i < maxIterations; i++)
        {
            ret += array[i] + separator;
        }

        ret += `et ${array.length - maxIterations} autres...`;

        return ret;
    }

    return array.join(separator);
}

// Calcule la proportion que représente a par rapport à b (qui est donc plus grand)
// Et arrondit à deux chiffres après la virgule
function percentage(a, b)
{
    if (a === 0) return 0;

    return +(a / b * 100).toFixed(2);
}

export default class MapInfosController
{
    /* elements :
    {
        day: {
            title,
            infos,
            precipitations,
            temperature
        },
        station: {
            title,
            infos,
            precipitations,
            temperature
        }
    }
    */
    constructor(elements)
    {
        this.elements = elements;
    }
    
    selectDayElement(elementName)
    {
        this.selected = this.elements.day[elementName];

        return this;
    }

    selectStationElement(elementName)
    {
        this.selected = this.elements.station[elementName];

        return this;
    }

    // Insère du code HTML
    setHTML(html)
    {
        /* On n'insère pas directement le code HTML dans l'élément, on l'insère dans son 1er enfant
        qui porte la classe "dynamic-content" */
        const $element = this.selected.querySelector(".dynamic-content");

        $element.innerHTML = html;

        return this;
    }

    /* On ne modifie pas le contenu de l'élément sélectionné mais plutôt celui de son 1er enfant
    qui porte la classe "dynamic-content" */
    getDynamicContentElement()
    {
        return this.selected.querySelector(".dynamic-content");
    }

    // Vide le contenu HTML de la partie dynamique de l'élément sélectionné
    reset()
    {
        this.getDynamicContentElement().innerHTML = "";

        return this;
    }

    // Ajoute une ligne de texte
    addLine(text)
    {
        const $container = document.createElement("div");
        $container.classList.add("dynamic-content-line")
        $container.innerText = text;

        this.getDynamicContentElement().appendChild($container)

        return this;
    }

    // Ajoute une ligne de texte et écrase le contenu existant
    setLine(text)
    {
        return this.reset().addLine(text);
    }

    showDayDetails(dayData)
    {
        const temperatureBounds = dayData.getAverageTemperatureBounds();
        const precipitationsBounds = dayData.getPrecipitationsBounds();

        this
            .selectDayElement("title")
            .setLine(`Jour ${dayData.getDayNumber()}`)
            .selectDayElement("infos")
            .setLine(`${dayData.getStationsCount()} stations`)
            .selectDayElement("precipitations")
            .setLine(`Total : ${dayData.getTotalPrecipitations().toFixed(2)} mm`)
            .addLine(`Minimum : ${precipitationsBounds.min} mm à ${enumArray(precipitationsBounds.minStations, ", ", 5)}`)
            .addLine(`Maximum : ${precipitationsBounds.max} mm à ${enumArray(precipitationsBounds.maxStations, ", ", 5)}`)
            .selectDayElement("temperature")
            .setLine(`Moyenne : ${dayData.getAverageTemperature()} °C`)
            .addLine(`Minimum : ${temperatureBounds.min} °C à ${enumArray(temperatureBounds.minStations, ", ", 5)}`)
            .addLine(`Maximum : ${temperatureBounds.max} °C à ${enumArray(temperatureBounds.maxStations, ", ", 5)}`)
        ;
    }

    // Affichage des informations concernant une station
    showStationDetails(stationData)
    {
        const precipitationsBounds = stationData.getHoursList().getPrecipitationsBounds();
        const totalPrecipitations = stationData.getTotalPrecipitations();
        const dayTotalPrecipitations = stationData.getRelatedDay().getTotalPrecipitations();

        const temperatureBounds = stationData.getHoursList().getTemperatureBounds();
        const averageTemperature = stationData.getAverageTemperature();
        const temperatureDiff = averageTemperature - stationData.getRelatedDay().getAverageTemperature() ;
        const temperaturePrefix = temperatureDiff > 0 ? "+" : "";

        this
            .selectStationElement("title")
            .setLine(`Station ${stationData.getName()}, jour ${stationData.getRelatedDay().getDayNumber()}`)
            .selectStationElement("infos")
            .setLine(`Latitude : ${stationData.getLatitude()}`)
            .addLine(`Longitude : ${stationData.getLongitude()}`)
            .addLine(`${stationData.getHoursCount()} observations`)
            .selectStationElement("precipitations")
            .setLine(`Total : ${totalPrecipitations} mm`)
            .addLine(`Minimum : ${precipitationsBounds.min} mm à ${enumArray(precipitationsBounds.minHours, ", ", 15)}`)
            .addLine(`Maximum : ${precipitationsBounds.max} mm à ${enumArray(precipitationsBounds.maxHours, ", ", 15)}`)
            .addLine(`Représente ${percentage(totalPrecipitations, dayTotalPrecipitations)}% du total pour ce jour`)
            .selectStationElement("temperature")
            .setLine(`Moyenne : ${averageTemperature} °C`)
            .addLine(`Minimum : ${temperatureBounds.min} °C à ${enumArray(temperatureBounds.minHours, ", ", 15)}`)
            .addLine(`Maximum : ${temperatureBounds.max} °C à ${enumArray(temperatureBounds.maxHours, ", ", 15)}`)
            .addLine(`${temperaturePrefix}${temperatureDiff.toFixed(2)} °C par rapport à la moyenne de ce jour`);
        ;
    }
}

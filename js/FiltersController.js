import EventEmitter from "./EventEmitter.js";
import provider from "./MeteoDataProvider.js";

export default class FiltersController extends EventEmitter
{
    /*
        day: {
            filter,
            dynamicLabel
        }
    */
    constructor(elements)
    {
        super();

        this.elements = elements;

        this.initEvents();
    }

    setMaxDay(dayNumber)
    {
        this.getDayElement("filter").max = dayNumber;
    }

    getDayElement(elementName)
    {
        return this.elements.day[elementName];
    }

    getSelectedDayNumber()
    {
        return this.getDayElement("filter").value;
    }

    getSelectedDay()
    {
        return provider.getDay(this.getSelectedDayNumber());
    }

    initEvents()
    {
        const $dayFilter = this.getDayElement("filter");

        $dayFilter.addEventListener("input", () =>
        {
            this.getDayElement("dynamicLabel").innerText = $dayFilter.value;
        });

        $dayFilter.addEventListener("change", () =>
        {
            const dayNumber = $dayFilter.value;
            const dayData = provider.getDay(dayNumber);

            this.emit("dayChange", dayData);
        });
    }
}
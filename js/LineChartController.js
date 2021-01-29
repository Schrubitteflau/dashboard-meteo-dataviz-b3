import stationLineChartConfig from "./LineChartConfig.js";

export default class LineChartController
{
    constructor()
    {
        this.resetMergeOptions();
    }

    resize()
    {
        this.lineChart.resize();
    }

    resetMergeOptions()
    {
        // Objet utilisé pour mettre à jour les options du graphique (mise à jour de données)
        this.mergeOptions = { dataset: {} };
    }

    // Mise à jour du graphique en fonction des nouvelles données spécifiées
    update()
    {
        // L'objet mergeOptions sera fusionné avec la configuration déjà présente
        this.lineChart.setOption(this.mergeOptions);
        // Puis on réinitialise cet objet
        this.resetMergeOptions();

        return this;
    }

    setTitle(title)
    {
        this.mergeOptions.title = { text: title };

        return this;
    }

    setXAxisName(name)
    {
        this.mergeOptions.xAxis = { name };
        
        return this;
    }

    init(container)
    {
        this.lineChart = echarts.init(container);

        this.lineChart.setOption(stationLineChartConfig);
        this.lineChart.setOption(this.mergeOptions);

        return this;
    }

    // Nouvelles données
    setData(data)
    {
        this.mergeOptions.dataset.source = data;

        return this;
    }
}
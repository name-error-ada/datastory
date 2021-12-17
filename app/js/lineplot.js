function createPlotlyDataMeanWithSem(x, mean, sem, line_color, ci_color, name) {
    const bottom_values = mean.map((v, i) => v - sem[i]);
    const top_values = mean.map((v, i) => v + sem[i]);

    const main_trace = {
        x: x,
        y: mean,
        mode: 'lines',
        line: {
            color: line_color,
        },
        showlegend: name != undefined,
        name: name != undefined ? name : '',
    };
    const bottom_trace = {
        x: x,
        y: bottom_values,
        mode: 'lines',
        fill: 'none',
        line: {
            width: 0
        },
        showlegend: false,
        name: ''
    };
    const top_trace = {
        x: x,
        y: top_values,
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: ci_color,
        line: {
            width: 0
        },
        showlegend: false,
        name: '',
    };

    return [
        main_trace, bottom_trace, top_trace
    ]
}

function createGeneralSentimentEvolutionPlot(id, data) {
    const x = data['dates'];
    const mean = data['mean'];
    const sem = data['sem'];

    const layout = {
        title: 'Title',
        xaxis: {
            type: 'date',
            tickformat: '%B, %Y',
            title: 'Date'
        },
        yaxis: {
            tickmode: "array",
            ticktext: ["Negative (-1)", "Neutral (0)", "Positive (1)"],
            tickvals: [-1, 0, 1],
            range: [-1, 1],
            title: 'Sentiment (numeric value)'
        }
    };

    const traces = createPlotlyDataMeanWithSem(x, mean, sem, 'black', 'rgba(0, 0, 0, .1)', undefined);

    const config = {
        // displayModeBar: false, // hide bar
        // staticPlot: true, // disable moving and zooming
        responsive: true, // make plot resize with screen
    };

    Plotly.newPlot('myDiv', traces, layout, config);
}

$(() => {
    d3.json('data/general-sentiment-over-time.json').then(data =>
        createGeneralSentimentEvolutionPlot('myDiv', data));
});
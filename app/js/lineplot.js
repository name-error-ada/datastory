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

    Plotly.newPlot(id, traces, layout, config);
}

function createEmotionEvolution(id, data, normalized=false, to_enable_set=[]) {
    const layout = {
        xaxis: {
            title: 'Year'
        },
        yaxis: {
            title: 'Presence'
        }
    };

    const selectedEmotionSet = new Set(to_enable_set);
    const traces = data[normalized ? 'normalized_data' : 'data'].map(v => {
        let trace = {
            y: v['values'],
            x: data['year'],
            name: v['emotion'],
            mode: 'lines',
        };
        if(!selectedEmotionSet.has(v['emotion'])) {
            trace.visible = 'legendonly';
        }
        return trace
    });

    const config = {
        // displayModeBar: false, // hide bar
        // staticPlot: true, // disable moving and zooming
        responsive: true, // make plot resize with screen
    };

    Plotly.newPlot(id, traces, layout, config);
}

function showAttributeSentimentCorrelation(id, data) {
    const mainMain = ['rgb(255, 0, 0)', 'rgb(255, 153, 0)', 'rgb(0, 102, 255)', 'rgb(51, 204, 51)'];
    const ciColors = ['rgba(255, 0, 0, .1)', 'rgba(255, 153, 0, .1)', 'rgba(0, 102, 255, .1)', 'rgba(51, 204, 51, .1)'];

    const traces = data['values'].slice(0, 4).flatMap((v, i) => createPlotlyDataMeanWithSem(
        data['year'],
        v['mean'], 
        v['sem'], 
        mainMain[i], 
        ciColors[i],
        v['value']
    ));

    const layout = {
        xaxis: {
            title: 'Year'
        },
        yaxis: {
            title: 'Sentiment \n(-1 being negative, 1 being positive and 0 being neutral)'
        }
    };

    const config = {
        // displayModeBar: false, // hide bar
        staticPlot: true, // disable moving and zooming
        responsive: true, // make plot resize with screen
    };

    Plotly.newPlot(id, traces, layout, config);
}

$(() => {
    d3.json('data/general-sentiment-over-time.json').then(data =>
        createGeneralSentimentEvolutionPlot('myDiv', data));

    d3.json('data/empath_analysis.json').then(data => {
        createEmotionEvolution(
            'empathChart', 
            data, 
            false,
            ['plant', 'healthy_food', 'animal', 'water', 'death']);
        createEmotionEvolution(
            'normalizedEmpathChart', 
            data, 
            true,
            ['healthy_food', 'social_media', 'fear', 'children']);
    });

    d3.json('data/gender-sentiment-correlation.json').then(genderData => 
        showAttributeSentimentCorrelation('genderAttrSentimentPlots', genderData));
    d3.json('data/occupation-sentiment-correlation.json').then(occupationData => 
        showAttributeSentimentCorrelation('occupationAttrSentimentPlots', occupationData));
});
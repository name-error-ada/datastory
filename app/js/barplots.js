function createQuoteCountPerYearPlot(id, data) {
    var data = [
        {
            x: data['date'].map(d => new Date(d).getFullYear()),
            y: data['count'],
            type: 'bar'
        }
    ];

    const layout = {
        xaxis: {
            type: 'category',
            title: 'Year',
        },
        yaxis: {
            title: 'Number of quotes'
        }
    };

    const config = {
        staticPlot: true, // disable moving and zooming
        responsive: true, // make plot resize with screen
    };

    Plotly.newPlot(id, data, layout, config);
}


$(() => {
    d3.json('data/count_per_year.json').then(data =>
        createQuoteCountPerYearPlot('barPlot', data));
});
function createTopicPieChart(id, data) {
    const toPlot = [{
        values: data['values'],
        labels: data['topics'],
        type: 'pie'
    }];

    const layout = {};

    const config = {
        responsive: true, // make plot resize with screen
    }

    Plotly.newPlot(id, toPlot, layout, config);
}

$(() => {
    d3.json('data/proportion_of_topics.json').then(data =>
        createTopicPieChart('pieChart', data));
});
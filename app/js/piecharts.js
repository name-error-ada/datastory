function createTopicPieChart(id, data) {
    const toPlot = [{
        values: data['values'],
        labels: data['topics'],
        type: 'pie'
    }];

    var layout = {};

    Plotly.newPlot(id, toPlot, layout);
}

$(() => {
    d3.json('data/proportion_of_topics.json').then(data =>
        createTopicPieChart('pieChart', data));
});
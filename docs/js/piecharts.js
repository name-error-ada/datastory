"use strict";function createTopicPieChart(t,e){e=[{values:e.values,labels:e.topics,type:"pie"}];Plotly.newPlot(t,e,{})}$(function(){d3.json("data/proportion_of_topics.json").then(function(t){return createTopicPieChart("pieChart",t)})});
//# sourceMappingURL=piecharts.js.map

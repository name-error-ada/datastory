"use strict";function createPlotlyDataMeanWithSem(e,t,n,i,o,a){var l=t.map(function(e,t){return e-n[t]}),r=t.map(function(e,t){return e+n[t]});return[{x:e,y:t,mode:"lines",line:{color:i},showlegend:null!=a,name:null!=a?a:""},{x:e,y:l,mode:"lines",fill:"none",line:{width:0},showlegend:!1,name:""},{x:e,y:r,mode:"lines",fill:"tonexty",fillcolor:o,line:{width:0},showlegend:!1,name:""}]}function createGeneralSentimentEvolutionPlot(e,t){t=createPlotlyDataMeanWithSem(t.dates,t.mean,t.sem,"black","rgba(0, 0, 0, .1)",void 0);Plotly.newPlot(e,t,{xaxis:{type:"date",tickformat:"%B, %Y",title:"Date"},yaxis:{tickmode:"array",ticktext:["Negative (-1)","Neutral (0)","Positive (1)"],tickvals:[-1,0,1],range:[-1,1],title:"Sentiment (numeric value)"}},{responsive:!0})}function createEmotionEvolution(e,n){var t=2<arguments.length&&void 0!==arguments[2]&&arguments[2],i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:[],o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:"emotion",a={xaxis:{title:"Year"},yaxis:{title:t?"Presence (normalized by peak presence of the topic)":"Presence"}},l=new Set(i),t=n[t?"normalized_data":"data"].map(function(e){var t={y:e.values,x:n.year,name:e[o],mode:"lines"};return l.has(e[o])||(t.visible="legendonly"),t});Plotly.newPlot(e,t,a,{responsive:!0})}function showAttributeSentimentCorrelation(e,n){var i=["rgb(255, 0, 0)","rgb(255, 153, 0)","rgb(0, 102, 255)","rgb(51, 204, 51)"],o=["rgba(255, 0, 0, .1)","rgba(255, 153, 0, .1)","rgba(0, 102, 255, .1)","rgba(51, 204, 51, .1)"],t=n.values.slice(0,4).flatMap(function(e,t){return createPlotlyDataMeanWithSem(n.year,e.mean,e.sem,i[t],o[t],e.value)});Plotly.newPlot(e,t,{xaxis:{title:"Year"},yaxis:{title:"Sentiment \n(-1 is negative, 1 is positive and 0 is neutral)"}},{staticPlot:!0,responsive:!0})}$(function(){d3.json("data/general-sentiment-over-time.json").then(function(e){return createGeneralSentimentEvolutionPlot("sentimentChange",e)}),d3.json("data/empath_analysis.json").then(function(e){createEmotionEvolution("normalizedEmpathChart",e,!0,["healthy_food","social_media","fear","children"])}),d3.json("data/topic_evolution.json").then(function(e){createEmotionEvolution("topicChart",e,!1,["Diet","Environment","Ethics","Health","Lifestyle"],"topic")}),d3.json("data/gender-sentiment-correlation.json").then(function(e){return showAttributeSentimentCorrelation("genderAttrSentimentPlots",e)}),d3.json("data/occupation-sentiment-correlation.json").then(function(e){return showAttributeSentimentCorrelation("occupationAttrSentimentPlots",e)})});
//# sourceMappingURL=lineplot.js.map

class LinePlot {
    constructor(id, data) {
        this.data = data;
        this.svg = d3.select(`#${id}`);
        this.svgSize = undefined;
        this.margin = undefined;
    }

    setup() {
        let [sizeX, sizeY] = [700, 500];
        this.svg.attr('viewBox', `0 0 ${sizeX} ${sizeY}`);
        this.svgSize = {
            x: sizeX,
            y: sizeY
        };
        this.margin = {top: 10, right: 30, bottom: 30, left: 60};
    }

    draw() {
        const   width = this.svgSize.x - this.margin.left - this.margin.right,
                height = this.svgSize.y - this.margin.top - this.margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.name;})
        .entries(data);

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return d.year; }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // color palette
        var res = sumstat.map(function(d){ return d.key }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        // Draw the line
        svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d.key) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(+d.n); })
                (d.values)
            })
    }
}

$(() => {
    
});
CampusMap = function(_parentElement) {
    // SVG drawing area
    this.parentElement = _parentElement;
    this.margin = {top: 40, right: 10, bottom: 40, left: 60};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.initVis();
}

CampusMap.prototype.initVis = function() {
    var vis = this;

    // set base dimensions, etc.
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // declare projection and path
    vis.projection = d3.geo.albersUsa()
        .translate([vis.width / 2, vis.height / 2]);
    vis.path = d3.geo.path()
        .projection(vis.projection);

    // read in geoJSON of USA
    d3.json("data/cleaned/geomap.js", function(mapData) {
        vis.features = mapData.features;
        vis.svg.selectAll("path")
            .data(vis.features)
            .enter()
            .append("path")
            .attr("d", vis.path)
            .attr("class", "map-state");

        // read in CSV of sexual assault rates
        d3.csv("data/cleaned/sexual-assault-rate-on-campuses.csv", function(csvData) {
            vis.svg.selectAll("circle")
                .data(csvData)
                .enter()
                .append("circle")
                .attr("class", function(d) { return "map-college-dot " + d.School;})
                .attr("r", function(d) {
                    return d.Rate / 2;
                })
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("transform", function(d) {
                    return "translate(" + vis.projection([+d.Long, +d.Lat]) + ")";
                })
                .attr("title", function(d) {
                    return d.School;
                })
        })
    })
}

ComparativeRates = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.margin = {
    top: 40,
    right: 10,
    bottom: 60,
    left: 60
  };
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.formatDate = d3.time.format("%Y");

  this.initVis();
}

ComparativeRates.prototype.initVis = function() {
  var vis = this;

  // Scales
  vis.x = d3.scale.linear()
    .range([0, vis.width])
  vis.y = d3.scale.linear()
    .range([vis.height, 0]);


  /* SET UP D3 ELEMENTS */
  vis.svg = d3.select("#" + vis.parentElement)
    .append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
      ")");

  // axes
  vis.xAxis = d3.svg.axis()
    .scale(vis.x)
    .orient("bottom");
  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");
  vis.xGroup = vis.svg.append('g')
    .attr('class', 'axis x-axis')
    .attr("transform", "translate(" + 0 + "," + vis.height +
      ")");
  vis.yGroup = vis.svg.append('g')
    .attr('class', 'axis y-axis');

  // prepare the line
  vis.line = d3.svg.line()
    .x(function(d) {
        return vis.x(d.year_int);
    })
    .y(function(d) {
      return vis.y(d.relative.rape_sexual_assault);
    })
    .interpolate("monotone");

  vis.lineGroup = vis.svg.append('path')
    .attr('class', 'line');

  vis.wrangleData();
};

ComparativeRates.prototype.wrangleData = function() {
    var vis = this;

    // preprocess everything
    vis.data.forEach(function(d) {
        d.year_int = +d.year;
        d.year = vis.formatDate.parse(d.year);

        d.total_violent_crime = +d.total_violent_crime;
        d.rape_sexual_assault = +d.rape_sexual_assault;
        d.robbery = +d.robbery;
        d.aggravated_assault = +d.aggravated_assault;
        d.simple_assault = +d.simple_assault;
    });

    // compute rates relative to 1996
    var relativeYear = 1996;
    var relativeYearArray = vis.data.filter(function(d) {
        return d.year_int === relativeYear;
    });
    // should only be one year that matches
    var relativeYearData = relativeYearArray[0];

    // calculate relative rates
    vis.data.forEach(function(d) {
        d.relative = {};
        var metrics = [
            "total_violent_crime",
            "rape_sexual_assault",
            "robbery",
            "aggravated_assault",
            "simple_assault"
        ];
        metrics.forEach(function(metric) {
            d.relative[metric] = d[metric] / relativeYearData[metric];
        });
    });

    // only choose stuff after the chosen year
    vis.displayData = vis.data.filter(function(d) {
        return d.year_int >= relativeYear;
    });

    vis.updateVis();
};

ComparativeRates.prototype.updateVis = function() {
    var vis = this;

    // draw the line chart

    // update axes
    vis.x.domain(d3.extent(vis.displayData, function(d) {
        return d.year_int;
    }));
    vis.y.domain([0, 1.5]);

    // redraw axes
    vis.xGroup.call(vis.xAxis);
    vis.yGroup.call(vis.yAxis);

    // draw line
    vis.lineGroup.attr('d', vis.line(vis.displayData));
    console.log(vis.line(vis.displayData));

};

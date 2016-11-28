ComparativeRates = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.margin = {
    top: 40,
    right: 30,
    bottom: 60,
    left: 60
  };
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.formatDate = d3.time.format("%Y");

  this.metrics = [
    "total_violent_crime",
    "rape_sexual_assault",
    "robbery",
    "aggravated_assault",
    "simple_assault"
  ];

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
    .orient("bottom")
    .tickFormat(d3.format("0000"));
  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");
  vis.xGroup = vis.svg.append('g')
    .attr('class', 'axis x-axis')
    .attr("transform", "translate(" + 0 + "," + vis.height +
      ")");
  vis.yGroup = vis.svg.append('g')
    .attr('class', 'axis y-axis');


  // draw a text field for the series name
  vis.seriesLabel = vis.svg.append('text')
    .attr('x', vis.width)
    .attr('y', vis.height / 5)
    .attr('text-anchor', 'end');

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
    vis.metrics.forEach(function(metric) {
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

  // draw line for each metric
  vis.metrics.forEach(function(metric) {
    vis.drawLine(metric);
  });
};

// Draws a line for the relevant metric, e.g. `rape_sexual_assault`,
// using vis.displayData.
ComparativeRates.prototype.drawLine = function(metric) {
  var vis = this;

  // prepare the line function
  var line = d3.svg.line()
    .x(function(d) {
      return vis.x(d.year_int);
    })
    .y(function(d) {
      return vis.y(d.relative[metric]);
    })
    .interpolate("monotone");

  // prepare path to draw line in
  var lineGroup = vis.svg.append('path')
    .attr('class', 'line ' + metric)
    .on('mouseover', function() {
      vis.seriesLabel.text(metric);
    });

  // do the drawing
  lineGroup.attr('d', line(vis.displayData));
};

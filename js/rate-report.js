/**
 * Shows the change in sexual assault rates over time.
 * Has no data, needs to be updated to do anything
 */
RateReport = function(_parentElement) {
  this.parentElement = _parentElement;
  this.data = null;

  // Create drawing components
  // variables
  var vis = this;
  vis.margin = {
    top: 40,
    right: 80,
    bottom: 40,
    left: 80
  };

  vis.outerWidth = 500;
  vis.outerHeight = 500;
  vis.width = vis.outerWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.outerHeight - vis.margin.top - vis.margin.bottom;

  this.initVis();
}

RateReport.prototype.initVis = function() {
  var vis = this;

  // Draw SVG
  vis.svg = d3.select('#' + vis.parentElement)
    .append("svg")
    .attr("id", "rate-report-chart")
    .attr("width", vis.outerWidth)
    .attr("height", vis.outerHeight)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
      ")");

  // Scales and axes
  vis.x = d3.scale.linear()
    .range([0, vis.width]);
  vis.y = d3.scale.ordinal()
    .rangeRoundBands([0, vis.height], .2);

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");
  vis.yAxisGroup = vis.svg.append("g")
    .attr("class", "y-axis axis");

  vis.xAxis = d3.svg.axis()
    .scale(vis.x)
    .orient("bottom")
    .tickFormat(d3.format(".0%"));
  vis.xAxisGroup = vis.svg.append("g")
    .attr("class", "x-axis axis");

  // bar group
  vis.barGroup = vis.svg.append("g");

  // label group
  vis.labelGroup = vis.svg.append("g");
  vis.labelPadding = {
    top: 20,
    left: 5
};
};

/**
 * _data contains an array of:
 *  type {String}
 *  change {Float}
 */
RateReport.prototype.updateVis = function(_data) {
  var vis = this;
  vis.data = _data;

  // draw stuff

  // (1) Update domains
  vis.x.domain([-1, 1]);
  vis.y.domain(vis.data.map(function(d) {
    return d.type;
  }));

  // (2) Draw rectangles
  var bars = vis.barGroup.selectAll('rect')
    .data(vis.data, function(d) {
      return d.type;
    });

  // add new stuff
  bars.enter()
    .append('rect')
    .attr('class', 'rect-bar')
    .attr('fill', '#c8c8c8');

  // update existing stuff
  // because our bars may be negative, we'll have to be clever about drawing
  // bars - since they start at top left corner

  bars
    .transition()
    .duration(1000)
    .attr("x", function(d) {
      return vis.x(Math.min(0, d.change));
    })
    .attr("y", function(d) {
      return vis.y(d.type);
    })
    .attr("width", function(d) {
      return Math.abs(vis.x(d.change) - vis.x(0));
    })
    .attr("height", vis.y.rangeBand())
    .attr("fill", function(d) {
      return d.change > 0 ? "#ec4844" : "#62c462";
    });

  // remove old
  bars.exit()
    .transition()
    .duration(1000)
    .remove();

  // Update the axes
  vis.svg.select(".x-axis")
    .transition()
    .duration(1000)
    .call(vis.xAxis);
  vis.svg.select(".y-axis")
    .transition()
    .duration(1000)
    .call(vis.yAxis);
};

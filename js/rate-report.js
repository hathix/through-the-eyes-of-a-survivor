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
    top: 80,
    right: 40,
    bottom: 20,
    left: 60
  };

  vis.outerWidth = 500;
  vis.outerHeight = 500;
  vis.width = vis.outerWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.outerHeight - vis.margin.top - vis.margin.bottom;


  vis.labelPadding = {
    horizontal: 8
  };

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
    .domain([-1, 1])
    .range([0, vis.width]);
  vis.y = d3.scale.ordinal()
    .rangeRoundBands([0, vis.height], .2);

  vis.yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");
  vis.yAxisGroup = vis.svg.append("g")
    .attr("class", "y-axis axis crime-type")

  vis.xAxis = d3.svg.axis()
    .scale(vis.x)
    .orient("top")
    .tickFormat(d3.format(".0%"));
  vis.xAxisGroup = vis.svg.append("g")
    .attr("class", "x-axis axis");

  // bar group
  vis.barGroup = vis.svg.append("g");

  // label group
  vis.labelGroup = vis.svg.append("g");

  // x axis label
  vis.xAxisLabel = vis.svg.append("g")
    .append("text")
    .attr("class", "axis-title")
    .attr("x", vis.width / 2)
    .attr("y", -30);

  // draw line down the middle at 0
  var centerLineX = vis.x(0);
  var path = `M ${centerLineX} 0 v ${vis.height}`;
  vis.centerLine = vis.svg.append("path")
    .attr("d", path)
    .attr("class", "center-line");
};

/**
 * _data contains an array of:
 *  type {String}
 *  change {Float}
 */
RateReport.prototype.updateVis = function(_data, startYear, endYear) {
  var vis = this;
  vis.data = _data;

  // draw stuff

  // (1) Update domains
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
    // .transition()
    // .duration(1000)
    .call(vis.xAxis);
  vis.svg.select(".y-axis")
    // .transition()
    // .duration(1000)
    // rotate all axis labels
    .call(vis.yAxis)
        .selectAll("text")
        // .attr("class","label")
        .style("text-anchor", "middle")
        // .attr("dx", "-1em")
        .attr("dy", "-2em")
        .attr("transform", "rotate(-90)");



  // labels
  // (3) Draw labels
  var labels = vis.labelGroup.selectAll('text')
    .data(vis.data, function(d) {
      return d.type;
    });

  // add new
  labels.enter()
    .append('text')
    .attr('class', 'bar-label');

  // update
  labels.transition()
    .duration(1000)
    .attr("x", function(d) {
      if (d.change < 0) {
        // text on left of bar (which goes left)
        return vis.x(d.change) - vis.labelPadding.horizontal;
      } else {
        // text on right side of bar (which goes right)
        return vis.x(d.change) + vis.labelPadding.horizontal;
      }
    })
    .attr("y", function(d) {
      return vis.y(d.type) + vis.y.rangeBand() / 2;
    })
    .attr("text-anchor", function(d) {
      // anchor to the end (right-align) if bar goes to left
      // left-align if bar goes right
      return d.change < 0 ? "end" : "start";
    })
    .text(function(d) {
      return d3.format(".0%")(d.change);
    });

  // exit
  labels.exit()
    .remove();

  // update x axis label
  vis.xAxisLabel.text(
    `Change in crime rate between ${startYear} and ${endYear}`);
};

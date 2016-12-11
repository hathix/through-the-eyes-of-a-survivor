ComparativeRates = function(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.margin = {
    top: 40,
    right: 30,
    bottom: 60,
    left: 60
  };
  this.width = 500 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.formatDate = d3.time.format("%Y");

  this.metrics = [
    // "total_violent_crime",
    "rape_sexual_assault",
    "robbery",
    "aggravated_assault",
    // "simple_assault"
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


  // for lines
  vis.lineGroup = vis.svg.append("g");

  vis.wrangleData();
};

ComparativeRates.prototype.wrangleData = function() {
  var vis = this;

  console.log(window.xx = vis.data);

  // we currently have an array of metrics
  // each one has `type` and several years
  // convert it to several arrays, each of which looks like
  // [{year: #, value: #}, ...]
  // only consider certain metrics though
  vis.filteredData = vis.data.filter(function(row) {
    return vis.metrics.indexOf(row.type) > -1;
  });
  vis.displayData = vis.filteredData.map(function(metricRow) {
    var result = [];
    // TODO don't hardcode
    var startYear = 1993;
    var endYear = 2012;
    for (var i = 0; i <= endYear - startYear; i++) {
      var year = startYear + i;
      result[i] = {
        year: year,
        value: +metricRow[year + ""]
      };
    }
    return result;
  });


  vis.updateVis();
};

ComparativeRates.prototype.updateVis = function() {
  var vis = this;

  // draw the line chart

  // update axes
  vis.x.domain([1993, 2012]);
  vis.y.domain([0, 20]);

  // redraw axes
  vis.xGroup.call(vis.xAxis);
  vis.yGroup.call(vis.yAxis);

  // draw line for each metric
  // vis.metrics.forEach(function(metric) {
  //   vis.drawLine(metric);
  // });
  vis.line = d3.svg.line()
    .x(function(d) {
      return vis.x(d.year);
    })
    .y(function(d) {
      return vis.y(d.value);
    });


  vis.lineGroup.selectAll(".line")
    .data(vis.displayData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", vis.line);
};

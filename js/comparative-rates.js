ComparativeRates = function(_parentElement, _data, _eventHandler) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.eventHandler = _eventHandler;

  this.margin = {
    top: 50,
    right: 30,
    bottom: 60,
    left: 90
  };
  this.width = 500 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.formatDate = d3.time.format("%Y");

  this.metrics = [
    "Aggravated Assault",
    "Robbery",
    "Sexual Assault"
  ];

  this.startYear = 1993;
  this.endYear = 2012;

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
  // vis.seriesLabel = vis.svg.append('text')
  //   .attr('x', vis.width)
  //   .attr('y', vis.height / 5)
  //   .attr('text-anchor', 'end');


  // add chart title
  vis.svg.append("text")
    .attr("transform", "translate(" + (vis.width / 2) + ",-20)")
    .attr("class", "chart-title")
    .text("Crime rates have been dropping sharply");

  // add x-axis label
  vis.svg.append("text")
    .attr("transform", "translate(" + (vis.width / 2) + "," + (vis.height +
      40) + ")")
    .attr("class", "axis-title")
    .text("Year");

  // add y-axis label
  vis.svg.append("text")
    .attr("transform", "translate(-40," + (vis.height / 2) + ")rotate(-90)")
    .attr("class", "axis-title")
    .text("Crime rate (crimes per 1,000 people)");


  // for lines
  vis.lineGroup = vis.svg.append("g");


  // brushing
  vis.brush = d3.svg.brush()
    .x(vis.x)
    .on("brush", function() {

      if (vis.brush.empty()) {
        // No region selected (brush inactive)
        $(vis.eventHandler)
          .trigger("selectionChanged", [
            vis.x.domain()[0],
            vis.x.domain()[1],
            vis.filteredData
          ]);
      } else {
        // User selected specific region

        // snap to nearest year
        var extent = vis.brush.extent();
        var rounded = extent.map(Math.round);
        vis.brush.extent(rounded);
        vis.redrawBrush();

        // trigger change
        $(vis.eventHandler)
          .trigger("selectionChanged", [
            rounded[0],
            rounded[1],
            vis.filteredData
          ]);
      }
    });

  // Append brush component here
  vis.brushGroup = vis.svg.append("g")
    .attr("class", "brush");

  // legend
  vis.legend = vis.svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (vis.width * 0.55) + ",40)")
    .style("font-size", "14px");

  vis.wrangleData();
};

ComparativeRates.prototype.wrangleData = function() {
  var vis = this;

  // console.log(vis.data);

  // we currently have an array of metrics
  // only consider certain metrics though
  vis.filteredData = vis.data.filter(function(row) {
    return vis.metrics.indexOf(row.Type) > -1;
  });

  // clean out values for each year
  vis.filteredData.forEach(function(metricRow) {
    // TODO don't hardcode
    var startYear = vis.startYear;
    var endYear = vis.endYear;
    for (var i = 0; i <= endYear - startYear; i++) {
      var year = startYear + i;
      metricRow[year] = +metricRow[year];
    }
  });

  // each one has `type` and several years
  // convert it to several arrays, each of which looks like
  // [{year: #, value: #}, ...]
  // and wrap it in an object
  vis.displayData = vis.filteredData.map(function(metricRow) {
    var array = [];
    // TODO don't hardcode
    var startYear = vis.startYear;
    var endYear = vis.endYear;
    for (var i = 0; i <= endYear - startYear; i++) {
      var year = startYear + i;
      array[i] = {
        year: year,
        value: metricRow[year]
      };
    }

    return {
      type: metricRow["Type"],
      slug: metricRow["Slug"],
      yearData: array
    };
  });


  vis.updateVis();
};

ComparativeRates.prototype.updateVis = function() {
  var vis = this;


  // Call brush component here
  vis.svg.select(".brush")
    .call(vis.brush)
    .selectAll('rect')
    .attr("height", vis.height)
    .attr("clip-path", "url(#clip)");

  // draw the line chart

  // update axes
  vis.x.domain([vis.startYear, vis.endYear]);
  vis.y.domain([0, 20]);

  // redraw axes
  vis.xGroup.call(vis.xAxis);
  vis.yGroup.call(vis.yAxis);

  // draw line for each metric
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
    .attr("class", function(d) {
      return "line " + d.slug;
    })
    .attr("stroke", function(d) {
      switch (d.type) {
        case "Sexual Assault":
          return "crimson";
        case "Robbery":
          return "#B39EB5";
        case "Aggravated Assault":
          return "#AEC6CF";
      }
    })
    .attr("data-legend", function(d) {
      return d.type;
    })
    .attr("data-legend-icon", "line")
    .attr("d", function(d) {
      // select only the raw data array for this
      return vis.line(d.yearData);
    });


  // fire a starter event to start off companion visualizations
  $(vis.eventHandler)
    .trigger("selectionChanged", [
      vis.startYear,
      vis.endYear,
      vis.filteredData
    ]);


  vis.legend.call(d3.legend);
};

ComparativeRates.prototype.redrawBrush = function() {
  var vis = this;

  // redraw
  vis.svg.select(".brush")
    .call(vis.brush);
};

/**
 * Visualizes the vis evolving over time.
 */
ComparativeRates.prototype.play = function() {
  var vis = this;

  // if a "play" is already happening, stop it
  clearInterval(vis.interval);

  // start at `startYear`, keep going until you hit `endYear`
  var stopYear = vis.startYear + 1;

  vis.interval = setInterval(function(){
      if (stopYear >= vis.endYear) {
          // stop timer if we've hit the end
          clearInterval(vis.interval);
      }

      // draw brush
      vis.brush.extent([vis.startYear, stopYear]);
      // programmatically update it
      vis.svg.select(".brush").call(vis.brush.event);

      // increase counter
      stopYear++;
  }, 500);


};

CrimeRate = function() {
  var margin = {
    top: 40,
    right: 10,
    bottom: 60,
    left: 80
  };
  this.margin = margin;

  this.width = 960 - margin.left - margin.right;
  this.height = 400 - margin.top - margin.bottom;

  // listen to changes
  var vis = this;
  $('#ranking-type')
    .on("change", function() {
      vis.updateVis();
    });

  this.initVis();
};

CrimeRate.prototype.initVis = function() {
  var vis = this;
  vis.svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +
      ")");

  // Scales
  vis.x = d3.scale.ordinal()
    .rangeRoundBands([0, vis.width], .1);
  vis.y = d3.scale.linear()
    .range([vis.height, 0]);

  // axes
  vis.xaxis = d3.svg.axis()
    .scale(vis.x)
    .orient("bottom");
  vis.yaxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");

  // draw x axis
  vis.svg.append("g")
    .attr("class", "xaxis")
    .call(vis.xaxis)
    .attr("transform", "translate(0," + (vis.height) + ")")
    .selectAll("text")
    .style("text-anchor", "center")
    .attr("transform", "translate(0,20)");

  // draw y axis
  vis.svg.append("g")
    .attr("class", "yaxis")
    .call(vis.yaxis)
    .append("text")
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  vis.wrangleData();
};

CrimeRate.prototype.wrangleData = function() {
  var vis = this;

  d3.csv("data/cleaned/violent-crime-over-time-new_CSV.csv", function(error,
    csv) {
    csv.forEach(function(d) {
      d.revenue = +d.revenue;
      d.stores = +d.stores;
      d.Year = +d.Year;
      //console.log(d.Year);
      d.Violent_crime = +d.Violent_crime;
      //console.log(d.Violent_crime);
      d.Rape_sexual_assault = +d.Rape_sexual_assault
        //console.log(d.Rape_sexual_assault)
      d.Robbery = +d.Robbery;
    });
    // Store csv data in global variable
    vis.data = csv;
    // Draw the visualization for the first time
    vis.updateVis();
  });
};

CrimeRate.prototype.updateVis = function() {
  var vis = this;

  // get data
  var choice = d3.select("#ranking-type")
    .property("value");
  var base = vis.svg.data(vis.data);

  // update domains
  vis.x.domain(vis.data.map(function(d) {
    return d.Year;
  }));

  vis.y.domain([
    0,
    d3.max(vis.data.map(function(d) {
      return d[choice];
    }))
  ]);

  // axes
  vis.svg.select(".xaxis")
    .call(vis.xaxis);
  vis.svg.select(".yaxis")
    .call(vis.yaxis);



  // draw bars
  var displayData = vis.data;
  displayData.sort(function(a, b) {
    return b[choice] - a[choice];
  });

  // enter
  var bars = vis.svg.selectAll("rect")
    .data(vis.data);

  // enter
  bars
    .enter()
    .append("rect")
    .attr("class", "bar");

  // update
  bars
    .attr("x", function(d) {
      return vis.x(d.Year);
    })
    .attr("y", function(d) {
      return vis.y(d[choice]);
    })
    .attr("width", vis.x.rangeBand())
    .attr("height", function(d) {
      return vis.height - vis.y(d[choice]);
    });

  // exit
  bars.exit()
    .remove();

};

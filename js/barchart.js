BarChart = function(_parentElement) {
  // SVG drawing area
  this.parentElement = _parentElement;
  this.margin = {
    top: 40,
    right: 10,
    bottom: 150,
    left: 60
  };
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.policeData;

  this.initVis();
}

BarChart.prototype.initVis = function() {
  var vis = this;

  vis.width = $("#" + vis.parentElement)
    .width() - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

  vis.svg = d3.select("#" + vis.parentElement)
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
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + (vis.height) + ")")
    .call(vis.xaxis);

  // draw y axis
  vis.svg.append("g")
    .attr("class", "axis y-axis")
    .call(vis.yaxis)
    .append("text")
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  // add axis label
  vis.svg.append("text")
    .style("text-anchor", "middle")
    .attr("transform", "translate(-50," + (vis.height / 2) + ")rotate(-90)")
    .attr("class", "axis-title")
    .text("Average report rate from 2002 to 2013");

  this.loadData();
};

BarChart.prototype.loadData = function() {
  var vis = this;

  var counter = 0;
  var averages = [];
  var newData = [];
  d3.csv("data/cleaned/report-to-police-percents-transposed.csv", function(error, csv) {

    // Converting the data's fields to ints and dates
    csv.forEach(function(d) {
      // find average over all relevant years
      var years = [
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013"
      ];

      var sum = years.reduce(function(accumulator, year) {
        return accumulator + (+d[year]);
      }, 0);
      var average = sum / years.length;
      averages.push(average);

      newData.push([d["Type"], average]);
    })
    vis.data = newData;
    vis.updateVisualization();
  })

}

BarChart.prototype.updateVisualization = function() {
  var vis = this;

  vis.data.sort(function(a, b) {
    return a[1] - b[1];
  });

  // get data
  var base = vis.svg.data(vis.data);

  // update domains
  vis.x.domain(vis.data.map(function(d, i) {
    return d[0];
  }));

  vis.y.domain([
    0,
    // d3.max(vis.data.map(function(d) {
    //     return d[1];
    // }))
    100
  ]);

  // axes
  vis.svg.select(".axis.x-axis")
    .call(vis.xaxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "translate(" + 0 + "," + (vis.margin.top / 3 - 20) +
      ") rotate(-30)");
  vis.svg.select(".axis.y-axis")
    .call(vis.yaxis);

  // draw bars
  // var displayData = vis.data;
  // displayData.sort(function(a, b) {
  //   return b[choice] - a[choice];
  // });

  // enter
  var bars = vis.svg.selectAll("rect")
    .data(vis.data);
  // enter
  bars
    .enter()
    .append("rect")
    .attr("class", function(d) {
      console.log(d);
      // css class-friendly name of category
      // "Sexual assault" => "sexual-assault"
      var slug = d[0].replace(/ /, "-")
        .toLowerCase();
      return "bar rate-bar " + slug;
    });

  // update
  bars
    .attr("x", function(d) {
      return vis.x(d[0]);
    })
    .attr("y", function(d) {
      return vis.y(d[1]);
    })
    .attr("width", vis.x.rangeBand())
    .attr("height", function(d) {
      return vis.height - vis.y(d[1]);
    })
    .on("click", function(d) {
      $(MyEventHandler)
        .trigger("selectionChanged", d[0]);
    })
    .on({
      "mouseover": function(d) {
        d3.select(this)
          .style("cursor", "pointer")
      },
      "mouseout": function(d) {
        d3.select(this)
          .style("cursor", "default")
      }
    });

  // exit
  bars.exit()
    .remove();

}

LineChart = function(_parentElement) {
  // SVG drawing area
  this.parentElement = _parentElement;
  this.margin = {
    top: 40,
    right: 40,
    bottom: 60,
    left: 70
  };
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.policeData;

  this.initVis();
}

LineChart.prototype.initVis = function() {
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
  vis.x;
  vis.y;

  // temp var
  vis.boo;

  vis.xAxis = d3.svg.axis();
  vis.yAxis = d3.svg.axis();

  this.loadData();
};

LineChart.prototype.loadData = function() {
  var vis = this;

  d3.csv("data/cleaned/report-to-police-percents.csv", function(error, csv) {

    // Store csv data in global variable
    vis.policeData = csv;

    // Converting the data's fields to ints and dates
    for (var i = 0; i < vis.policeData.length; i++) {
      for (var property in vis.policeData[i]) {
        if (vis.policeData[i].hasOwnProperty(property)) {

          if (property == "Date")
            vis.policeData[i][property] = new Date(vis.policeData[i][
              property
            ]);
          else
            vis.policeData[i][property] = parseFloat(vis.policeData[i][
              property
            ]);
        }
      }
    }

    // Making the scales
    vis.x = d3.time.scale()
      .domain([new Date('2004'), new Date('2013')])
      .range([0, vis.width]);
    vis.y = d3.scale.linear()
      .domain([0, 100])
      .range([vis.height, 0]);

    // assign temp var to formatted var for first init
    vis.boo = vis.policeData;

    // axes
    vis.axes = vis.svg.selectAll("g")
      .data(vis.boo);
    vis.axes.enter()
      .append("g");

    // x and y axis
    vis.xAxis.scale(vis.x)
      .orient("bottom");
    vis.yAxis.scale(vis.y)
      .orient("left")
      .tickFormat(function(d) {
        // add percentages
        return d + "%";
      });

    // appending the axes
    vis.svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(vis.xAxis);
    vis.svg.append("g")
      .attr("class", "axis y-axis")
      .call(vis.yAxis);

    // add axis label
    vis.svg.append("text")
      .style("text-anchor", "middle")
      .attr("transform", "translate(-50," + (vis.height / 2) +
        ")rotate(-90)")
      .attr("class", "axis-title")
      .text("% of crimes reported to police");

    vis.updateVisualization();

  })

}

LineChart.prototype.updateVisualization = function() {
  var vis = this;
  d3.selectAll("path#barline")
    .remove();

  for (var property in vis.boo[0]) {
    if (property == "Date") {
      continue;
    }

    var line = d3.svg.line()
      .x(function(d) {
        return vis.x(d.Date);
      })
      .y(function(d) {
        return vis.y(d[property]);
      });


    vis.svg.append("path") // Add the valueline path.
      .attr("id", "barline")
      .attr("class", "line gray " + property)
      .attr("d", line(vis.boo));
  }
}

LineChart.prototype.onSelectionChange = function(category) {
  var vis = this;
  this.categoryData = [];

  vis.formatCategory = category.split(" ")
    .join("_");;

  for (i = 0; i < vis.policeData.length; i++) {
    vis.categoryData.push({
      "Date": vis.policeData[i]["Date"],
      "Category": vis.policeData[i][vis.formatCategory]
    });
  }

  vis.boo = vis.categoryData;

  vis.updateVisualization();
}

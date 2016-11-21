CrimeRate = function(_parentElement) {
  // SVG drawing area
  this.parentElement = _parentElement;
  this.margin = {top: 40, right: 10, bottom: 60, left: 60};
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.policeData;

  this.initVis();
}

CrimeRate.prototype.initVis = function() {
  var vis = this;

  vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
      vis.height = 500 - vis.margin.top - vis.margin.bottom;

  vis.svg = d3.select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // Scales
  vis.x;
  vis.y;

  vis.xAxis = d3.svg.axis();
  vis.yAxis = d3.svg.axis();

  this.loadData();
};

CrimeRate.prototype.loadData = function() {
  var vis = this;

  d3.csv("data/cleaned/violent-crime-test.csv", function(error, csv) {

    // Store csv data in global variable
    vis.policeData = csv;

    // Converting the data's fields to ints and dates
    for (var i = 0; i < vis.policeData.length; i++) {
      for (var property in vis.policeData[i]) {
        if (vis.policeData[i].hasOwnProperty(property)) {

          if (property == "Year")
            vis.policeData[i][property] = new Date(vis.policeData[i][property]);
          else
            vis.policeData[i][property] = parseFloat(vis.policeData[i][property]);
        }
      }
    }

    // Making the scales
    //console.log(new Date('2002'));
    vis.x = d3.time.scale()
        .domain([new Date('2001'), new Date('2013')])
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .domain([0, 7679050])
        .range([vis.height, 0]);

    vis.updateVisualization();

  })

}

CrimeRate.prototype.updateVisualization = function(){
  var vis = this;

  vis.axes = vis.svg.selectAll("g")
      .data(vis.policeData);

  vis.axes.enter()
      .append("g");

  vis.xAxis.scale(vis.x)
      .orient("bottom");
  vis.yAxis.scale(vis.y)
      .orient("left");

  // Updating the axes
  vis.svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(vis.xAxis);

  vis.svg.append("g")
      .attr("class", "axis y-axis")
      .call(vis.yAxis);

  //console.log(vis.policeData[6]);
  for (var property in vis.policeData[0]) {
    //console.log(property);
    //console.log(vis.policeData[0][property]);
    if (property == "Year") {
      continue;
    }

    var line = d3.svg.line()
        .x(function(d) {
          //console.log(d.Year);
          //console.log(vis.x(d.Year));
          return vis.x(d.Year);
        })
        .y(function(d) {
          //console.log(d[property]);
          //console.log(vis.y(d[property]));
          return vis.y(d[property]);
        });

    function ShortString(string) {
      if (string.length > 4) {
        return (string.substring(5, string.length) + " Rates");
      }
      else {
        return string;
      }
    }

    //console.log(ShortString("line sexual_assault"));

    vis.svg.append("path") // Add the valueline path.
        .attr("class", "line " + property)
        .attr("d", line(vis.policeData))
        .on("mouseover", function(d) {
          // d3.select(this)
          //   .style("stroke", "red");
          var text = d3.select(this)
              .attr("class");
          $("#text")
              .html(ShortString(text));
        })
        .on("mouseout", function(d) {
          // d3.select(this)
          //   .style("stroke", "steelblue");
        });
  }

}
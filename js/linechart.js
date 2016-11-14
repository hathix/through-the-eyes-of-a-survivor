var svg = d3.select("#police-reports")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Global variable for our data
var policeData;
var maxValue;

// Scales
var x;
var y;

// Initializing the axes
var xAxis = d3.svg.axis();
var yAxis = d3.svg.axis();

loadData();

// Load CSV file
function loadData() {
  d3.csv("data/cleaned/new-report-to-police-percents.csv", function(error, csv) {

    // Store csv data in global variable
    policeData = csv;

    // Converting the data's fields to ints and dates
    for (var i = 0; i < policeData.length; i++) {
      for (var property in policeData[i]) {
        if (policeData[i].hasOwnProperty(property)) {

          if (property == "Date")
            policeData[i][property] = new Date(policeData[i][property]);
          else
            policeData[i][property] = parseFloat(policeData[i][property]);
        }
      }
    }

    console.log(policeData);

    // Making the scales
    x = d3.time.scale()
      .domain([new Date('2002'), new Date('2014')])
      .range([0, width]);

    y = d3.scale.linear()
      .domain([0, 85.6])
      .range([height, 0]);

    // Draw the visualization for the first time
    updateVisualization();
  });
}

// Render visualization
function updateVisualization() {
  var axes = svg.selectAll("g")
    .data(policeData);
  axes.enter()
    .append("g");

  xAxis.scale(x)
    .orient("bottom");
  yAxis.scale(y)
    .orient("left");

  // Updating the axes
  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  for (var property in policeData[0]) {
    if (property == "Date") {
      continue;
    }

    line = d3.svg.line()
      .x(function(d) {
        return x(d.Date);
      })
      .y(function(d) {
        return y(d[property]);
      });

    svg.append("path") // Add the valueline path.
      .attr("class", property)
      .attr("d", line(policeData))
      .on("mouseover", function(d) {
        d3.select(this)
          .style("stroke", "red");
        var text = d3.select(this)
          .attr("class");
        console.log(text);
        $("#text")
          .html(text);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("stroke", "steelblue");
      });
  }
}
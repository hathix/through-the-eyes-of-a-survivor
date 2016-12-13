CampusMap = function(_parentElement) {
  // SVG drawing area
  this.parentElement = _parentElement;
  this.margin = {
    top: 40,
    right: 10,
    bottom: 40,
    left: 60
  };
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  // hide at start
  $('#campus-info-holder')
    .hide();

  this.initVis();
}

CampusMap.prototype.initVis = function() {
  var vis = this;

  // set base dimensions, etc.
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

  // declare projection and path
  vis.projection = d3.geo.albersUsa()
    .translate([vis.width / 2, vis.height / 2]);
  vis.path = d3.geo.path()
    .projection(vis.projection);

  // declare base for tooltip
  vis.div = d3.select(".campus-map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // read in geoJSON of USA
  d3.json("data/cleaned/geomap.js", function(mapData) {
    vis.features = mapData.features;
    vis.svg.selectAll("path")
      .data(vis.features)
      .enter()
      .append("path")
      .attr("d", vis.path)
      .attr("class", "map-state");

    // read in CSV of sexual assault rates
    d3.csv("data/cleaned/sexual-assault-rate-on-campuses.csv", function(
      csvData) {


      // make a color scale
      vis.colorScale = d3.scale.quantize();
      // colors designed w/ ColorBrewer
      vis.colorScale
        .domain(d3.extent(csvData.map(function(d) {
          return d.Rate;
        })))
        .range(['#fee5d9','#fcae91','#fb6a4a','#cb181d']);

      vis.svg.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("class", function(d) {
          return "map-college-dot " + d.School;
        })
        .attr("r", function(d) {
          return d.Rate / 2;
        })
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("transform", function(d) {
          return "translate(" + vis.projection([+d.Long, +d.Lat]) +
            ")";
        })
        .attr("title", function(d) {
          return d.School;
        })
        .attr("fill", function(d) {
          return vis.colorScale(d.Rate);
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
        })
        .on("mouseover", function(d) {
          // show info
          $('#campus-info-holder')
            .show();
          displayInfo(d);
          return;
        })
        .append("svg:title")
        .html(function(d) {
          return (d.School + ": " + d.Rate + "%");
        });

      function displayInfo(d) {
        //var name = (d.School).replace(/ /i, '%20');
        // var name = d.School;
        var image = "images/universities/" + d.School + d.Image;


        $('#college-image')
          .prop('src', image);
        $('#college-name')
          .html(d.School);
        $('#college-location')
          .html(d.Location);


        $("#progress-move")
          .css({
            "width": (+d.Rate) + "%",
            "background-image": "none"
          });
        if (+d.Rate > 24) {
          $("#progress-move")
            .css("background-color", "red");
        } else if (+d.Rate < 22) {
          $("#progress-move")
            .css("background-color", "green");
        } else {
          $("#progress-move")
            .css("background-color", "orange");
        }

        $("#progress-move")
          .text(d.Rate + "%");
      }
    })
  })
}

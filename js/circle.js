var width = 960,
    height = 500;

var centerX = width / 2,
    centerY = height / 2;

var radius = 5;

// data formatted to where 0th index of array is collective data from 1992, 1st index data from 1993, etc.
// victimData[0] = [ {name: _, date: _, age: _}, ...]
var victimData =
    [   [   { name: "name one",
              date: "01-01-2002",
              age: 22},
            { name: "name two",
              date: "02-03-2014",
              age: 19}],

        [   { name: "name three",
              date: "03-03-2003",
              age: 20}]
    ];

var svg = d3.select("#dotVis").append("svg")
    .attr("width", width)
    .attr("height", height);
textInfo = document.createElement("div");



function change() {
    var choice = d3.select("#years").property("value");
    var yearToIndex = +choice - 1992;
    var base = svg.selectAll("circle")
        .data(victimData[yearToIndex]);

    base.enter()
        .append("circle")
        .attr("r", radius)
        .attr("cx", function(data, index) {
            return centerX + 15 * index;
        })
        .attr("cy", centerY)
        .on("click", function(data) {
            textInfo.innerHTML = data.name + ", " + data.age + ", " + data.date;
            document.getElementById("textArea").append(textInfo);
            return;
        });

    base.exit().remove();
}

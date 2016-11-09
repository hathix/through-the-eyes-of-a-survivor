
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
var y = d3.scale.linear()
    .range([height, 0]);

// Initialize data
loadData();

// Coffee chain data
var data;

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {
		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});
		// Store csv data in global variable
		data = csv;
    // Draw the visualization for the first time
		updateVisualization();
	});
}

// Render visualization
function updateVisualization() {
	var choice = d3.select("#ranking-type").property("value");
	var base = svg.data(data);
	x.domain(data.map(function(d) {return d.company;}));

	if (choice == "stores") {
		data.sort(function(a, b) { return b.stores - a.stores; });
		y.domain([0,Math.max.apply(Math,data.map(function(d) {return d.stores;}))]);
		var xaxis = d3.svg.axis().scale(x);
		var yaxis = d3.svg.axis().scale(y);
		xaxis.orient("bottom");
		yaxis.orient("left");
		d3.select("svg").selectAll("rect").data(data).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.company)+margin.left; })
			.attr("y", function(d) { return y(d.stores)+margin.top; })
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return height - y(d.stores); });
		console.log("hi");
	} else if (choice == "revenue") {
		data.sort(function(a, b) { return b.revenue - a.revenue; });
		y.domain([0,Math.max.apply(Math,data.map(function(d) {return d.revenue;}))]);
		var xaxis = d3.svg.axis().scale(x);
		var yaxis = d3.svg.axis().scale(y);
		xaxis.orient("bottom");
		yaxis.orient("left");
		d3.select("svg").selectAll("rect").data(data).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.company)+margin.left; })
			.attr("y", function(d) { return y(d.revenue)+margin.top; })
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return height - y(d.revenue); });
		console.log("hello");
	}

	svg.append("g")
		.attr("class","yaxis")
		.call(yaxis)
		.append("text")
		.attr("dy", ".71em")
		.style("text-anchor", "end");
	svg.append("g")
		.attr("class","xaxis")
		.call(xaxis)
		.attr("transform", "translate(0,"+(height)+")")
		.selectAll("text")
		.style("text-anchor", "center")
		.attr("transform", "translate(0,20)");
	d3.select("svg").selectAll("rect").data(data).exit().remove();
}
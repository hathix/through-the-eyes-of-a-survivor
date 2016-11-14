
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

console.log($(window).width())

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
	d3.csv("data/cleaned/violent-crime-over-time-new_CSV.csv", function(error, csv) {
		csv.forEach(function(d){
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
		data = csv;
    // Draw the visualization for the first time
		updateVisualization();
	});
}

// Render visualization
function updateVisualization() {
	var choice = d3.select("#ranking-type").property("value");
	var base = svg.data(data);
	x.domain(data.map(function(d) {return d.Year;}));

	if (choice == "violent_crime") {
		data.sort(function(a, b) { return b.Violent_crime- a.Violent_crime; });
		y.domain([0,Math.max.apply(Math,data.map(function(d) {return d.Violent_crime;}))]);
		var xaxis = d3.svg.axis().scale(x);
		var yaxis = d3.svg.axis().scale(y);
		xaxis.orient("bottom");
		yaxis.orient("left");
		d3.select("svg").selectAll("rect").data(data).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.Year)+margin.left; })
			.attr("y", function(d) { return y(d.Violent_crime)+margin.top; })
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return height - y(d.Violent_crime); });
		console.log("hi");
	} else if (choice == "sexual assault") {
		data.sort(function(a, b) { return b.Rape_sexual_assault - a.Rape_sexual_assault; });
		y.domain([0,Math.max.apply(Math,data.map(function(d) {return d.Rape_sexual_assault;}))]);
		var xaxis = d3.svg.axis().scale(x);
		var yaxis = d3.svg.axis().scale(y);
		xaxis.orient("bottom");
		yaxis.orient("left");
		d3.select("svg").selectAll("rect").data(data).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.Year)+margin.left; })
			.attr("y", function(d) { return y(d.Rape_sexual_assault)+margin.top; })
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return height - y(d.Rape_sexual_assault); });
		console.log("hello");
	} else if (choice == "robbery") {
		data.sort(function(a, b) { return b.Robbery - a.Robbery; });
		y.domain([0,Math.max.apply(Math,data.map(function(d) {return d.Robbery;}))]);
		var xaxis = d3.svg.axis().scale(x);
		var yaxis = d3.svg.axis().scale(y);
		xaxis.orient("bottom");
		yaxis.orient("left");
		d3.select("svg").selectAll("rect").data(data).enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.Year)+margin.left; })
			.attr("y", function(d) { return y(d.Robbery)+margin.top; })
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return height - y(d.Robbery); });
		console.log("hey");
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
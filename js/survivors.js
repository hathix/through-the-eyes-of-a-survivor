Survivors = function(_parentElement, _affected, _sampleSize) {
  // SVG drawing area
  this.parentElement = _parentElement;
  this.margin = {top: 40, right: 10, bottom: 60, left: 60};
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.affected = _affected;
  this.sampleSize = _sampleSize;
 
  this.initVis();
}

Survivors.prototype.initVis = function() {
	var vis = this;

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
	vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement)
    .append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.loadData();
}

Survivors.prototype.loadData = function() {
	var vis = this;

	// This will be an array of booleans
	vis.people = [];

	var row = [];
	// Loading people array
	for (var i = 0; i < vis.sampleSize; i++){
		if (i >= vis.affected)
			row.push(false);
		else
			row.push(true);

		if (row.length == 10){
			vis.people.push(row);
			row = [];
		}
	}
	
	vis.updateVisualization();
}

Survivors.prototype.updateVisualization = function(){
	var vis = this;

	for(var row = 0; row < vis.people.length; row++){
		var circles = vis.svg.selectAll("circle" + row)
			.data(vis.people[row])
			
		circles.enter().append("circle")
			.attr("class", "circ");

		circles
			.attr("r", 10)
			.attr("cx", function(d, index){
				return (index * 30);
			})
			.attr("cy", function(d, index){
				return (row * 30);
			})
			.attr("fill", "white")
			.attr("stroke", "black");

		circles.exit().remove();
	}
}

Survivors.prototype.activateColors = function(){
	var vis = this;

	// Makes the vis.people array into just an array of bools instead of an array of arrays
	var newArr = [];
	for(var i = 0; i < vis.people.length;i++){
		newArr = newArr.concat(vis.people[i]);
	}

	// Randomizing the array
	vis.people = shuffle(newArr);

	// Making vis.people into an array of arrays again
	var finalarr = [];
	var temparr = [];
	for (var i = 0; i < vis.people.length; i++){
		temparr.push(vis.people[i]);

		if (temparr.length == 10){
			finalarr.push(temparr);
			temparr = [];
		}
	}

	// Updating vis.people
	vis.people = finalarr.slice();

	for(var row = 0; row < vis.people.length; row++){
		var newCircles = vis.svg.selectAll("circ")
			.data(vis.people[row]);

		newCircles.enter().append("circle")
			.attr("class", "circ");

		newCircles
			.transition()
			.duration(2000)
			.attr("r", 10)
			.attr("cx", function(d, index){
				return (index * 30);
			})
			.attr("cy", function(d, index){
				return (row * 30);
			})
			.attr("stroke", "black")
			.attr("fill", function(d, index){
				if (d)
					return "red";
				else
					return "white";
			})
	}
	
}

function shuffle(array) {
	
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



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

	var curr;

	// Loading people array
	for (var i = 0; i < vis.sampleSize; i++){
		if (i >= vis.affected)
			vis.people.push(false);
		else
			vis.people.push(true);
	}

	vis.updateVisualization();
}

Survivors.prototype.updateVisualization = function(){
	var vis = this;

	vis.circles = vis.svg.selectAll("circle")
		.data(vis.people)
		.enter()
		.append("circle")
		.attr("r", 10)
		.attr("cx", function(d, i){
			return (i * 10);
		})
		.attr("cy", function(d, i){
			return (i * 10);
		});
}

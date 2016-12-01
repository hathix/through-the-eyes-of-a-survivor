Survivors = function(_parentElement, _affected, _sampleSize) {
  // SVG drawing area
  this.parentElement = _parentElement;
  this.margin = {
    top: 40,
    right: 10,
    bottom: 60,
    left: 60
  };
  this.affected = _affected;
  this.sampleSize = _sampleSize;
  this.nodeSize = 30;
  this.nodePadding = 10;
  this.women_height = 32;
  this.women_width = 27;
  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.initVis();
}

Survivors.prototype.initVis = function() {
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

  vis.loadData();
}

Survivors.prototype.loadData = function() {
  var vis = this;

  // This will be an array of booleans
  vis.people = [];

  d3.csv("/data/cleaned/quick-stories.csv", function(data) {

    vis.quotes = data;
    console.log(vis.quotes);
    // Loading people array
    for (var i = 0; i < vis.sampleSize; i++) {
      var person = {
        active: i < vis.affected,
      };
      if (person.active) {
        person.quote = vis.quotes[i % vis.quotes.length];
      }
      vis.people.push(person);
    }

    // Shuffle the array so we get some variety
    shuffle(vis.people);

    // make grid layout
    vis.grid = d3.layout.grid()
      .bands()
      .nodeSize([vis.nodeSize, vis.nodeSize])
      .padding([vis.nodePadding, vis.nodePadding]);
  });
}

Survivors.prototype.updateVisualization = function() {
  var vis = this;

  // ensures we only render once
  if (vis.rendered) {
    return false;
  } else {
    vis.rendered = true;
  }

  // Will keep track of which images are red
  vis.colors = [];

  // Delay time for the animation in milliseconds
  var delay = 50;

  // draw rects in the background
  var rect = vis.svg.selectAll(".rect")
    .data(vis.grid(vis.people));

  // enter
  rect.enter()
    .append("rect")
    .attr("class", "rect");

  var rectInnerPadding = vis.nodeSize / 10;
  rect
    .attr("width", vis.grid.nodeSize()[0] - rectInnerPadding)
    .attr("height", vis.grid.nodeSize()[1] - rectInnerPadding)
    .attr("transform", function(d) {
      return "translate(" + (d.x + (rectInnerPadding / 2)) + "," + (d.y + (
        rectInnerPadding / 2)) + ")";
    })
    .attr("fill", "#bbb");

  // transition the fill
  rect.transition()
    .delay(function(d, i) {
      // fill in one at a time
      // wait time in milliseconds
      // have a constant wait time at the start so that people can read the viz before it starts
      return 1000 + i * delay;
    })
    .attr("fill", function(d) {
      var color = d.active ? "red" : "#bbb";
      vis.colors.push(color);
      return color;
    });

  // exit
  rect.exit()
    .transition()
    .remove();

  // DRAW WOMAN IMAGE
  var image = vis.svg.selectAll(".image")
    .data(vis.grid(vis.people));

  // enter
  image.enter()
    .append("image")
    .attr("class", "image")

  // update
  image
    .attr("width", vis.grid.nodeSize()[0])
    .attr("height", vis.grid.nodeSize()[1])
    .attr("transform", function(d) {
      return "translate(" + (d.x) + "," + d.y + ")";
    })
    .attr("xlink:href", "images/woman-outline.png")
    .on("mouseover", function(d, i) {
    //   console.log(d);

      if (d.active) {
        // show quote b/c survivor
        var quote = d.quote;
        $('#survivor-quote')
          .show();
        $('#quote-text')
          .html(quote.Quote);
        $('#quote-source')
          .html(quote.Person);
      }
    });

  // exit
  image.exit()
    .transition()
    .remove();
}

function shuffle(array) {

  var currentIndex = array.length,
    temporaryValue, randomIndex;

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

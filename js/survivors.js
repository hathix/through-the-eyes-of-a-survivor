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
  this.isNextVis = 0;

  this.width = 960 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.womanGrayFill = "#777";

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

  d3.csv("data/cleaned/quick-stories.csv", function(data) {

    vis.quotes = data;

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

  // show fact
  $("#fact")
    .text("1 in 5 women will be sexually assaulted in college.")

  // Will keep track of which images are red
  vis.colors = [];

  // Delay time for the animation in milliseconds
  vis.delay = 25;

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
    .attr("fill", vis.womanGrayFill);

  // transition the fill
  rect.transition()
    .delay(function(d, i) {
      // fill in one at a time
      // wait time in milliseconds
      // have a constant wait time at the start so that people can read the viz before it starts
      return 1000 + i * vis.delay;
    })
    .attr("fill", function(d) {
      var color = d.active ? "red" : vis.womanGrayFill;
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
    .attr("xlink:href", "images/woman-outline.slate.png")
    .on("mouseover", function(d, i) {
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

Survivors.prototype.nextVis = function() {
  vis = this;

  var bluePeople = 18;
  var yellowPeople = 19;
  var greenPeople = 16;

  var rectangles = vis.svg.selectAll("rect");

  rectangles
    .transition()
    .delay(function(d, i) {
      // fill in one at a time
      // wait time in milliseconds
      // have a constant wait time at the start so that people can read the viz before it starts
      return 1000 + i * vis.delay;
    })
    .attr("fill", function(d, i) {

      // Activates blue people vis
      if (vis.isNextVis == 0) {
        if (vis.colors[i] == "red" && bluePeople != 0) {
          bluePeople -= 1;
          return "#00CCCC";
        }
      }

      // Activates green people vis
      if (vis.isNextVis == 1) {
        if ((vis.colors[i] == "red" || vis.colors[i] == "#00CCCC") &&
          yellowPeople != 0) {
          yellowPeople -= 1;
          return "yellow";
        }
      }

      if (vis.isNextVis == 2) {
        if ((vis.colors[i] == "red" || vis.colors[i] == "#00FF80") &&
          greenPeople != 0) {
          greenPeople -= 1;
          return "#00FF80";
        }
      }

      // Have to check whether they're red so that we keep them red on the next iteration
      if (vis.colors[i] == "red")
        return "red"
      else
        return vis.womanGrayFill;
    });

  // Making the text appear on click
  if (vis.isNextVis == 0) {
    $("#fact")
      .text("9 in 10 survivors know their assailant.");
  }

  if (vis.isNextVis == 1) {
    $("#fact")
      .text("19 in 20 of survivors don't report their sexual assault.");
  }

  if (vis.isNextVis == 2) {
    $("#fact")
      .text(
        "4 in 5 of survivors suffer chronic physical or psychological problems."
      );
  }



  // hide button if we're on the last stage
  if (vis.isNextVis === 2) {
    $('#survivor-button')
      .hide();
  } else {
    $('#survivor-button')
      .show();
  }

  // Updating which vis to use next
  vis.isNextVis += 1;
  $('#survivor-quote')
    .hide();


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

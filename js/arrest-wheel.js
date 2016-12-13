// from http://jsfiddle.net/ragingsquirrel3/qkHK6/

/**
 * "Wheel of fortune" esque spinner to show the difficulty of getting a perpetrator arrested
 */
ArrestWheel = function(_parentElement) {
  this.parentElement = _parentElement;

  // total slices, and "winning" slices
  this.slices = 16;
  this.winningSlices = 1;

  this.padding = {
    left: 30,
    top: 30,
    right: 30,
    bottom: 30
  }

  this.innerWidth = 400;
  this.innerHeight = 400;
  this.outerWidth = this.innerWidth + this.padding.left + this.padding.right;
  this.outerHeight = this.innerHeight + this.padding.top + this.padding.bottom;
  this.radius = this.innerHeight / 2;

  // TODO add padding



  // TODO make these not hardcoded
  // hide the results
  $('#wheel-win')
    .hide();
  $('#wheel-lose')
    .hide();

  this.prepareData();
}

/**
 * Generates dummy data for this wheel.
 */
ArrestWheel.prototype.prepareData = function() {
  var vis = this;

  // make dummy data to get the right number of evenly-spaced slices
  vis.data = [];
  for (var i = 0; i < vis.slices; i++) {
    vis.data.push({
      index: i,
      value: 1
    });
  }

  vis.initVis();
};

/**
 * Draws the wheel.
 */
ArrestWheel.prototype.initVis = function() {
  var vis = this;

  vis.svg = d3.select("#" + vis.parentElement)
    .append("svg")
    .attr("width", vis.outerWidth)
    .attr("height", vis.outerHeight);

  vis.wheelHolder = vis.svg.append("g")
    .attr("transform", "translate(" + (vis.radius + vis.padding.top) + "," +
      (vis.radius + vis.padding.left) + ")")
    .attr("class", "wheel-holder");

  // svg => wheelHolder => wheelGroup (where the wheel is actually drawn )
  vis.wheelGroup = vis.wheelHolder.append("g");


  // prepare the pie layout
  vis.pie = d3.layout.pie()
    .value(function(d) {
      return d.value;
    })
    .sort(function(a, b) {
      // sort the slices so that the first drawn slice is index 0,
      // then 1, etc.
      // this way we can properly correlate the ending angle of the spinner
      // with which slice was chosen.
      return a.index - b.index;
    });

  // arc generator function
  vis.arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(vis.radius);

  // draw pie paths
  vis.arcs = vis.wheelGroup.selectAll("g.slice")
    .data(vis.pie(vis.data))
    .enter()
    .append("g")
    .append("path")
    .attr("class", function(d) {
      // only the first `winningSlices` slices are good
      // we sorted slices by their indices, so we know that the slices are in
      // order 0, 1, 2, 3, etc
      return d.data.index < vis.winningSlices ? "slice win" : "slice lose";
    })
    .attr("d", vis.arc);



  // draw circle around circumference
  vis.ring = vis.svg.append("circle")
    .attr("cx", vis.outerWidth / 2)
    .attr("cy", vis.outerHeight / 2)
    .attr("r", vis.radius)
    .attr("class", "ring");

  // draw button in middle
  vis.button = vis.svg.append("circle")
    .attr("cx", vis.outerWidth / 2)
    .attr("cy", vis.outerHeight / 2)
    .attr("r", vis.radius / 8)
    .attr("class", "wheel-button");


  // draw pointer: upside down isosceles triangle
  var pointerWidth = 30;
  var pointerHeight = 45;
  // draw top left point, then top right, then bottom middle
  var points = {
    startX: (vis.innerWidth - pointerWidth) / 2 + vis.padding.left,
    startY: vis.padding.top - pointerHeight / 3,
    topRightRelX: pointerWidth,
    topRightRelY: 0,
    bottomRelX: -1 / 2 * pointerWidth,
    bottomRelY: pointerHeight
  };
  var pathString = [
    "M",
    points.startX,
    points.startY,
    "l",
    points.topRightRelX,
    points.topRightRelY,
    "l",
    points.bottomRelX,
    points.bottomRelY,
    "z"
  ].join(" ");
  vis.svg.append("path")
    .attr("d", pathString)
    .attr("class", "pointer")
    .attr("stroke", "black");


  // click handler to spinner
  vis.svg.on("click", function() {
    $('#wheel-start')
      .hide();

    vis.spin();
  });
};

ArrestWheel.prototype.spin = function() {
  var vis = this;

  // start a timer to spin the spinner, and have it stop at a random spot
  var startTime = Date.now();
  //  have it spin a few times
  var numRotations = 3 + Math.floor(Math.random() * 3);
  // then randomly generate an angle for it to stop at
  var endRemainderAngle = Math.random() * 360;

  // uncomment this if you want to hack the wheel to win
  // endRemainderAngle = 0.5 * 360 / vis.slices;

  var endAngle = (numRotations * 360) + endRemainderAngle;


  // determine which slice you stopped on
  var endSlice = Math.floor(endRemainderAngle / 360 * vis.slices);

  // # of degrees per millisecond
  var speed = 1 / 2;

  // how many milliseconds this will spin
  var totalSpinTime = endAngle / speed;

  d3.timer(function() {
    // delta is the time, in ms, since the timer started
    var delta = Date.now() - startTime;

    // the fraction of spin time that's elapsed
    // cap it at 1
    var rawTimeFraction = Math.min(delta / totalSpinTime, 1);

    var easedTimeFraction = d3.easeQuadOut(rawTimeFraction);

    // so, from that, determine the angle to show
    // our slices go clockwise but the default spin direction is counterclockwise—
    // so multiply the angle by -1 so the spinner goes clockwise
    // and as a result, our calculations of which slice you end on are correct
    var angle = -1 * endAngle * easedTimeFraction;

    // rotate the wheel
    vis.wheelGroup.attr("transform", "rotate(" + angle + ")");

    // stop spinning if we've hit the end
    if (rawTimeFraction === 1) {
      vis.onSpinnerEnd(endSlice);
      // return `true` to stop the timer
      return true;
    }
  });
};

/**
 * Called when the spinner stops on slice `landingSlice`.
 */
ArrestWheel.prototype.onSpinnerEnd = function(landingSlice) {
  var vis = this;

  if (landingSlice < vis.winningSlices) {
    // win!
    $('#wheel-win')
      .show();
    $('#wheel-lose')
      .hide();
  } else {
    // lose!
    $('#wheel-lose')
      .show();
    $('#wheel-win')
      .hide();
  }
}

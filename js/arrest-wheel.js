// from http://jsfiddle.net/ragingsquirrel3/qkHK6/

/**
 * "Wheel of fortune" esque spinner to show the difficulty of getting a perpetrator arrested
 */
ArrestWheel = function(_parentElement) {
  this.parentElement = _parentElement;

  // total slices, and "winning" slices
  this.slices = 16;
  this.winningSlices = 1;

  this.width = 400;
  this.height = 400;
  this.radius = this.height / 2;

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
    vis.data.push(1);
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
    .attr("width", vis.width)
    .attr("height", vis.height);

  vis.wheelHolder = vis.svg.append("g")
    .attr("transform", "translate(" + vis.radius + "," + vis.radius + ")");

  // svg => wheelHolder => wheelGroup (where the wheel is actually drawn )
  vis.wheelGroup = vis.wheelHolder.append("g");


  // prepare the pie layout
  vis.pie = d3.layout.pie()
    .value(function(d) {
      return d;
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
    .attr("class", function(d, i) {
      // only 1 slice is good
      return i < vis.winningSlices ? "slice win" : "slice lose";
    })
    .attr("d", vis.arc);



  // draw circle around circumference
  vis.ring = vis.svg.append("circle")
    .attr("cx", vis.width / 2)
    .attr("cy", vis.height / 2)
    .attr("r", vis.radius)
    .attr("class", "ring");

  // draw button in middle
  vis.button = vis.svg.append("circle")
    .attr("cx", vis.width / 2)
    .attr("cy", vis.height / 2)
    .attr("r", vis.radius / 10)
    .attr("class", "wheel-button");

  // draw pointer: upside down isosceles triangle
  var pointerWidth = 30;
  var pointerHeight = 30;
  // draw top left point, then top right, then bottom middle
  var points = {
    startX: (vis.width - pointerWidth) / 2,
    startY: 0,
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

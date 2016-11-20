// initialize libraries
// noUiSlider.create($('#count-slider')
//   .get(0), {
//     start: [2001, 2001],
//     step: 1,
//     connect: true,
//     range: {
//       min: [2001],
//       max: [2013]
//     },
//     pips: { // Show a scale with the slider
//       mode: 'steps',
//       stepped: true,
//       density: 100
//     }
//   });

$(function() {
  $('#fullpage')
    .fullpage({
      //   scrollingSpeed: 500,
      //   scrollBar: true,
      navigation: true,
      anchors: ['anchor-section-intro'],
      menu: '#main-menu'
    });
});
var lineChart = new LineChart("police-reports");
var crimeRate = new CrimeRate();
var survivors = new Survivors("affected", 20, 100);

d3.json("data/stories.json", function(error, data) {

  // each element of this array is a story
  data.forEach(function(story) {
    var typewriter = malarkey(document.querySelector("#" + story.id), {
      typeSpeed: 25,
      setter: function(elem, val) {
        // replace "\n" with line breaks
        val = val.replace(/\n/, "<br><br>");
        elem.innerHTML = val;
      }
    });
    story.lines.forEach(function(line) {
      typewriter.type(line + "\n")
        .pause(1500);
    });
  });
});

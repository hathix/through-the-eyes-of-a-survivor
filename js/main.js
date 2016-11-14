// initialize libraries
noUiSlider.create($('#count-slider')
  .get(0), {
    start: [2001, 2001],
    step: 1,
    connect: true,
    range: {
      min: [2001],
      max: [2013]
    },
    pips: { // Show a scale with the slider
      mode: 'steps',
      stepped: true,
      density: 100
    }
  });

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
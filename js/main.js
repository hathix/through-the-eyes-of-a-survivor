var stories;
d3.json("data/stories.json", function(error, data) {
  stories = data;

  // create a typewriter for each story
  stories.forEach(function(story) {
    story.typewriter = malarkey(document.querySelector("#" + story.id), {
      typeSpeed: 25,
      setter: function(elem, val) {
        // replace "\n" with line breaks
        val = val.replace(/\n/, "<br><br>");
        // have a cursor at the end of the string
        val = val.replace(/\|/, "") + "|";
        elem.innerHTML = val;
      }
    });
  });
});

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
      //   anchors: ['anchor-section-intro'],
      menu: '#main-menu',

      afterLoad: function(anchorLink, index) {
        // start typewriting each story once you visit it
        if (index === 2) {
          typewrite(stories[0]);
        }
        if (index === 3) {
          typewrite(stories[1]);
        }
        if (index === 5) {
            peopleDisplay.render();
        }
      },

      onLeave: function(index, nextIndex) {
        // pause typewriting once you leave
        // DOESNT WORK RN b/c the typewriters just keep ticking once you start them - hard to stop
        // if (index === 2) {
        //   stories[0].typewriter.pause();
        // }
        // if (index === 3) {
        //   stories[1].typewriter.pause();
        // }
      }
    });
});

var crimeRate = new CrimeRate("chart-area");
var lineChart = new LineChart("police-reports");
var survivors = new Survivors("affected", 20, 100);

var peopleDisplay = new PeopleDisplay("disturbing-fact-1", 9, 10);



// each element of this array is a story
var typewrite = function(story) {
  var numLines = story.lines.length;
  story.lines.forEach(function(line, index) {
    // append a "\n" at the end of all lines but the last
    var toType = line + (index < numLines - 1 ? "\n" : "");
    story.typewriter.type(toType)
      .pause(1500);
  });
}

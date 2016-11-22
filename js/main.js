var stories;
var MyEventHandler = {};
d3.json("data/stories.json", function(error, data) {
  stories = data;

  // create a typewriter for each story
  stories.forEach(function(story) {
    story.typewriter = malarkey(document.querySelector("#" + story.id), {
      typeSpeed: 30,
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

var peopleDisplays = [
  new PeopleDisplay("disturbing-fact-1",
    9, 10),
  new PeopleDisplay("disturbing-fact-2",
    19, 20),
  new PeopleDisplay("disturbing-fact-3",
    4, 5)
];

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
          // load first people display
          peopleDisplays[0].render();
        }
      },

      afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {

        if (index === 5) {
          // run people display
          // note that the first slide counts as a section, not a slide,
          // so the second slide is actually index 1
          if (slideIndex === 1) {
            peopleDisplays[1].render();
          }
          if (slideIndex === 2) {
            peopleDisplays[2].render();
          }
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

var barChart = new BarChart("police-reports-bars", MyEventHandler);
var crimeRate = new CrimeRate("chart-area");
var lineChart = new LineChart("police-reports");
$(MyEventHandler).bind("selectionChanged", function(event, category) {
  lineChart.onSelectionChange(category);
});
var survivors = new Survivors("affected", 20, 100);

d3.csv("data/cleaned/comparative-rates-over-time.csv", function(csv) {
  new ComparativeRates("comparative-rates", csv);
});

// var peopleDisplay = new PeopleDisplay("disturbing-fact-1", 9, 10);



// each element of this array is a story
var typewrite = function(story) {
  // if we've already written this story, don't do it again
  if (story.written) {
    return false;
  }

  // mark that we've already written this story, so we don't try writing it again
  story.written = true;

  var numLines = story.lines.length;
  story.lines.forEach(function(line, index) {
    // append a "\n" at the end of all lines but the last
    var toType = line + (index < numLines - 1 ? "\n" : "");
    story.typewriter.type(toType)
      .pause(1500);
  });
}

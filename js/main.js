var stories;
var MyEventHandler = {};
d3.json("data/stories.json", function(error, data) {
  stories = data;

  // create a typewriter for each story
  stories.forEach(function(story) {
    story.typewriter = malarkey(document.querySelector("#" + story.id), {
      typeSpeed: 20,
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

$(function() {
  $('#fullpage')
    .fullpage({

      navigation: true,
      menu: '#main-menu',

      afterLoad: function(anchorLink, index) {
        if (index === 2) {
          // gradually show the american woman
          $('#american-woman')
            .fadeTo(1000, 1, function complete() {
              // slide her in from the left
              $('#american-woman')
                .animate({
                  left: 250
                }, 1000);
            });
        }

        // start typewriting each story once you visit it
        if (index === 3) {
          typewrite(stories[0]);

          $('#party-woman')
            .fadeTo(1000, 1, function complete() {
              // slide her in from the left
              $('#party-woman')
                .animate({
                  left: 200
                }, 1000, function complete() {
                  $('#party-woman')
                    .prop('src', 'images/woman-red.png');

                });
            });
        }
        if (index === 5) {
          survivors.updateVisualization();

          $('#survivor-button')
            .show();
        }
        if (index !== 5) {
          // Erase the facts when the user leaves the section
        //   $("#fact")
        //     .text(" ");

          // Reset the vis to the first one
          survivors.isNextVis = 0;
        }
      },

      onLeave: function(index, nextIndex) {}
    });
});



var campusMap = new CampusMap("campus-map");
var barChart = new BarChart("police-reports-bars", MyEventHandler);
var lineChart = new LineChart("police-reports");

var rateReport = new RateReport("rate-report");

$(MyEventHandler)
  .bind("selectionChanged", function(event, category) {
    lineChart.onSelectionChange(category);
  });

var survivors = new Survivors("affected", 20, 100);

var arrestWheel = new ArrestWheel("arrest-wheel");

var comparativeRates;

d3.csv("data/cleaned/comparative-rates-over-time-transposed.csv", function(csv) {
  var eventHandler = {};
  $(eventHandler)
    .bind("selectionChanged", function(event, startYear, endYear, rateData) {
      // figure out the overall change based on the years
      var changes = rateData.map(function(row) {
        // contains metric and years
        var startValue = row[startYear];
        var endValue = row[endYear];
        // -0.5 => down 50%, +1.0 => up 100%
        var changeRatio = endValue / startValue - 1;

        return {
          type: row.Type,
          change: changeRatio
        };
      });

      rateReport.updateVis(changes, startYear, endYear);
    });

  comparativeRates = new ComparativeRates("comparative-rates", csv, eventHandler);
});

$('#survivors-button')
  .on('click', function() {
    survivors.updateVisualization();
  });


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
};

$('#survivor-button')
  .hide();


// equalize height of help tab pane
// get heights of all tabs
var tabHeights = $('#help-tabs')
  .find('.tab-pane')
  .map(function() {
    return $(this)
      .height()
  })
  .get();
// find max height
var maxHeight = d3.max(tabHeights);
// apply it to all tabs
$('#help-tabs')
  .find('.tab-pane')
  .each(function() {
    $(this)
      .height(maxHeight);
  });


// when you click on a citation, go to the citations slide
$('sup.citation')
  .on('click', function() {
    $.fn.fullpage.moveTo(12);
  });


$('#comparative-rates-play').on('click', function(){
    comparativeRates.play();
});

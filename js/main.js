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
//
// var peopleDisplays = [
//   new PeopleDisplay("disturbing-fact-1",
//     9, 10),
//   new PeopleDisplay("disturbing-fact-2",
//     19, 20),
//   new PeopleDisplay("disturbing-fact-3",
//     4, 5)
// ];

$(function() {
  $('#fullpage')
    .fullpage({
      //   scrollingSpeed: 500,
      //   scrollBar: true,
      navigation: true,
      //   anchors: ['anchor-section-intro'],
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

          // gradually show the woman
          $('#party-woman')
            .fadeTo(1000, 1, function complete() {
              // slide her in from the left
              $('#party-woman')
                .animate({
                  left: 200
                }, 1000);
            });
        }
        if (index === 4) {
          survivors.updateVisualization();

          $('#survivor-button')
            .show();
        }
        if (index !== 4) {
          // Erase the facts when the user leaves the section
          $("#fact")
            .text(" ");
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

var campusMap = new CampusMap("campus-map");
var barChart = new BarChart("police-reports-bars", MyEventHandler);
var lineChart = new LineChart("police-reports");
$(MyEventHandler)
  .bind("selectionChanged", function(event, category) {
    lineChart.onSelectionChange(category);
  });

var survivors = new Survivors("affected", 20, 100);

var arrestWheel = new ArrestWheel("arrest-wheel");

d3.csv("data/cleaned/comparative-rates-over-time.csv", function(csv) {
  new ComparativeRates("comparative-rates", csv);
});

// var peopleDisplay = new PeopleDisplay("disturbing-fact-1", 9, 10);


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









//if ($('.answer').is(":checked"))
//{
//console.log("yeah");
//}

//if(document.getElementsByClassName('answer').checked) {
//console.log("checked");
//} else {
//console.log("not checked");
//}

$('#survivor-button')
  .hide();


d3.csv("data/cleaned/sexual-assault-quiz.csv", function(questions) {

  $('#quiz-result')
    .hide();

  // each question has a Reason and a Story
  questions.forEach(function(question) {
    var html =
      `
            <tr>
                <td class="quiz-reason">
                    "${question.Reason}."
                </td>
                <td>
                  <button class="btn btn-default btn-yes">Yes</button>
                  <button class="btn btn-default btn-no">No</button>
                </td>
            </tr>
        `;
    var $element = $(html);

    // handle clicks
    $element.find(".btn-yes, .btn-no")
      .on('click', function() {
        // stuff that happens either way

        // remove the no button because all the answers are true
        $element.find(".btn-no")
          .remove();

        // de-highlight other rows
        $('#quiz-choices')
          .find('tr')
          .removeClass("active");
        // highlight this row
        $element.addClass("active");

        // show the outputs
        $('#quiz-result')
          .show();
        // show more info
        $('#quiz-reason')
          .html(question.Reason);
        $('#quiz-story')
          .html(question.Story);
        $element.find('.btn-yes')
          .removeClass('btn-default')
          .addClass('btn-warning');
      });
    $element.find(".btn-yes")
      .on('click', function() {
        // "yes" is always correct
        $('#quiz-correct')
          .show();
        $('#quiz-incorrect')
          .hide();
      });
    $element.find(".btn-no")
      .on('click', function() {
        // "no" is always incorrect
        $('#quiz-incorrect')
          .show();
        $('#quiz-correct')
          .hide();
      });

    // $element.attr("title", question.Story);
    $('#quiz-choices')
      .append($element);
  });


  // $('#quiz-story-holder').hide();
  //
  // var question = questions[0];
  // $('#quiz-reason').html(question.Reason);
  // $('#quiz-story').html(question.Story);
});

// $('#quiz-btn-yes, #quiz-btn-no').on('click', function(){
//     // show answers
//     $('#quiz-buttons').hide();
//     $('#quiz-story-holder').show();
// });

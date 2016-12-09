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
        if(index === 4){
          survivors.updateVisualization();
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
var lineChart = new LineChart("police-reports");
$(MyEventHandler).bind("selectionChanged", function(event, category) {
  lineChart.onSelectionChange(category);
});

var survivors = new Survivors("affected", 20, 100);

var arrestWheel = new ArrestWheel("arrest-wheel");

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

//if ($('.answer').is(":checked"))
//{
  //console.log("yeah");
//}

//if(document.getElementsByClassName('answer').checked) {
  //console.log("checked");
//} else {
  //console.log("not checked");
//}



// Check if the checkbox is checked
$(document).ready(function(){
  // Hide information for quiz
  $('#answer1')
      .hide();
  $('#answer2')
      .hide();
  $('#answer3')
      .hide();
  $('#answer4')
      .hide();
  $('#answer5')
      .hide();
  $('#answer6')
      .hide();
  $('#answer7')
      .hide();
  $('#answer8')
      .hide();
  $('#answer9')
      .hide();
  $('#answer10')
      .hide();
  $('#answer11')
      .hide();
  $('#answer12')
      .hide();
  $('#answer13')
      .hide();
  $('#answer14')
      .hide();
  $('#answer15')
      .hide();
  $('#answer16')
      .hide();
  $('#answer17')
      .hide();

    $('input[type=radio][name=q1]').change(function() {
      if (this.value == 'value1') {
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth1')
            .hide();
        $("#answer1")
            .show();
      }
      else if (this.value == 'value3') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();


        $('#truth3')
            .hide();
        $("#answer3")
            .show();
      }
      else if (this.value == 'value4') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth4')
            .hide();
        $("#answer4")
            .show();
      }
      else if (this.value == 'value5') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth5')
            .hide();
        $("#answer5")
            .show();
      }
      else if (this.value == 'value7') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth7')
            .hide();
        $("#answer7")
            .show();
      }
      else if (this.value == 'value8') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth8')
            .hide();
        $("#answer8")
            .show();
      }
      else if (this.value == 'value9') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth9')
            .hide();
        $("#answer9")
            .show();
      }
      else if (this.value == 'value10') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth10')
            .hide();
        $("#answer10")
            .show();
      }
      else if (this.value == 'value11') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth11')
            .hide();
        $("#answer11")
            .show();
      }
      else if (this.value == 'value13') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth13')
            .hide();
        $("#answer13")
            .show();
      }
      else if (this.value == 'value14') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth14')
            .hide();
        $("#answer14")
            .show();
      }
      else if (this.value == 'value15') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer17')
            .hide();
        $('#truth17')
            .show();

        $('#truth15')
            .hide();
        $("#answer15")
            .show();
      }
      else if (this.value == 'value17') {
        $('#answer1')
            .hide();
        $('#truth1')
            .show();
        $('#answer3')
            .hide();
        $('#truth3')
            .show();
        $('#answer4')
            .hide();
        $('#truth4')
            .show();
        $('#answer5')
            .hide();
        $('#truth5')
            .show();
        $('#answer7')
            .hide();
        $('#truth7')
            .show();
        $('#answer8')
            .hide();
        $('#truth8')
            .show();
        $('#answer9')
            .hide();
        $('#truth9')
            .show();
        $('#answer10')
            .hide();
        $('#truth10')
            .show();
        $('#answer11')
            .hide();
        $('#truth11')
            .show();
        $('#answer13')
            .hide();
        $('#truth13')
            .show();
        $('#answer14')
            .hide();
        $('#truth14')
            .show();
        $('#answer15')
            .hide();
        $('#truth15')
            .show();

        $('#truth17')
            .hide();
        $("#answer17")
            .show();
      }
    });



});

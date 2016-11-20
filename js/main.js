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

var story = [
  "She kind of liked kissing the guy, at least at first. The 19-year-old sophomore was visiting friends last fall at Arizona State University in Tempe, a couple of hours from her own campus. She was at a party, outside smoking with the DJ, who had been trying to pick up her friend and was now flirting with her. She didn’t mind the kisses but had no plans to go further. She never had before.",

  "“I’m not sexually active,” she said. “I’m very old-fashioned.”",

  "That didn’t stop the man, another sophomore. She says he led her to the deserted kitchen, pushed her against the counter and began groping her under her clothes as she tried to shove his hands away. He tried to pull her into another room and she went from annoyed to frightened. She was pushing him hard when her friends came in and immediately pulled her out of the house.",

  "“There was no question about consent,” she said. “I said ‘no’ and he didn’t care.”",
  "She slept, but she awoke to another scare: Her phone was full of messages from the man. He had found her on Tinder, a dating app that indicated to him that she was nearby.",
  "“I can tell you’re within a mile of me,” he texted. She panicked all over again.",
  "The episode exacerbated problems with anxiety and depression that she had already been experiencing. She flunked her classes that semester and has temporarily withdrawn from school."
];

var malarkey = malarkey(document.querySelector("#story-typing-1"), {
  typeSpeed: 25,
  setter: function(elem, val) {
      // replace "\n" with line breaks
    val = val.replace(/\n/, "<br><br>");
    elem.innerHTML = val;
  }
});
story.forEach(function(line) {
  malarkey.type(line + "\n").pause(2000);
});

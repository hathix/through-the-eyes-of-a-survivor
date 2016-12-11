

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
          .css("visibility", "hidden");

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

window.WidgetVoteBox = (function() {
  var options, loadedTime, rootPath, count = 0;

  /*  ELEMENT RELOADING FUNCTIONALITY  */
  var reload_element_by_id = function(selector) {
    var reload_html = $('#' + selector).html();
    document.getElementById(selector).innerHTML = reload_html;
  };

  var reload_add_idea_field = function() {
    $('#new_idea_field').val("");
    $('.new_idea_counter div').html('&nbsp;');
    $('#new_idea_field').hint();
  };

  /*  WIDGET DYNAMIC SIZING AND SPACING ONLOAD FUNCTIONALITY*/
  //  move "I can't decide" down farther if the "Flag as Inappropriate" button will get in its way
  //  viewportwidth comes from widget.js
  var move_down_cant_decide = function() {
    var flag_enabled = options.earl_flag_enabled;
    if (viewportwidth < 420 && flag_enabled == "true")
    {
      if ($('.cd_container').hasClass('.two_top_margin'))
      {
        $('.cd_container').removeClass('two_top_margin').addClass('six_top_margin');
      }
    }
  };

  //  bind these functions to window onload
  //  resize_widget() comes from widget.js
  function start() {
    resize_widget();
    move_down_cant_decide();

    //  reload the vote page (for ie)
    if ($.browser.msie) {
      reload_element_by_id('left_choice_cell');
      reload_element_by_id('right_choice_cell');
      reload_element_by_id('cv_question');
    }
  }

  /*  TABBING FUNCTIONALITY  */

  //  a general tabbing function
  var switch_tabs = function(event) {
    $('.current').hide();

    $('.current_tab').removeClass('current_tab');
    $('.current').removeClass('current');

    if ($(this).hasClass('about_tab')) {
      $('#about').addClass('current');
    }
    else if ($(this).hasClass('vote_tab')) {
      $('#cast_votes').addClass('current');
    }
    else if ($(this).hasClass('results_tab')) {
      $('#results').addClass('current');
    }
    else {  //  must have clicked return to voting
      $('.vote_tab').addClass('current_tab');
      $('#cast_votes').addClass('current');
    }

    $(this).addClass('current_tab');
    $('.current').show();

    return false;
  };

  /*  VIEW RESULTS TAB LOADING AND QUESTION MARK FUNCTIONALITY */
  var viewResultsTabLoadingAndQuestionMark = function(event) {
    $.get($(this).attr("href"), function(data) {
      $('#render_spot').html(data);
      $('.question_mark').click(function() {
        $('#render_spot').scrollTo('#explanation');
        $('.exp_header').effect("highlight", {}, 1500);
        return false;
      });
      $('#results_question').height(0.2 * newHeight + 'px');
    });
  };

  /*  CLOSE BUTTON FUNCTIONALITY */
  var closeButton = function(event) {
    $('#the_add_box').hide();
    $('#flag_inappropriate').hide();
    $('#cant_decide_options').hide();
    $('.vote-footer').show();
    $('.add_container').show();
  };

  /*  ADDING AN IDEA FUNCTIONALITY  */
  var addAnIdeaButton = function() {
    $('.vote-footer').hide();
    $('.add_container').hide();
    $('#the_add_box').show();

    return false;
  };

  onIdeaSubmitButtonClick = function(event){
    var new_idea = $('#new_idea_field').val();
    var default_text = $('#default_text').val();
    $('.example_notice').hide();
    reload_add_idea_field();

    //  if new idea is blank or longer than 140 characters, do not allow it to submit
    if ((new_idea == 'Add your own idea here...') || (new_idea === '') || new_idea == default_text) {
        event.returnValue = false;
        alert(options.vote_submit_idea_default_error);
        return false;
    }
    if (new_idea.length > 140) {
        alert(options.vote_submit_idea_too_long_error);
        event.returnValue = false;
        return false;
    }

    //  hide/show the necessary elements
    $('#initial_notice').hide();
    $('#the_add_box').hide();
    $('.vote-footer').show();
    $('.add_container').show();
    $('.indicator').show();

    //  prepend this for scrolling funtionality
    $('.tellmearea').prepend("<div id = \"newlines\" style=\"display:none\"> <br><br></div>");
    $('#newlines').slideDown(1000);

    $.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  {
        backgroundColor: '#000',
        opacity:         0.0,
        cursor:    null
     }});

    var question_id = $(this).attr("rel");

    $.post(rootPath + 'questions/' + question_id + '/add_idea.js' + '?locale=' + options.locale,
        {authenticity_token: AUTH_TOKEN, new_idea : new_idea, appearance_lookup: $('#appearance_lookup').val()},
        function(data){
          $.unblockUI();

          //  remove these now that the scrolling is complete and they aren't wanted
          $('#newlines').remove();

          //  prepend a different message depending on whether idea submissions need approval
          if (data.choice_status == 'active') {
            $('.tellmearea').prepend("<div id = \"tellme_prepended\"" + count + ">" + data.message + "</a></div><br/>");
          }
          else {
            $('.tellmearea').prepend("<div id = \"tellme_prepended\"" + count + ">" + options.vote_idea_sent_for_review + "</a></div><br/>");
          }

          //  highlight the most recently prepended message
          $("#tellme_prepended").effect("highlight", {}, 1500);
          count++;


          $('.indicator').hide();
        },
        "json"
      );
    return false;
  };

  /*  VOTING FUNCTIONALITY  */
  var onVoteCellClick = function(event){

    //  Remove this stuff when somebody votes in case it's still there... add idea stuff
    $('#the_add_box').hide();
    $('.add_idea_button.rounded').show();

    //  Remove in case it's still there... can't decide stuff
    $('.add_container').show();
    $('.vote-footer').show();
    $('#cant_decide_options').hide();

    //  Remove in case it's still there... flag stuff
    $('#new_flag_field').val('');
    $('#flag_inappropriate').hide();

    //  Remove in case it's still there... other stuff
    $('#initial_notice').hide();
    $('.example_notice').hide();

    var currentTime = new Date();
    var time_viewed = currentTime - loadedTime;

    // TODO refactor to use url_for in rails
    var the_id = $(this).attr("id");
    var the_locale = options.locale;

    var winner_side = (the_id == "left_choice_cell") ? "left" : "right";
    var loser_side = (the_id == "left_choice_cell") ? "right" : "left";

    var question_id = $(this).attr("rel");

    var loser_link = $('a#' + loser_side + 'side');
    var winner_link = $('a#' + winner_side + 'side');

    var loserString = loser_link.html();
    var winnerString = winner_link.html();

    var loser_url = "/" + loser_link.attr("question_slug") + "/choices/" + loser_link.attr("choice_id");
    var winner_url=  "/" + winner_link.attr("question_slug") + "/choices/" + winner_link.attr("choice_id");


    if(the_locale != 'en'){
      loser_url += '?locale=' + the_locale;
      winner_url += '?locale=' + the_locale;
    }


    var loser = "<a href='" + loser_url +  "'>" + loser_link.html() + "</a>";
    var winner = "<a href='" + winner_url + "'>" + winner_link.html() + "</a>";
    $('.leftside, .rightside').addClass('disabled');

    var prompt_id = $('#prompt_id').val();
    var appearance_lookup = $('#appearance_lookup').val();
    $.ajax({
      type: "post",
      url: rootPath + 'questions/' + question_id + '/prompts/' + prompt_id + '/vote.js' + '?locale=' + the_locale,
      dataType: "json",
      data: {
        'authenticity_token' : AUTH_TOKEN,
        'time_viewed' : time_viewed,
        'prompt_id': prompt_id,
        'appearance_lookup': appearance_lookup,
        'direction' : winner_side
      },
      beforeSend: function() {
        $.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  {
          backgroundColor: '#000',
          opacity:         0.0
        }});

        $('.indicator').show();

        //  append this for scrolling funtionality
        if (count !== 0) {
          $('.tellmearea').prepend("<div id = \"newlines\" style=\"display:none\"> <br><br></div>");
          $('#newlines').slideDown(1000);
        }

      },
      timeout: 10000,
      error: function(request,error) {
        $.unblockUI();
        $('.indicator').hide();
        if (error == "timeout") {
          $('.tellmearea').prepend("<div id = \"error_prepended\">" + options.vote_vote_timeout_error + "</div>");
          $('#error_prepended').effect("highlight", {color: '#ff0000'}, 1500);
          count++;
        } else {
          $('.tellmearea').prepend("<div id = \"error_prepended\">" + options.vote_vote_other_error + "</div>");
          $('#error_prepended').effect("highlight", {color: '#ff0000'}, 1500);
          count++;
        }

        loadedTime = new Date(); //  reset loaded time

      },
      success: function(data){
        $.unblockUI();
        $('.indicator').hide();
        $('.leftside').html(data.newleft);
        $('.rightside').html(data.newright);
        $('.leftside, .rightside').removeClass('disabled');

        //  used for fraud detection / back button behavior fixing
        $('#left_side_text').val(data.newleft);
        $('#right_side_text').val(data.newright);

        $('#prompt_id').val(data.prompt_id);
        $('#appearance_lookup').val(data.appearance_lookup);

        //  truncate idea text that will go in tellmearea
        var maxLength = 45;
        if (winnerString.length > maxLength) {
          winnerString = winnerString.substring(0, maxLength - 3) + "...";
        }
        if (loserString.length > maxLength) {
          loserString = loserString.substring(0, maxLength - 3) + "...";
        }

        $('#newlines').remove();

        var winnerLoser = options.vote_you_chose_winner_over_loser
             .replace('%winner%', "<span class='idea_result'>" + winnerString + "</span><br />")
             .replace('%loser%', "<span class='idea_result'>"  + loserString + "</span>");
        var prependText = "<div id = \"tellme_prepended\"" + count + ">" + winnerLoser + "</div>";
        if (count > 0) {
          prependText += "<br/>";
        }
        $('.tellmearea').prepend(prependText);

        $("#tellme_prepended").effect("highlight", {}, 1500);
        count++;

        current_vote_count = $('#votes_count').html();
        $('#votes_count').html(increment(current_vote_count));

        loadedTime = new Date(); //reset loaded time
      }// End success
    }); // End ajax method
    return false;
  };

  /* CAN'T DECIDE FUNCTIONALITY  */
  var onCantDecideBtnClick = function() {
    //  hide/show everything necessary
    $('.vote-footer').hide();
    $('#cant_decide_options').show();
    $('.add_container').hide();

    return false;
  };

  var onCdBoxLinkClick = function(event) {
    event.preventDefault();

    var reason = $(event.target).attr('href').replace(/^#*/, '');

    //  make the right stuff reappear/rehide/work
    //  cd stuff
    $('.vote-footer').show();
    $('#cant_decide_options').hide();

    //  idea/other stuff...
    $('.add_container').show();
    $('#initial_notice').hide();

    //  Remove in case it's still there (flag stuff)
    $('#new_flag_field').val('');

    var currentTime = new Date();
    var time_viewed = currentTime - loadedTime;
    $('.example_notice').hide();
    //$.setFragment({ "page" : $.queryString(this.href).page });

    $('.indicator').show();

    $('.tellmearea').prepend("<div id = \"newlines\" style=\"display:none\"> <br></div>");
    $('#newlines').slideDown(1000);

    var prompt_id = $('#prompt_id').val();
    var appearance_lookup = $('#appearance_lookup').val();
    $('.leftside, .rightside').addClass('disabled');
    $.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  {
             backgroundColor: '#000',
             opacity:         0.0,
             cursor:    null
        }});
    var question_id = $(event.target).attr("data-questionid");
    $.post(rootPath + 'questions/' + question_id + '/prompts/' + prompt_id + '/skip.js'+ '?locale=' + options.locale,
      {
        'authenticity_token' : AUTH_TOKEN,
        'cant_decide_reason' : reason,
        'time_viewed' : time_viewed,
        'appearance_lookup': appearance_lookup
      },
      function(data){
        $('#newlines').remove();
        $('.tellmearea').prepend("<div id = \"tellme_prepended\"" + count + ">" + data.message + "</a></div><br/>");
        $("#tellme_prepended").effect("highlight", {}, 1500);
        count++;

        $('.indicator').hide();
        $.unblockUI();
        $('.leftside').html(data.newleft);
        $('.rightside').html(data.newright);
        $('.leftside, .rightside').removeClass('disabled');
        $('#prompt_id').val(data.prompt_id);
        $('#appearance_lookup').val(data.appearance_lookup);
        loadedTime = new Date(); //  reset loaded time
      },
      "json"
    );
    return false;
  };

  /* FLAG AS INAPPROPRIATE FUNCTIONALITY  */
  var flagLinkClick = function(event){
    flag_side = $(this).attr('id');

    //  hide/show everything necessary
    $('.vote-footer').hide();
    $('.add_container').hide();
    $('.add-box').hide();
    $('#cant_decide_options').hide();
    $('#flag_inappropriate').show();

    event.stopPropagation();
    event.preventDefault();

  };

  var onFlagSubmitButtonClick = function(event) {
    event.stopPropagation();
    user_text = null;
    user_text = $('#flag_inappropriate textarea').val();
    if(!user_text) {
      alert("You must include an explanation");
      return false;
    }

    //  make the right stuff reappear/rehide/work
    $('.vote-footer').show();
    $('#flag_inappropriate').hide();
    $('#new_flag_field').val('');
    $('.add_container').show();
    $('#initial_notice').hide();

    var currentTime = new Date();
    var time_viewed = currentTime - loadedTime;
    $('.example_notice').hide();

    $('.tellmearea').prepend("<div id = \"newlines\" style=\"display:none\"> <br></div>");
    $('#newlines').slideDown(1000);

    $('.indicator').show();
    var prompt_id = $('#prompt_id').val();

    var appearance_lookup = $('#appearance_lookup').val();
    $.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  {
      backgroundColor: '#000',
      opacity:         0.0,
      cursor:    null
    }});

    var question_id = $(this).attr("rel");
    $.post(rootPath + 'questions/' + question_id + '/prompts/' + prompt_id + '/flag.js'+ '?locale=' + options.locale,
      {
        'authenticity_token' : AUTH_TOKEN,
        'flag_reason' : user_text,
        'time_viewed' : time_viewed,
        'prompt_id': prompt_id,
        'side': flag_side,
        'appearance_lookup': appearance_lookup
      },

      function(data) {
        if(data.error){
          window.location.replace(data.redirect);
        }
        else {
          $('#newlines').remove();
          $('.tellmearea').prepend("<div id = \"tellme_prepended\"" + count + ">" + data.message + "</a></div><br/>");
          $("#tellme_prepended").effect("highlight", {}, 1500);
          count++;

          $('.indicator').hide();
          $.unblockUI();
          $('.leftside').html(data.newleft);
          $('.rightside').html(data.newright);
          $('#prompt_id').val(data.prompt_id);
          $('#appearance_lookup').val(data.appearance_lookup);
          current_item_count = $('#item_count').html();
          $('#item_count').html(decrement(current_item_count));
          loadedTime = new Date(); //  reset loaded time

          //  used for fraud detection / back button behavior fixing
          $('#left_side_text').val(data.newleft);
          $('#right_side_text').val(data.newright);
        }
      },
      "json"
    );
    return false;
  };

  //  Note that most of flag as inappropriate close functionality is the same as closing an idea or can't decide
  //  The extra text needs to be cleared here because we don't want text that was typed when the left flag button is clicked to reappear when the right flag button is clicked
  var onFlagCloseClick = function(event) {
    $('#new_flag_field').val('');
  };

  /*  ABOUT PAGE SCROLLING AND HIGHLIGHTING FUNCTIONALITY */
  var initPageScrollAndHighlight = function() {
    var makeOnFaqClick = function(num) {
      return function() {
        var about_q = '#about_q' + num;
        $('.scrollbar_container').scrollTo(about_q);
        $(about_q).effect("highlight", {}, 1500);
        return false;
      };
    };
    for (var i = 1; i < 7; i++)
    {
      var faq_q = '#faq_q' + i;

      $(faq_q).click(makeOnFaqClick(i));
    }
  };

  var init = function(_options) {
    options = _options;
    loadedTime = new Date();
    rootPath = options.root_path;

    if (!($.browser.msie && parseInt($.browser.version, 10) < 8)) {
      // IE 6 and 7 have problems with the rounded corners and scrollable div
      $('.rounded').corner('5px');
    }

    $(document).ready(function() {
      $('#new_idea_field').jqEasyCounter({target: '.new_idea_counter'});
    });
    window.onload = start;
    $('.tab').click(switch_tabs);
    $('.return_voting').click(switch_tabs);
    $('#view_results_link').click(viewResultsTabLoadingAndQuestionMark);
    $('.close').bind('click', closeButton);
    $('.add_idea_button.rounded').click(addAnIdeaButton);
    $('#submit_btn').bind('click', onIdeaSubmitButtonClick);
    $('.vote_cell').bind('click', onVoteCellClick);
    $('#cant_decide_btn').bind('click', onCantDecideBtnClick);
    $('.cd_box a').click(onCdBoxLinkClick);
    $('.flag_link').bind("click", flagLinkClick);
    $('.flag_submit_button').bind("click", onFlagSubmitButtonClick);
    $('.flag_close').bind('click', onFlagCloseClick);
    initPageScrollAndHighlight();
  };

  return {
    init: init
  };
})();

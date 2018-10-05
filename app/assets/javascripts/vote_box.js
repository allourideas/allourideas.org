window.VoteBox = (function() {
  var loadedTime, rootPath, flag_side = null;

  var handle_history_events = function(event){
    var left_side_text = $('#left_side_text').val();
    var right_side_text = $('#right_side_text').val();

    // This only takes effect if the page is loaded from back or forward buttons
    if(left_side_text && left_side_text != "blank_history" && left_side_text != $('.leftside').html()){
      $('.leftside').html(left_side_text);
    }
    if(right_side_text && right_side_text != "blank_history" && right_side_text != $('.rightside').html()){
      $('.rightside').html(right_side_text);
    }
  };

  var initAddBox = function(options) {
    $('#the_add_box .new_idea_field').jqEasyCounter({target: '#the_add_box .new_idea_counter'});
    $('#the_add_box button').hide();

    $('#the_add_box').on('focus', 'textarea', function(ev) {
      $('#the_add_box button').show();
      $('#the_add_box .new_idea_counter').show();
    });
    $('#the_add_box').on('blur', 'textarea', function(ev) {
      if ($.trim($(ev.currentTarget).val()).length === 0) {
        $('#the_add_box button').fadeOut();
      }
      $('#the_add_box .new_idea_counter').fadeOut();
    });
    // allow enter to add idea
    $('#the_add_box').on('keypress', 'textarea', function(ev) {
      $('#the_add_box button').show();
      if (ev.which == 13) {
        ev.preventDefault();
        $('#the_add_box button').click();
      }
    });

    // handle submit on add new idea box
    $('#the_add_box').on('click', 'button', function(ev) {
      ev.preventDefault();
      var button = $(ev.currentTarget);
      button.addClass('disabled');
      var box = $(ev.delegateTarget);
      var new_idea = box.find('.new_idea_field').val();
      var default_text = $('#default_text').val();
      var question_id = button.data("question_id");

      $('.example_notice').hide();

      // verify new idea is not blank, default or longer than 140 characters
      if (new_idea == 'Add your own idea here...' || new_idea === '' || new_idea == default_text) {
        alert(options.vote_submit_idea_default_error);
        return;
      }
      if (new_idea.length > 140) {
        alert(options.vote_submit_idea_too_long_error);
        return;
      }

      $('.tellmearea').html('');
      var data = {authenticity_token : AUTH_TOKEN, new_idea: new_idea, appearance_lookup: $('#appearance_lookup').val()};
      var url  = rootPath + 'questions/' + question_id + '/add_idea.js?locale=' + options.locale;
      $.post(url, data, function(data){
        button.removeClass('disabled');
        // keypress is for counter
        $('#new_idea_field').val('').show().keypress().blur();

        var responseText = '';
        if (data.choice_status == 'active') {
          responseText = options.vote_submit_idea_thankyou;
          current_item_count = $('#item_count').html();
          $('#item_count').html(increment(current_item_count));
        }
        else {
          responseText = options.vote_idea_sent_for_review;
        }
        box.find('.idea-success p').html(responseText);
        box.find('.idea-success').show();
        setTimeout(function() {
          box.find('.idea-success').hide(300);
        }, 5 * 1000);

      }, "json").fail(showAjaxError);
    });
  };

  // creates new idea vote buttons and slide them in, while
  // sliding out the old idea vote buttons
  var loadNewPrompts = function(data) {
    var oldLeftDiv = $('.leftside.btn-vote-idea').closest('div');
    var oldRightDiv = $('.rightside.btn-vote-idea').closest('div');
    var newLeftDiv = oldLeftDiv.clone(true).hide();
    var newRightDiv = oldRightDiv.clone(true).hide();
    var newLeft = newLeftDiv.find('.btn-vote-idea');
    var newRight = newRightDiv.find('.btn-vote-idea');
    var bothNew = newLeft.add(newRight);

    bothNew.addClass('btn-primary').removeClass('btn-success');

    newLeft.html(data.newleft);
    newRight.html(data.newright);
    newLeft.data('choice_id', data.left_choice_id);
    newLeft.data('choice_url', data.left_choice_url);
    newRight.data('choice_id', data.right_choice_id);
    newRight.data('choice_url', data.right_choice_url);

    newLeftDiv.insertBefore(oldLeftDiv);
    newRightDiv.insertBefore(oldRightDiv);

    // update can't decide options
    $('.cd_options .leftside em').html(data.newleft);
    $('.cd_options .rightside em').html(data.newright);

    //used for fraud detection / back button behavior fixing
    $('#left_side_text').val(data.newleft);
    $('#right_side_text').val(data.newright);

    // animation for sliding in / out choices
    newLeftDiv.add(newRightDiv).slideDown(function() {
      bothNew.removeClass('disabled');
    });
    oldLeftDiv.add(oldRightDiv).slideUp(function() {
      $(this).remove();
    });
  };

  var showAjaxError = function(request, error) {
    if (error == 'error') {
      if (request.responseText && request.responseText.length > 0) {
        var response = $.parseJSON(request.responseText);
        if (response.error == 'CantFindSessionFromCookies') {
          $('#cookie_request_error').modal('show');
        }
        else {
          $('#unknown_request_error .error-type').html(response.error + '.');
          $('#unknown_request_error').modal('show');
        }
      }
    }
    else if (error == 'timeout') {
      $('#timeout_request_error').modal('show');
    }
    else if (error == 'abort') {
      $('#abort_request_error').modal('show');
    }
  };

  var initVoteBox = function(options) {
    $('.votebox').on('click', '.btn-vote-idea', function(event){
      event.preventDefault();

      var winningLink = $(event.currentTarget);
      // return early if disabled or not btn-primary
      if (!winningLink.not('.disabled').is('.btn-primary')) {
        return;
      }
      var losingLink  = winningLink.closest('.votebox').find('.btn-vote-idea').not(winningLink);
      var winningSide = winningLink.data('side').replace('side', '');

      winningLink.removeClass('btn-primary').addClass('btn-success').addClass('disabled');
      losingLink.removeClass('btn-primary').addClass('disabled');

      var currentTime = new Date();
      var time_viewed = currentTime - loadedTime;
      var the_locale = options.locale;


      var question_id = winningLink.data("question_id");

      var prompt_id = $('#prompt_id').val();
      var appearance_lookup = $('#appearance_lookup').val();
      $('.tellmearea').html('');

      $.ajax({
        type: "post",
        url: rootPath + 'questions/' + question_id + '/prompts/' + prompt_id + '/vote.js' + '?locale=' + the_locale,
        dataType: "json",
        timeout: 10000,
        data: {
          'authenticity_token' : AUTH_TOKEN,
          'time_viewed' : time_viewed,
          'prompt_id': prompt_id,
          'appearance_lookup': appearance_lookup,
          'direction' : winningSide
        },
        error: function(request,error) {
          winningLink.addClass('btn-primary').removeClass('btn-success').removeClass('disabled');
          losingLink.addClass('btn-primary').removeClass('disabled');
          showAjaxError(request, error);
          loadedTime = new Date(); //reset loaded time
        },
        success: function(data){

          loadNewPrompts(data);

          $('#prompt_id').val(data.prompt_id);
          $('#appearance_lookup').val(data.appearance_lookup);

          current_vote_count = $('#votes_count').html();
          $('#votes_count').html(increment(current_vote_count));

          loadedTime = new Date(); //reset loaded time
        }// End success
      }); // End ajax method
    });
  };

  var initCantDecide = function(options) {
    $('#cant_decide_options').on('click', 'button', function(ev) {
      ev.preventDefault();
      var target = $(ev.currentTarget);
      var reason = target.data('reason');
      var question_id = target.data("questionid");
      if (!reason || !question_id) {
        return;
      }
      $('.btn-vote-idea').addClass('disabled');
      var time_viewed = (new Date()) - loadedTime;
      var prompt_id = $('#prompt_id').val();
      var appearance_lookup = $('#appearance_lookup').val();

      $('.example_notice').hide();
      $('.tellmearea').html('');
      $.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  {
          backgroundColor: '#000',
          opacity:         0.0
      }});

      var postData = {
        'authenticity_token' : AUTH_TOKEN,
        'cant_decide_reason' : reason,
        'time_viewed' : time_viewed,
        'appearance_lookup': appearance_lookup
      };
      var url = rootPath + 'questions/' + question_id + '/prompts/' + prompt_id + '/skip.js' + '?locale=' + options.locale;
      $.post(url, postData, function(data) {
        $.unblockUI();
        loadNewPrompts(data);

        $('#prompt_id').val(data.prompt_id);
        $('#appearance_lookup').val(data.appearance_lookup);
        //clear the radio buttons somehow?
        loadedTime = new Date(); //reset loaded time
      },"json").fail(showAjaxError);
    });
  };

  // handle flag inappropriate clicks
  // flag_side is used later on submit to determine which choice
  // is being marked as inappropriate
  var initFlagInappropriate = function(options) {
    $('.flag_link').click(function(ev) {
      ev.preventDefault();
      flag_side = $(this).attr('id');
      $('#flag_inappropriate textarea').val('');
    });

    $('#flag_inappropriate').on('click', 'button', function(ev) {
      var user_text = null;
      user_text = $('#flag_inappropriate textarea').val();
      if (!user_text) {
        alert("You must include an explanation");
        return;
      }
      $('#flag_inappropriate').modal('hide');

      var time_viewed = (new Date()) - loadedTime;
      var prompt_id = $('#prompt_id').val();
      var appearance_lookup = $('#appearance_lookup').val();
      var question_id = $(ev.currentTarget).data('question_id');
      $('.btn-vote-idea').addClass('disabled');

      $('.example_notice').hide();
      $('.tellmearea').html('');

      $.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  {
          backgroundColor: '#000',
          opacity:         0.0
      }});

      var url = rootPath + 'questions/' + question_id + '/prompts/' + prompt_id + '/flag.js'+ '?locale=' + options.locale;
      var postData = {
        'authenticity_token' : AUTH_TOKEN,
        'flag_reason' : user_text,
        'time_viewed' : time_viewed,
        'side': flag_side,
        'appearance_lookup': appearance_lookup
      };
      $.post(url, postData, function(data) {
        if (data.error) {
          window.location.replace(data.redirect);
        }
        else {
          $.unblockUI();

          loadNewPrompts(data);

          $('#prompt_id').val(data.prompt_id);
          $('#appearance_lookup').val(data.appearance_lookup);
          current_item_count = $('#item_count').html();
          $('#item_count').html(decrement(current_item_count));
          loadedTime = new Date(); //reset loaded time
        }
      }, "json").fail(showAjaxError);
    });
  };

  var initFirstTime = function(options) {
    if (options.first_time) {
      $('.firsttime').fadeIn(2000);
      $('.firsttime, #close, .vote_cell').bind("click", function() {
        $(".firsttime").fadeOut(500);
      });
    }
  };

  // Test if we can set and read cookies.
  // If we can't, then the browser probably has 3rd party cookies disabled
  // unless the user has first navigated to the domain serving the iframe source.
  var initCookiesBlocked = function(options) {
    var cookieValue = "cookieTest" + new Date().getTime();
    document.cookie = "cookieTest=" + cookieValue;
    if (document.cookie.indexOf("cookieTest=" + cookieValue) === -1) {
      var cookies_failed = document.getElementById('cookies-failed');
      if (cookies_failed) {
        cookies_failed.style.display = 'block';
        var img = new Image();
        img.src = '/cookies_blocked.gif?question_id=' + options.question_id+ '&session_id=' + options.session_id + '&referrer=' + encodeURIComponent(document.referrer);
      }
    }
    else {
      // cleanup test cookie
      document.cookie = 'cookieTest=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };

  var init = function(options) {
    loadedTime = new Date();
    rootPath = options.root_path;

    initCookiesBlocked(options);
    initFirstTime(options);
    $('.rounded').corner('5px');
    handle_history_events();
    initAddBox(options);
    initVoteBox(options);
    initCantDecide(options);
    initFlagInappropriate(options);
  };

  return {
    init: init
  };
})();

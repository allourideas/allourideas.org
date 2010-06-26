$(document).ready(function() {
	// voting
  $('a.vote').live('click', function(e) {
		if ($(this).hasClass('loading')) {
			alert("One sec, we're loading the next pair...");
		} else {
			$('.click_to_vote').hide(); // visible if the users hasn't voted
			$('a.vote').addClass('loading'); // spinner
			$(this).addClass('chosen');  // checkmark
			castVote($(this));
		}
		e.preventDefault();
  });

	// uploading a photo
	// uses ajaxupload.js (AjaxUpload throws an error if button isn't on page)
	var button = $('#add_photo_button');
	if (button.length != 0) {
	  new AjaxUpload(button, {
	    action: button.attr('href'),
	    name: 'new_idea',
	    data: {
	      question_id : button.attr('question_id'),
	      authenticity_token: AUTH_TOKEN
	    },
	    autoSubmit: true,
	    responseType: "json",
	    onChange: function(file, extension){
	      $('#upload_status').dialog('open');
	    },
	    onSubmit : function(file , ext){
	      // validate jpg, png, jpeg, or gif
	      if (! (ext && /^(jpg|png|jpeg|gif)$/i.test(ext))){
	        $('#upload_status_message').html('Please select another image. <br />(Only jpg png and gifs allowed)');
	        return false;
	      }
	    },
	    onComplete: function(file, response) {
	      $('#upload_status_message').html('<strong>Thanks!</strong><br />Your photo has been submitted for review.<br />It will appear soon.');
	    }
	  });
	};

	// can't decide submit (skip)
	$('#cant_decide_form').submit(function(e){
		submitCantDecide($(this));
		e.preventDefault();
	});

	// flag as inappropriate submit
	$('#flag_as_inappropriate_form').submit(function(e){
		submitFlag($(this));
		e.preventDefault();
	});

	// view ajax graph
	$('a.ajax_graph').live('click', function(e) {
		$('#graphs > li > a').removeClass('active');
		$(this).addClass('active');

		target = $('.target');
		target.html('<img src=/images/indicator.gif />')
		target.attr('id', $(this).attr('div_id'));

		if ($(this).attr('response_type') == 'script') {
			jQuery.get($(this).attr("href"), null, null, $(this).attr('response_type'));
		} else {
			// total hack for world map
			var iframe_html= "<iframe id='voter_map_iframe' src='" + $(this).attr('href') + "' onload='iframe_loaded();' width='100%' height='370px' frameborder=0 scrolling=no style='border:1px solid #666;'></iframe>"
			target.html(iframe_html);
			// jQuery.get($(this).attr("href"), function(data) {
			//   target.html(data);
			// });
		}

		e.preventDefault();
	});
});

function submitCantDecide(form) {
	var VOTE_CAST_AT = new Date();
	var reason = $('input[name=cant_decide_reason]:checked').val();

	if (reasonValid(reason)) {
		$('a.vote').addClass('loading');
		$('#cant_decide_options').dialog('close');

		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
		  url: form.attr('action'),
		  data: {
				cant_decide_reason: reason,
				prompt_id: $('#prompt_id').val(),
		    appearance_lookup: $('#appearance_lookup').val(),
				time_viewed: VOTE_CAST_AT - PAGE_LOADED_AT,
				authenticity_token: encodeURIComponent(AUTH_TOKEN),
				locale: RAILS_LOCALE
		  },
		  timeout: 10000,
		  error: function(request, textStatus, errorThrown) {
				voteError(request, textStatus, errorThrown);
			},
		  success: function(data, textStatus, request) {
				loadNextPrompt(data);
				PAGE_LOADED_AT = new Date(); // reset the page load time
			}
		});
	}
}

function submitFlag(form) {
	var VOTE_CAST_AT = new Date();
	var reason = jQuery.trim($('#inappropriate_reason').val());
	$('#inappropriate_reason').val('');

 	if(!reason){
  	alert("Please include an explanation");
    return false;
 	} else {
		$('a.vote').addClass('loading');
		$('#flag_as_inappropriate').dialog('close');

		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
		  url: form.attr('action'),
		  data: {
				flag_reason: reason,
				side: $('#inappropriate_side').val(),
				prompt_id: $('#prompt_id').val(),
		    appearance_lookup: $('#appearance_lookup').val(),
				time_viewed: VOTE_CAST_AT - PAGE_LOADED_AT,
				authenticity_token: encodeURIComponent(AUTH_TOKEN),
				locale: RAILS_LOCALE
		  },
		  timeout: 10000,
		  error: function(request, textStatus, errorThrown) {
				voteError(request, textStatus, errorThrown);
			},
		  success: function(data, textStatus, request) {
				loadNextPrompt(data);
				PAGE_LOADED_AT = new Date(); // reset the page load time
			}
		});
	}
}

function reasonValid(reason) {
	if (!reason) {
	  alert("Please select a reason");
	  return false;
	} else {
		if(reason == 'user_other'){
			user_text = jQuery.trim($('input[name=reason_text]').val());
	   	if(!user_text){
	    	alert("Please include an explanation");
	      return false;
	   	}
		}
		return true;
	}
}

function castVote(choice) {
	var VOTE_CAST_AT = new Date();

	jQuery.ajax({
		type: 'POST',
		dataType: 'json',
	  url: choice.attr('href'),
	  data: {
	  	authenticity_token: encodeURIComponent(AUTH_TOKEN),
			time_viewed: VOTE_CAST_AT - PAGE_LOADED_AT,
	    appearance_lookup: $('#appearance_lookup').val(),
			locale: RAILS_LOCALE
	  },
	  timeout: 10000,
	  error: function(request, textStatus, errorThrown) {
			voteError(request, textStatus, errorThrown);
		},
	  success: function(data, textStatus, request) {
			updateVotingHistory(data);
			loadNextPrompt(data);
			PAGE_LOADED_AT = new Date(); // reset the page load time
		}
	});
}

function updateVotingHistory(data) {
	var winner = data['voted_prompt_winner']
	//$('#visitor_votes').text(data['visitor_votes']);
	$('#your_votes').prepend("\
		<li>\
			<img src='" + $('.left').attr('thumb') + "' class='" + (winner == 'left' ? 'winner' : 'loser') + "'/>\
			<img src='" + $('.right').attr('thumb') + "' class='" + (winner == 'right' ? 'winner' : 'loser') + "'/>\
			<abbr class='timeago' title='" + data['voted_at'] + "'>" + data['voted_at'] + "</abbr>\
		</li>\
		");
	$('#your_votes').children(":first").effect("highlight", {}, 3000);
	$("abbr.timeago").timeago();
}


function loadNextPrompt(data) {
	// remove spinner and checkmark
	$('a.vote').removeClass('loading chosen');
	
	jQuery.each(['left', 'right'], function(index, side) {
		// change photos
		$('a.vote.' + side).css('background', "#fff url('" + data['new' + side + '_photo'] + "') center center no-repeat");
		// change photo thumb
		$('a.vote.' + side).attr('thumb', data['new' + side + '_photo_thumb']);
		// change href url
		$('a.vote.' + side).attr('href', data['new' + side + '_url']);
	});

	// change appearance_lookup and prompt_id hidden fields
	$('#appearance_lookup').val(data['appearance_lookup']);
	$('#prompt_id').val(data['prompt_id']);

	// change urls for inappropriate and skip forms
	$('#flag_as_inappropriate_form').attr('action', data['flag_url']);
	$('#cant_decide_form').attr('action', data['skip_url']);
}

function voteError(request, textStatus, errorThrown) {
	alert(textStatus);
}
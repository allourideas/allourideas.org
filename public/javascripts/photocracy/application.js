$(document).ready(function() {
  $('a.vote').live('click', function(e) {
		if ($(this).hasClass('loading')) {
			alert("One sec, we're loading the next pair...");
		} else {
			$('a.vote').addClass('loading');
			$(this).addClass('chosen');
			castVote($(this));
		}
		e.preventDefault();
  });
});

function castVote(choice) {
	var VOTE_CAST_AT = new Date();

	$.ajax({
		type: 'POST',
		dataType: 'json',
	  url: choice.attr('href'),
	  data: {
	  	authenticity_token: encodeURIComponent(AUTH_TOKEN),
			time_viewed: VOTE_CAST_AT - PAGE_LOADED_AT,
	    appearance_lookup: $('#appearance_lookup').val()
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
	$('#visitor_votes').text(data['visitor_votes']);
	// todo
	// add the last prompt to the voting history
}

function loadNextPrompt(data) {
	$.ajax({
		type: 'GET',
		dataType: 'html',
	  url: data['show_prompt_path'],
	  data: {
			authenticity_token: encodeURIComponent(AUTH_TOKEN),
	    right_choice_text:  data['right_choice_text'],
			left_choice_text:   data['left_choice_text'],
			right_choice_id:    data['right_choice_id'],
			left_choice_id:     data['left_choice_id'],
			question_id:        data['question_id'],
			prompt_id:          data['prompt_id']
	  },
	  success: function(html) {
			$('#prompt').html(html);
			$('#appearance_lookup').val(data['appearance_lookup']);
		}
	});
}

function voteError(request, textStatus, errorThrown) {
	alert(textStatus);
}
$(document).ready(function() {
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
	// remove spinner and checkmark
	$('a.vote').removeClass('loading');
	$('a.vote').removeClass('chosen');

	// change photos
	$('a.vote.left').css('background', "url('" + data['newleft_photo'] + "') center center no-repeat");
	$('a.vote.right').css('background', "url('" + data['newright_photo'] + "') center center no-repeat");

	// change href urls
	$('a.vote.left').attr('href', data['newleft_url']);
	$('a.vote.right').attr('href', data['newright_url']);
}

function voteError(request, textStatus, errorThrown) {
	alert(textStatus);
}
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

	jQuery.ajax({
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
		// change photo
		$('a.vote.' + side).css('background', "#fff url('" + data['new' + side + '_photo'] + "') center center no-repeat");

		// change photo thumb
		$('a.vote.' + side).attr('thumb', data['new' + side + '_photo_thumb']);

		// change href url
		$('a.vote.' + side).attr('href', data['new' + side + '_url']);
	});
}

function voteError(request, textStatus, errorThrown) {
	alert(textStatus);
}


// adding a photo

$(document).ready(function() {
	$('#add_photo_form').live('submit', function (e) {
	    $(this).addPhoto();
	    (this).preventDefault();
	});
});
function addPhoto() {
	jQuery.ajax({
		type: 'POST',
		dataType: 'json',
	  url: this.attr('action'),
	  data: {
	  	authenticity_token: encodeURIComponent(AUTH_TOKEN),
			locale: LOCALE,
			new_photo: $('#add_photo_field').val()
	  },
	  timeout: 10000,
	  error: function(request, textStatus, errorThrown) {
		},
	  success: function(data, textStatus, request) {
		}
	});
}
// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults



jQuery(document).ready(function() {
	
	humanMsg.setup();
	$("#tabs").tabs();
	
	
	$('.new_idea_submit').bind('click',function(event){
		var question_id = $(this).attr("rel");
		var new_idea = $('#new_idea_field').val();
		$.post('/questions/' + question_id + '/add_idea.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN)+'&new_idea='+new_idea,
		function(data){
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);
			//humanMsg.displayMsg(data["message"]);
			$('.prompter').effect("highlight", {}, 1500);

			
		},
		"json"
		);
		return false;
	});
	
	$('.skiplink').bind('click',function(event){
		var question_id = $(this).attr("rel");
		$.post('/questions/' + question_id + '/skip.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);
			//humanMsg.displayMsg('<strong>Skipped.</strong> <span class="indent">You just skipped the last prompt.</span>');
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});
	
	$('input[title!=""]').hint();
	$('textarea[title!=""]').hint();
	
	
	$('.vote_left').bind('click',function(event){
		var question_id = $(this).attr("rel");
		var winner = $('a#leftside').html();
		var loser = $('a#rightside').html();
		$.post('/questions/' + question_id + '/vote_left.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),//+'&winner='+winner+'&loser='+loser,
		function(data){

			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);

			$('.tellmearea').html("You chose " + winner + " over " + loser);
			//.effect("highlight", {}, 1500);
			//humanMsg.displayMsg('<strong>Voted.</strong> <span class="indent">You have successfully voted.</span>');
			//$('.prompter').effect("highlight", {}, 1500);
		},
		"json"
		);
		return false;
	});

	$('.vote_right').bind('click',function(event){
		var question_id = $(this).attr("rel");
		var loser = $('a#leftside').html();
		var winner = $('a#rightside').html();
		$.post('/questions/' + question_id + '/vote_right.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);
			$('.tellmearea').html("You chose " + winner + " over " + loser).effect("highlight", {}, 1500);
			//humanMsg.displayMsg('<strong>Voted.</strong> <span class="indent">You have successfully voted.</span>');
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});

});

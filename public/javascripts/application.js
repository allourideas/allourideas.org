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
			$('.leftside').effect("highlight", {}, 1500).html(data["newleft"]);
			$('.rightside').effect("highlight", {}, 1500).html(data["newright"]);
			humanMsg.displayMsg(data["message"]);
			//$('a.prompt').html('Click here!');
			$('.prompter').effect("highlight", {}, 1500);
			//alert('Bueller?');
			
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
			$('.leftside').effect("highlight", {}, 1500).html(data["newleft"]);
			$('.rightside').effect("highlight", {}, 1500).html(data["newright"]);
			humanMsg.displayMsg('<strong>Skipped.</strong> <span class="indent">You just skipped the last prompt.</span>');
			//$('a.prompt').html('Click here!');
			$('.prompter').effect("highlight", {}, 1500);
			//alert('Bueller?');
			
		},
		"json"
		);
		return false;
	});
	
	
	$('.vote_left').bind('click',function(event){
		var question_id = $(this).attr("rel");
		$.post('/questions/' + question_id + '/vote_left.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.leftside').effect("highlight", {}, 1500).html(data["newleft"]);
			$('.rightside').effect("highlight", {}, 1500).html(data["newright"]);
			humanMsg.displayMsg('<strong>Voted.</strong> <span class="indent">You have succesfully voted.</span>');
			//$('a.prompt').html('Click here!');
			$('.prompter').effect("highlight", {}, 1500);
			//alert('Bueller?');
			
		},
		"json"
		);
		return false;
	});

	$('.vote_left').bind('click',function(event){
		var question_id = $(this).attr("rel");
		$.post('/questions/' + question_id + '/vote_left.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.leftside').effect("highlight", {}, 1500).html(data["newleft"]);
			$('.rightside').effect("highlight", {}, 1500).html(data["newright"]);
			humanMsg.displayMsg('<strong>Voted.</strong> <span class="indent">You have succesfully voted.</span>');
			//$('a.prompt').html('Click here!');
			$('.prompter').effect("highlight", {}, 1500);
			//alert('Bueller?');
			
		},
		"json"
		);
		return false;
	});

	jQuery('a.showmessage:last').click(function() {
		humanMsg.displayMsg('"Your <strong>Earth</strong> will be reduced to a burned-out cinder."');
		return false;
	})
});

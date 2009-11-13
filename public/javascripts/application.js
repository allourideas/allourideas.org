// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults



jQuery(document).ready(function() {
	
	// [$("#logo-citp"), $("#logo-princeton"), $("#logo-open"), $("#logo-check")]).each(function(el) {
	//     $(this).bind("mouseover", function() {
	//       var str = $(this).attr("src");
	//       $(this).attr('src', str.replace(".jpg", "-down.jpg"));
	//     });
	//     $(this).bind("mouseout", function() {
	//       var str = $(this).attr("src");
	//       $(this).attr('src', str.replace("-down.jpg", ".jpg"));
	//     });
	//   });
  $(".votebox tr.prompt td.idea").each(function(el) {
    $(this).bind("click", function() {
      $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
        // $(this).css("background", "#0B0");
        // $(this).css("border-left", "1px solid #0B0");
        // $(this).css("border-right", "1px solid #0B0");
      });
      $(this).unbind("mouseover")
      $(this).unbind("mouseout")
    });
    $(this).bind("mouseover", function() {
      $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
        $(this).css("background", "#2b88ad");
        $(this).css("border-left", "1px solid #2b88ad");
        $(this).css("border-right", "1px solid #2b88ad");
      });
    });
    $(this).bind("mouseout", function() {
      $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
        $(this).css("background", "#3198c1");
        $(this).css("border-left", "1px solid #3198c1");
        $(this).css("border-right", "1px solid #3198c1");
      });
    });})
  
	
	humanMsg.setup();
	$("#tabs").tabs();
	
	
	$('.new_idea_submit').bind('click',function(event){
		$('.indicator').show();
		var question_id = $(this).attr("rel");
		var new_idea = $('#new_idea_field').val();
		$('#new_idea_field').empty().val('').hint();
		$.post('/questions/' + question_id + '/add_idea.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN)+'&new_idea='+new_idea,
		function(data){
			$('.tellmearea').html(data["message"]);
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);
			//humanMsg.displayMsg(data["message"]);
			$('.prompter').effect("highlight", {}, 1500);

			$('.indicator').hide();
		},
		"json"
		);
		return false;
	});
	
	$('.skiplink').bind('click',function(event){
		$('.indicator').show();
		var question_id = $(this).attr("rel");
		$.post('/questions/' + question_id + '/skip.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
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
				$(".votebox tr.prompt td.idea").each(function(el) {
			    $(this).css("background", "#3198c1");
					$(this).css("border-left", "1px solid #3198c1");
		      $(this).css("border-right", "1px solid #3198c1");
		});
		
		$('.tellmearea').html('');
		$('.indicator').show();
		var question_id = $(this).attr("rel");
		var winner = $('a#leftside').html();
		var loser = $('a#rightside').html();
		$.post('/questions/' + question_id + '/vote_left.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),//+'&winner='+winner+'&loser='+loser,
		function(data){
			$('.indicator').hide();
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);

			$('.tellmearea').html("You chose " + winner + " over " + loser).effect("highlight", {}, 1500);;

		},
		"json"
		);
		return false;
	});

	$('.vote_right').bind('click',function(event){
		
				$(".votebox tr.prompt td.idea").each(function(el) {
			    $(this).css("background", "#3198c1");
					$(this).css("border-left", "1px solid #3198c1");
		      $(this).css("border-right", "1px solid #3198c1");
		});
		
		$('.tellmearea').html('');
		$('.indicator').show();
		var question_id = $(this).attr("rel");
		var loser = $('a#leftside').html();
		var winner = $('a#rightside').html();
		$.post('/questions/' + question_id + '/vote_right.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);
			$('.tellmearea').html("You chose " + winner + " over " + loser).effect("highlight", {}, 1500);

			
		},
		"json"
		);
		return false;
	});

});

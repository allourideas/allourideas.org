// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function validate_idea_form() //mark for deletion
{
	var errors = [];
	var name = $('#question_name').val();
	var url = $('#question_url').val();
	var new_ideas = $('#question_question_ideas').val();
	alert(new_ideas);
	if ((new_ideas == "Add your own ideas here...&#x000A;&#x000A;For example:&#x000A;More hammocks on campus&#x000A;Improve student advising&#x000A;More outdoor tables and benches&#x000A;Video game tournaments&#x000A;Start late dinner at 8PM&#x000A;Lower textbook prices&#x000A;Bring back parking for sophomores") || (new_ideas == '')) {
		event.returnValue = false;
		errors[errors.length] = 'Blank ideas are not allowed.';
	}
	if ((name == 'Add your own idea here...') || (name == '')) {
		event.returnValue = false;
		errors[errors.length] = 'Blank question names are not allowed.';
	}
	
	if ((url == 'Add your own idea here...') || (url == '')) {
		event.returnValue = false;
		errors[errors.length] = 'Blank question urls are not allowed.';
	}
	return errors;
}

function sleep(ms)
{
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}

function increment(number)
{
	return parseInt(number) + 1;
}
function iframe_loaded(){
	   $('#voter_map_indicator').hide();
}



jQuery(document).ready(function() {
	
	var loadedTime = new Date();
	//$('label').labelOver('over-apply');
	
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
	// $('#question_create_button').click(function () { 
	//       //$(this).slideUp(); 
	// 			validate_idea_form();
	// 			alert('k');
	// 			return false;
	//     });
	// 
    // $("new_question_form").submit(function(e) {
    // 	
    // 	
    //     if (e.originalEvent.explicitOriginalTarget.id == "question_create_button") {
    // 						var the_status = validate_idea_form();
    //         if (the_status)
    // 								alert('the status is ' + validate_idea_form());
    //             return false;
    //             //If the status above is false continue to prompt the user if they want to submit or not
    //         var ok = confirm('Do you really want to save your data?');
    //         if (ok) {               
    //             return true;
    //         }
    //         else {
    //             //Prevent the submit event and remain on the screen
    //             e.preventDefault();
    //             return false;
    //         }
    //     }
    // });
	
  $(".votebox tr.prompt td.idea").each(function(el) {
    $(this).bind("click", function() {
      $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
        $(this).css("background", "#0B0");
        $(this).css("border-left", "1px solid #0B0");
        $(this).css("border-right", "1px solid #0B0");

				//setTimeout("alert ('called from setTimeout()');",4000)
//				sleep(1000);

        // $(this).css("background", "#3198c1");
        // $(this).css("border-left", "1px solid #3198c1");
        // $(this).css("border-right", "1px solid #3198c1");
      });
      // $(this).unbind("mouseover")
      // $(this).unbind("mouseout")
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
  

	 // $("#item").bind("click", function() {
	 //    if ($(this).attr("value") == $("#default_text").attr("value"))
	 //      $(this).attr("value", "");
	 //  });
	 //  $("#item").bind("keyup", function() {
	 //    var value = $(this).attr("value");
	 //    var len = $(this).attr("maxlength");
	 //    if (value.length > len) {
	 //      $(this).attr("value", value.substr(0, len));
	 //      $("#length_error").show();
	 //      setTimeout(function() { $("#length_error").fadeOut(1000); }, 3000);
	 //    }
	 //  });
	  $("#submit_btn").bind("mouseover", function() {
	    var str = $(this).attr("src");
	    $(this).attr('src', str.replace(".jpg", "-down.jpg"));
	  });
	  $("#submit_btn").bind("mouseout", function() {
	    var str = $(this).attr("src");
	    $(this).attr('src', str.replace("-down.jpg", ".jpg"));
	  });

	  // $("#submit_btn").bind("mousedown", function() {
	  //   var str = $(this).attr("src");
	  //   if (str.indexOf("-over") == -1)
	  //     $(this).attr('src', str.replace(".jpg", "-down.jpg"));
	  //   else if(str.indexOf("-down") == -1)
	  //     $(this).attr('src', str.replace("-over.jpg", "-down.jpg"));
	  // });


	humanMsg.setup();
	$("#tabs").tabs();
	
	humane_message_to_be_displayed = $('.to_be_humanized').text()
	
	if (humane_message_to_be_displayed) {
		humanMsg.displayMsg(humane_message_to_be_displayed);
	}
	
	
	$('.new_idea_submit').bind('click',function(event){		
		var new_idea = $('#new_idea_field').val();
		var default_text = $('#default_text').val()
		$('.example_notice').hide();
		
		//if new idea is blank or longer than 140 characters, do not allow it to submit
		if ((new_idea == 'Add your own idea here...') || (new_idea == '') || new_idea == default_text) {
			event.returnValue = false;
			alert('Sorry, blank ideas are not allowed.');
			return false;
		}
		if (new_idea.length > 140) {
			alert('Sorry, ideas need to be less than 140 characters.');
			event.returnValue = false;
			return false;
		}
		
		var str = $(this).attr("src");
    if (str.indexOf("-over") == -1)
      $(this).attr('src', str.replace(".jpg", "-down.jpg"));
    else if(str.indexOf("-down") == -1)
      $(this).attr('src', str.replace("-over.jpg", "-down.jpg"));
		
		$.setFragment({ "page" : $.queryString(this.href).page });
		
		$('.indicator').show();
		$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:         0.0,
		cursor:    null
		    }});
		var question_id = $(this).attr("rel");
		
		//$('#new_idea_field').empty().val('').hint();
		$.post('/questions/' + question_id + '/add_idea.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN)+'&new_idea='+new_idea,
		function(data){
			$('.tellmearea').html(data["message"]);
			$('#new_idea_field').val("");
			$('#new_idea_field').attr('title','Thank you. Your idea has been added. Please add some more ideas.');
			$('#new_idea_field').unbind('focus').unbind('blur');
			$('#new_idea_field').hint();
			// $('.leftside').html(data["newleft"]);
			// $('.rightside').html(data["newright"]);
			
			//humanMsg.displayMsg(data["message"]);
			//$('.prompter').effect("highlight", {}, 1500);
			//increment counter if the new idea is active
			
			
			
			
			// var max = $(this).attr('maxlength');
			//     var val = $(this).attr('value');
			//     var cur = 0;
			//     if(val) // value="", or no value at all will cause an error
			//       cur = val.length;
			//     var left = max-cur;
			//     $(this).after("<div class='counter'>"
			//       + left.toString()+"</div>");
			//     // You can use something like this to align the
			//     // counter to the right of the input field.
			//     var c = $(this).next(".counter");
			// 
			// 
			// 
			
			if (data['choice_status'] == 'active') {
				current_item_count = $('#item_count').html();
				$('#item_count').html(increment(current_item_count)).effect("highlight", {}, 1500);
			}
			
			$('.indicator').hide();
			$.unblockUI();
			
			var str = $("#submit_btn").attr("src");
			$("#submit_btn").attr('src', str.replace("-down.jpg", ".jpg"));
			
			
		},
		"json"
		);
		return false;
	});
	
	$('.skiplink').bind('click',function(event){
		$('.example_notice').hide();
		$.setFragment({ "page" : $.queryString(this.href).page });
		$('.indicator').show();
		$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:         0.0,
		cursor:    null
		    }});
		var question_id = $(this).attr("rel");
		$.post('/questions/' + question_id + '/skip.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			$('.leftside').html(data["newleft"]);
			$('.rightside').html(data["newright"]);
			//humanMsg.displayMsg('<strong>Skipped.</strong> <span class="indent">You just skipped the last prompt.</span>');
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});
	
	$('.toggle_question_status').bind('change',function(event){
		$('.indicator').show();
		$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:   0.0,
						cursor:    null
		    }});
		var earl_id = $(this).attr("rel");
		$.post('/questions/' + earl_id + '/toggle.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});
	
	$('.toggle_choice_status').bind('click',function(event){
		$('.indicator').show();
		$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:         0.0,
		cursor:    null
		    }});
		var choice_id = $(this).attr("rel");
		var earl_id = $(this).attr("earl_id");
		$.post('/questions/' + earl_id + '/choices/' + choice_id + '/toggle.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			humanMsg.displayMsg(data['message']);
			if(data['error']) {
				//no-op
			}
			else {
			$('#choice_'+choice_id+'_status').text(data['verb']).effect("highlight", {}, 1500);
		}
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});
	
	
	$('.toggle_autoactivate_status').bind('click',function(event){
		$('.indicator').show();
		$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:         0.0,
		cursor:    null
		    }});
		var question_id = $(this).attr("question_id");
		$.post('/questions/' + question_id + '/toggle_autoactivate.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			humanMsg.displayMsg(data['message']);
			if(data['error']) {
				//no-op
			}
			else {
			$('#question_'+question_id+'_autoactivate_status').text(data['verb']).effect("highlight", {}, 1500);
		}
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});
	
	$('input[title!=""]').hint();
	$('textarea[title!=""]').hint();
	
	

	$('.vote_cell').bind('click',function(event){

		$('.example_notice').hide();

		var the_id = $(this).attr("id");

		var winner_side = (the_id == "left_choice_cell") ? "left" : "right";
		var loser_side = (the_id == "left_choice_cell") ? "right" : "left";

		var question_id = $(this).attr("rel");

		var loser_link = $('a#' + loser_side + 'side')
		var winner_link = $('a#' + winner_side + 'side')

		var loser = "<a href='/questions/" + loser_link.attr("question_slug") + "/choices/" + loser_link.attr("choice_id") + "'>" + loser_link.html() + "</a>";
		var winner = "<a href='/questions/" + winner_link.attr("question_slug") + "/choices/" + winner_link.attr("choice_id") + "'>" + winner_link.html() + "</a>";	
		
		$.ajax({
		 type: "post",
		 url: '/questions/' + question_id + '/vote_' + winner_side+ '.js',
		 dataType: "json",
		 data: {
			'authenticity_token' : encodeURIComponent(AUTH_TOKEN)
		 },
		 beforeSend: function() {
			$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
			        backgroundColor: '#000', 
			        opacity:         0.0,
			cursor:    null
			    }});
			
		  $('.tellmearea').html('');
			$('.indicator').show();
		 },
		 timeout: 5000,
		 error: function(request,error) {
			$('.indicator').hide();
			$.unblockUI();
		  if (error == "timeout") {
			$('.tellmearea').html('Sorry, voting is taking too long ... too much traffic!').effect("highlight", {color: '#ff0000'}, 1500);
		  }
		  else {
				$('.tellmearea').html("Sorry, your vote wasn't counted ... there was an error").effect("highlight", {color: '#ff0000'}, 1500);
		  }
		  },
		  success:  function(data){
				$('.indicator').hide();
				$('.leftside').html(data["newleft"]);
				$('.rightside').html(data["newright"]);
				$('.tellmearea').html("You chose " + winner + " over " + loser).effect("highlight", {}, 1500);
				current_vote_count = $('#votes_count').html();
				$('#votes_count').html(increment(current_vote_count)).effect("highlight", {}, 1500);
				$.unblockUI();
				$(".votebox tr.prompt td.idea").each(function(el) {
			      $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
			        $(this).css("background", "#3198c1");
			        $(this).css("border-left", "1px solid #3198c1");
			        $(this).css("border-right", "1px solid #3198c1");
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
					    });
				    });
				});
			}// End success
		}); // End ajax method
		return false;
	});
	
/*
	$('#view_voter_map').bind('click',function(event){		
			event.preventDefault();
			event.stopPropagation();

			var link= $('#view_voter_map');
			var target = link.attr('iframe_url');

			var voter_map_row = $('#voter_map_row')
			
			var theText = (link.text() == "[View]") ? "[Close]" : "[View]";
			link.text(theText);

			if(voter_map_row.length>0)
			{
			   if($('#voter_map_row:hidden').length>0){
			       $('#voter_map_row:hidden').show()
			   }
			   else{
			       $('#voter_map_row').hide();
			   }

			}
				
			else{
			  var iframe_html= "<tr id=voter_map_row class='row1' style='display:none'><td class='title' colspan='2' style='text-align:center'><iframe src='" + target + "' width='722px' height='380px'frameborder=0 scrolling=no style='border:1px solid rgb(145,145,145);'></iframe></td></tr>";
			  $('#view_voter_map_row').after(iframe_html);
			
			  $('#voter_map_row:hidden').show();

			}


			});
	*/

        $('#view_voter_map').click(function(event){
			event.preventDefault();
			event.stopPropagation();
			
			var target_row = $(this).parent().parent().next();
			if(!toggleLinkTextandTargetElement($(this), target_row))
			{
			        var iframe_html= "<tr id=voter_map_row class='row1'><td class='title' colspan='2' height=370px><div id='voter_map_indicator'><img src='/images/indicator.gif' /></div><iframe id='voter_map_iframe' src='" + $(this).attr('href') + "' onload='iframe_loaded();' width='746px' height='370px' frameborder=0 scrolling=no style='border:1px solid rgb(145,145,145);'></iframe></td></tr>"
				$('#view_voter_map_row').after(iframe_html);
//				$('#view_voter_map_row').after("<tr id=voter_map_row class='row1'><td class='title' height=360px colspan='2' style='text-align:center'><div id='geo_map_canvas'><img src=/images/indicator.gif /></div></td></tr>")
//				$.get($(this).attr("href")+".js", null, null, "script");
				$(this).attr('isLoaded', true);
			}
	});
	
	function toggleLinkTextandTargetElement(link, target){
			var theText = (link.text() == "[View]") ? "[Close]" : "[View]";
			link.text(theText);

			var loaded = link.attr('isLoaded');
			if(loaded)
			{
				if(theText == "[View]"){
				  target.hide();
				}
				else{
				  target.show();
				}
				return true;

			}
			else{
				//this hasn't been initialized, punt
				return false;
			}
	}

        $('.date-chart').click(function(event){
			event.preventDefault();
			event.stopPropagation();
			
			var target_row = $(this).parent().parent().next();
			var target_div = $(this).parent().parent().next().find('div')
			if(!toggleLinkTextandTargetElement($(this), target_row))
			{
				target_row.show();
				target_div.html('<img src=/images/indicator.gif />')
				$.get($(this).attr("href"), null, null, "script");
				$(this).attr('isLoaded', true);
				
			}
	});
		




});


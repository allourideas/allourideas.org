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
	   $('.voter_map_indicator').hide();
}


jQuery(document).ready(function() {
	
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
	    $(this).attr('src', str.replace("submit.jpg", "submit-down.jpg"));
	  });
	  $("#submit_btn").bind("mouseout", function() {
	    var str = $(this).attr("src");
	    $(this).attr('src', str.replace("submit-down.jpg", "submit.jpg"));
	  });

	  // $("#submit_btn").bind("mousedown", function() {
	  //   var str = $(this).attr("src");
	  //   if (str.indexOf("-over") == -1)
	  //     $(this).attr('src', str.replace(".jpg", "-down.jpg"));
	  //   else if(str.indexOf("-down") == -1)
	  //     $(this).attr('src', str.replace("-over.jpg", "-down.jpg"));
	  // });

	
   $('.toggle_question_status, .toggle_choice_status, .toggle_autoactivate_status').each(function(el) {
      var status = $(this).attr("status");
      if (status == "true") {
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
		}
		else if (status == "false") {
      $(this).bind("mouseover", function() {
         $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
            $(this).css("background", "#b1b1b1");
            $(this).css("border-left", "1px solid #b1b1b1");
            $(this).css("border-right", "1px solid #b1b1b1");
          });
       });
       $(this).bind("mouseout", function() {
         $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
            $(this).css("background", "#cccccc");
            $(this).css("border-left", "1px solid #cccccc");
            $(this).css("border-right", "1px solid #cccccc");
         });
		 });
		}
	});
	

	
	$('.toggle_question_status').bind('click',function(event){
		$('.indicator').show();
		$.blockUI({ message: null, fadeIn: 0, fadeOut:  0, overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:   0.0,
						cursor:    null
		    }});
		var earl_id = $(this).attr("rel");
		var state = $(this).attr("status");
		$.post('/questions/' + earl_id + '/toggle.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			
			if(data['error']) { 
			}
			else {
            if (data['verb'] == "Activated") {
               $([$("#question_"+earl_id+"_status .toggle_question_status").children(".round-filled-greyfg"), $("#question_"+earl_id+"_status .toggle_question_status").children(".round-filled-grey").children()]).each(function(el) {
                     $(this).removeAttr("style")
               });
               $("#question_"+earl_id+"_status .toggle_question_status").attr("status", "true");
               $("#question_"+earl_id+"_status .round-filled-greyfg").addClass("round-filledfg").removeClass("round-filled-greyfg");
               $("#question_"+earl_id+"_status .round-filled-grey-top").addClass("round-filled-top").removeClass("round-filled-grey-top");
               $("#question_"+earl_id+"_status .round-filled-grey-bottom").addClass("round-filled-bottom").removeClass("round-filled-grey-bottom");
               $("#question_"+earl_id+"_status .round-filled-grey").addClass("round-filled").removeClass("round-filled-grey");
               $("#question_"+earl_id+"_status .round-filled-grey2").addClass("round-filled2").removeClass("round-filled-grey2");
               $("#question_"+earl_id+"_status .round-filled-grey3").addClass("round-filled3").removeClass("round-filled-grey3");
               $("#question_"+earl_id+"_status .round-filled-grey4").addClass("round-filled4").removeClass("round-filled-grey4");
               $("#question_"+earl_id+"_status .round-filled-grey5").addClass("round-filled5").removeClass("round-filled-grey5");
               $("#question_"+earl_id+"_status .toggle_question_status").bind("mouseover", function() {
                  $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
                     $(this).css("background", "#2b88ad");
                     $(this).css("border-left", "1px solid #2b88ad");
                     $(this).css("border-right", "1px solid #2b88ad");
                   });
               });
               $("#question_"+earl_id+"_status .toggle_question_status").bind("mouseout", function() {
                  $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
                     $(this).css("background", "#3198c1");
                     $(this).css("border-left", "1px solid #3198c1");
                     $(this).css("border-right", "1px solid #3198c1");
                  });
               });
            }
            else if (data['verb'] == "Deactivated") {
               $([$("#question_"+earl_id+"_status .toggle_question_status").children(".round-filledfg"), $("#question_"+earl_id+"_status .toggle_question_status").children(".round-filled").children()]).each(function(el) {
                     $(this).removeAttr("style")
               });
               $("#question_"+earl_id+"_status .toggle_question_status").attr("status", "false");
               $("#question_"+earl_id+"_status .round-filledfg").addClass("round-filled-greyfg").removeClass("round-filledfg");
               $("#question_"+earl_id+"_status .round-filled .round-filled-top").addClass("round-filled-grey-top").removeClass("round-filled-top");
               $("#question_"+earl_id+"_status .round-filled .round-filled-bottom").addClass("round-filled-grey-bottom").removeClass("round-filled-bottom");
               $("#question_"+earl_id+"_status .round-filled").addClass("round-filled-grey").removeClass("round-filled");
               $("#question_"+earl_id+"_status .round-filled2").addClass("round-filled-grey2").removeClass("round-filled2");
               $("#question_"+earl_id+"_status .round-filled3").addClass("round-filled-grey3").removeClass("round-filled3");
               $("#question_"+earl_id+"_status .round-filled4").addClass("round-filled-grey4").removeClass("round-filled4");
               $("#question_"+earl_id+"_status .round-filled5").addClass("round-filled-grey5").removeClass("round-filled5");
               $("#question_"+earl_id+"_status .toggle_question_status").bind("mouseover", function() {
                  $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
                     $(this).css("background", "#b1b1b1");
                     $(this).css("border-left", "1px solid #b1b1b1");
                     $(this).css("border-right", "1px solid #b1b1b1");
                   });
               });
               $("#question_"+earl_id+"_status .toggle_question_status").bind("mouseout", function() {
                  $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
                     $(this).css("background", "#cccccc");
                     $(this).css("border-left", "1px solid #cccccc");
                     $(this).css("border-right", "1px solid #cccccc");
                  });
               });
            }
            if (state == "true")
			      $('#question_'+earl_id+'_toggle .round-filled-greyfg').text(data['verb']);
			   else
			      $('#question_'+earl_id+'_toggle .round-filledfg').text(data['verb']);
			}
			
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
		var state = $(this).attr("status");
		$.post('/questions/' + earl_id + '/choices/' + choice_id + '/toggle.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			//humanMsg.displayMsg(data['message']);
			if(data['error']) { 
			}
			else {
            if (data['verb'] == "Activated") {
               $([$("#choice_"+choice_id+"_status .toggle_choice_status").children(".round-filled-greyfg"), $("#choice_"+choice_id+"_status .toggle_choice_status").children(".round-filled-grey").children()]).each(function(el) {
                     $(this).removeAttr("style")
               });
               $("#choice_"+choice_id+"_status .toggle_choice_status").attr("status", "true");
               $("#choice_"+choice_id+"_status .round-filled-greyfg").addClass("round-filledfg").removeClass("round-filled-greyfg");
               $("#choice_"+choice_id+"_status .round-filled-grey-top").addClass("round-filled-top").removeClass("round-filled-grey-top");
               $("#choice_"+choice_id+"_status .round-filled-grey-bottom").addClass("round-filled-bottom").removeClass("round-filled-grey-bottom");
               $("#choice_"+choice_id+"_status .round-filled-grey").addClass("round-filled").removeClass("round-filled-grey");
               $("#choice_"+choice_id+"_status .round-filled-grey2").addClass("round-filled2").removeClass("round-filled-grey2");
               $("#choice_"+choice_id+"_status .round-filled-grey3").addClass("round-filled3").removeClass("round-filled-grey3");
               $("#choice_"+choice_id+"_status .round-filled-grey4").addClass("round-filled4").removeClass("round-filled-grey4");
               $("#choice_"+choice_id+"_status .round-filled-grey5").addClass("round-filled5").removeClass("round-filled-grey5");
               $("#choice_"+choice_id+"_status .toggle_choice_status").bind("mouseover", function() {
                  $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
                     $(this).css("background", "#2b88ad");
                     $(this).css("border-left", "1px solid #2b88ad");
                     $(this).css("border-right", "1px solid #2b88ad");
                   });
               });
               $("#choice_"+choice_id+"_status .toggle_choice_status").bind("mouseout", function() {
                  $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
                     $(this).css("background", "#3198c1");
                     $(this).css("border-left", "1px solid #3198c1");
                     $(this).css("border-right", "1px solid #3198c1");
                  });
               });
            }
            else if (data['verb'] == "Deactivated") {
               $([$("#choice_"+choice_id+"_status .toggle_choice_status").children(".round-filledfg"), $("#choice_"+choice_id+"_status .toggle_choice_status").children(".round-filled").children()]).each(function(el) {
                     $(this).removeAttr("style")
               });
               $("#choice_"+choice_id+"_status .toggle_choice_status").attr("status", "false");
               $("#choice_"+choice_id+"_status .round-filledfg").addClass("round-filled-greyfg").removeClass("round-filledfg");
               $("#choice_"+choice_id+"_status .round-filled .round-filled-top").addClass("round-filled-grey-top").removeClass("round-filled-top");
               $("#choice_"+choice_id+"_status .round-filled .round-filled-bottom").addClass("round-filled-grey-bottom").removeClass("round-filled-bottom");
               $("#choice_"+choice_id+"_status .round-filled").addClass("round-filled-grey").removeClass("round-filled");
               $("#choice_"+choice_id+"_status .round-filled2").addClass("round-filled-grey2").removeClass("round-filled2");
               $("#choice_"+choice_id+"_status .round-filled3").addClass("round-filled-grey3").removeClass("round-filled3");
               $("#choice_"+choice_id+"_status .round-filled4").addClass("round-filled-grey4").removeClass("round-filled4");
               $("#choice_"+choice_id+"_status .round-filled5").addClass("round-filled-grey5").removeClass("round-filled5");
               $("#choice_"+choice_id+"_status .toggle_choice_status").bind("mouseover", function() {
                  $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
                     $(this).css("background", "#b1b1b1");
                     $(this).css("border-left", "1px solid #b1b1b1");
                     $(this).css("border-right", "1px solid #b1b1b1");
                   });
               });
               $("#choice_"+choice_id+"_status .toggle_choice_status").bind("mouseout", function() {
                  $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
                     $(this).css("background", "#cccccc");
                     $(this).css("border-left", "1px solid #cccccc");
                     $(this).css("border-right", "1px solid #cccccc");
                  });
               });
            }
            if (state == "true")
			      $('#choice_'+choice_id+'_toggle .round-filled-greyfg').text(data['verb']);
			   else
			      $('#choice_'+choice_id+'_toggle .round-filledfg').text(data['verb']);
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
		var state = $(this).attr("status");
		$.post('/questions/' + question_id + '/toggle_autoactivate.js',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			$('.indicator').hide();
			$.unblockUI();
			//humanMsg.displayMsg(data['message']);
			if(data['error']) {
				//no-op
			}
			else {
			   if (data['verb'] == "Enabled") {
               $([$("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").children(".round-filled-greyfg"), $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").children(".round-filled-grey").children()]).each(function(el) {
                     $(this).removeAttr("style")
               });
               $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").attr("status", "true");
               $("#question_"+question_id+"_autoactivate_status .round-filled-greyfg").addClass("round-filledfg").removeClass("round-filled-greyfg");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey-top").addClass("round-filled-top").removeClass("round-filled-grey-top");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey-bottom").addClass("round-filled-bottom").removeClass("round-filled-grey-bottom");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey").addClass("round-filled").removeClass("round-filled-grey");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey2").addClass("round-filled2").removeClass("round-filled-grey2");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey3").addClass("round-filled3").removeClass("round-filled-grey3");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey4").addClass("round-filled4").removeClass("round-filled-grey4");
               $("#question_"+question_id+"_autoactivate_status .round-filled-grey5").addClass("round-filled5").removeClass("round-filled-grey5");
               $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").bind("mouseover", function() {
                  $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
                     $(this).css("background", "#2b88ad");
                     $(this).css("border-left", "1px solid #2b88ad");
                     $(this).css("border-right", "1px solid #2b88ad");
                   });
               });
               $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").bind("mouseout", function() {
                  $([$(this).children(".round-filledfg"), $(this).children(".round-filled").children()]).each(function(el) {
                     $(this).css("background", "#3198c1");
                     $(this).css("border-left", "1px solid #3198c1");
                     $(this).css("border-right", "1px solid #3198c1");
                  });
               });
            }
            else if (data['verb'] == "Disabled") {
               $([$("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").children(".round-filledfg"), $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").children(".round-filled").children()]).each(function(el) {
                     $(this).removeAttr("style")
               });
               $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").attr("status", "false");
               $("#question_"+question_id+"_autoactivate_status .round-filledfg").addClass("round-filled-greyfg").removeClass("round-filledfg");
               $("#question_"+question_id+"_autoactivate_status .round-filled .round-filled-top").addClass("round-filled-grey-top").removeClass("round-filled-top");
               $("#question_"+question_id+"_autoactivate_status .round-filled .round-filled-bottom").addClass("round-filled-grey-bottom").removeClass("round-filled-bottom");
               $("#question_"+question_id+"_autoactivate_status .round-filled").addClass("round-filled-grey").removeClass("round-filled");
               $("#question_"+question_id+"_autoactivate_status .round-filled2").addClass("round-filled-grey2").removeClass("round-filled2");
               $("#question_"+question_id+"_autoactivate_status .round-filled3").addClass("round-filled-grey3").removeClass("round-filled3");
               $("#question_"+question_id+"_autoactivate_status .round-filled4").addClass("round-filled-grey4").removeClass("round-filled4");
               $("#question_"+question_id+"_autoactivate_status .round-filled5").addClass("round-filled-grey5").removeClass("round-filled5");
               $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").bind("mouseover", function() {
                  $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
                     $(this).css("background", "#b1b1b1");
                     $(this).css("border-left", "1px solid #b1b1b1");
                     $(this).css("border-right", "1px solid #b1b1b1");
                   });
               });
               $("#question_"+question_id+"_autoactivate_status .toggle_autoactivate_status").bind("mouseout", function() {
                  $([$(this).children(".round-filled-greyfg"), $(this).children(".round-filled-grey").children()]).each(function(el) {
                     $(this).css("background", "#cccccc");
                     $(this).css("border-left", "1px solid #cccccc");
                     $(this).css("border-right", "1px solid #cccccc");
                  });
               });
            }
            if (state == "true")
			      $('#question_'+question_id+'_autoactivate_toggle .round-filled-greyfg').text(data['verb']);
			   else
			      $('#question_'+question_id+'_autoactivate_toggle .round-filledfg').text(data['verb']);
		}
			//$('.prompter').effect("highlight", {}, 1500);
			
		},
		"json"
		);
		return false;
	});
	
	$('input[title!=""]').hint();
	$('textarea[title!=""]').hint();
	
	
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

        $('.view_voter_map').click(function(event){
			event.preventDefault();
			event.stopPropagation();
			
			var current_row = $(this).parent().parent()
			var target_row = $(this).parent().parent().next();
			if(!toggleLinkTextandTargetElement($(this), target_row))
			{
			        var iframe_html= "<tr id=voter_map_row class='row1'><td class='title' colspan='2' height=370px><div class='voter_map_indicator'><img src='/images/indicator.gif' /></div><iframe id='voter_map_iframe' src='" + $(this).attr('href') + "' onload='iframe_loaded();' width='746px' height='370px' frameborder=0 scrolling=no style='border:1px solid rgb(145,145,145);'></iframe></td></tr>"
				current_row.after(iframe_html);
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


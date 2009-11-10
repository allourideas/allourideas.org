// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
humanMsg.setup();


jQuery(document).ready(function() {
	$('.vote_left').bind('click',function(event){
		//var quote_id = $(this).attr("rel");
		$.post('/questions/1/vote_left',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			humanMsg.displayMsg('<strong>Voted.</strong> <span class="indent">You have succesfully voted for the choice on the left.</span>');
		}
		);
		return false;
	});

	$('.vote_right').bind('click',function(event){
		//var quote_id = $(this).attr("rel");
		$.post('/questions/1/vote_left',
		'authenticity_token='+encodeURIComponent(AUTH_TOKEN),
		function(data){
			humanMsg.displayMsg('<strong>Voted.</strong> <span class="indent">You have succesfully voted for the choice on the left.</span>');
		}
		);
		return false;
	});

	jQuery('a.showmessage:last').click(function() {
		humanMsg.displayMsg('"Your <strong>Earth</strong> will be reduced to a burned-out cinder."');
		return false;
	})
});

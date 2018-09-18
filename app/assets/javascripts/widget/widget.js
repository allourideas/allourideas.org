/*  Resize the scrollbar container to fill the remaining space between the vote nav bar and the bottom status footer */
/*  Resize the user_cd_reason text area semi-intelligently */

 var viewportwidth;
 var viewportheight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }
 
 // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }
 
 // older versions of IE
 
 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }

var newHeight;
var user_cd_reason_width = viewportwidth * .35 - 20;

if (user_cd_reason_width > 150)
  user_cd_reason_width = 150;

resize_widget = function () {
  newHeight = viewportheight - 16 - 25.4 - 14;
  
  $('.scrollbar_container').height(newHeight + 'px');
  $('#user_cd_reason').width(user_cd_reason_width + 'px');
  $('.bottom_status').show();
};


window.onload = resize_widget;


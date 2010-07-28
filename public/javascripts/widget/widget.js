/*  Resize the scrollbar container to fill the remaining space between the vote nav bar and the bottom status footer */

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





/*
 do_shit = function(event) {

  //alert('Your viewport width is '+viewportwidth+'x'+viewportheight);

  //newHeight = viewportheight - $('.scrollbar_container').offsetTop;// - $('.bottom_status').height();
  var d = $('.add-box');
  var topPos = d.offsetTop;

  alert(topPos);

  var offset = d.offset();
  alert(offset.top)

  newHeight = viewportheight - topPos;

  alert(newHeight);
  //$('.scrollbar_container').style.height = viewportheight - $('.vote-nav').height() - $('.bottom_status').height()
 };

alert('a');
window.onload = do_shit();
$('#cant_decide_btn').bind('click', do_shit());
alert('b');
*/

/*
alert('a');

function pageY(elem) {
    return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
}

alert('b');

var buffer = 20; //scroll bar buffer

function resizeIframe() {
    var height = document.documentElement.clientHeight;
    height -= pageY(document.getElementById('ifm'))+ buffer ;
    height = (height < 0) ? 0 : height;
    alert(height);
    document.getElementById('ifm').style.height = height + 'px';
    //resizeDebug();
}

alert('c');

document.getElementById('ifm').onload=resizeIframe;
window.onresize = resizeIframe;

alert('d');
*/

  /* Show 'About the Scoring' and make the widget scroll down to it */
  
  $('.question_mark').click(function() {
    $('#explanation').hide();
    //document.getElementById('explanation').scrollIntoView(true);
    $.scrollTo('10px');
  });


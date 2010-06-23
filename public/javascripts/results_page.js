  /* Tabbing functionality */

  /* A general tabbing function: */  
  switch_tabs = function(event) {
    $('.current').hide();

    $('.current_tab').removeClass('current_tab');  
    $('.current').removeClass('current');

    if ($(this).hasClass('about_tab')) {
      $('#about').addClass('current');
    }
    else if ($(this).hasClass('vote_tab')) {
      $('#cast_votes').addClass('current');
    }
    else if ($(this).hasClass('results_tab')) {
      $('#results').addClass('current');
    }
    else {  //  must have clicked return to voting
      $('.vote_tab').addClass('current_tab');   
      $('#cast_votes').addClass('current');
    }

    $(this).addClass('current_tab'); 
    $('.current').show();
  };

  $('.tab').click(switch_tabs);
  $('.return_voting').click(switch_tabs);

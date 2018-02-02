
$('#search_more_btn').click( function (a) {
    if($('#search_more_cont').hasClass('active')){
        $('#search_more_cont').removeClass('active');
    }else {
        $('#search_more_cont').addClass('active');
    }
});

$(document).ready(function() {
  var ci = $('.carousel-indicators');
  ci.owlCarousel({
    loop: true,
    nav: true,
    margin: 15,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      960: {
        items: 3
      },
      1200: {
        items: 4
      }
    }
  });
 

  var owl = $('.owl-carousel');
  owl.owlCarousel({
    loop: true,
    nav: true,
    margin: 15,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      960: {
        items: 3
      },
      1200: {
        items: 4
      }
    }
  });

})


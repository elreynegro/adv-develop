(function($){function handleAwardsHover(){$(this).addClass('hide-overflow').stop().animate({height:"100%"},400).find('img').addClass('show');$(this).find('span').addClass('show');}function handleAwardsLeave(){$(this).removeClass('hide-overflow').stop().animate({height:"47px"},400).find('img').removeClass('show');$(this).find('span').removeClass('show');}$('.aez-image-block > div').on('mouseenter',handleAwardsHover).on('mouseleave',handleAwardsLeave);})(jQuery);
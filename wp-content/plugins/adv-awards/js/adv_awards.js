(function($) {

var $redeem_now = $('.redeem_now');

//display status in gold and platinum colors
    $status = $('#status').val();
	if(typeof $status !== 'undefined') {
	    if($status.toLowerCase() == 'gold') {
	    	$('.highlight-text-awards').css('color', '#DAA520');
	    }
	    else if($status.toLowerCase() == 'silver'){
	    	$('.highlight-text-awards').css('color', '#969c94');
	    }
	    else if($status.toLowerCase() == 'platinum') {
	    	$('.highlight-text-awards').css('color', '#6e624e');
	    }
	}

//header tabs highlighting code
    if($(window).innerWidth() >= 1024) {
	    if(window.location.href.indexOf("benefits") > -1) {
	       		$('.benefits').css('background-color','#99CC00');
	    }
		else if(window.location.href.indexOf("activity") > -1) {
			if($('.activity').css('display') !== 'none') {
	       		$('.activity').css('background-color','#99CC00');
	       	}
	    }
		else if(window.location.href.indexOf("faq") > -1) {
		    	$('.faq').css('background-color','#99CC00');
		}
		else if(window.location.href.indexOf("awards") > -1) {
			if($('.awards').css('display') !== 'none') {
		    	$('.awards').css('background-color','#99CC00');
		    }
		}
	}
	else {
		if(window.location.href.indexOf("benefits") > -1) {
			if($('.benefits').css('display') !== 'none') {
	       		$('.benefits').css('color','#99CC00');
	       	}
	    }
		else if(window.location.href.indexOf("activity") > -1) {
			if($('.activity').css('display') !== 'none') {
	       		$('.activity').css('color','#99CC00');
	       	}
	    }
		else if(window.location.href.indexOf("faq") > -1) {
			if($('.faq').css('display') !== 'none') {
		    	$('.faq').css('color','#99CC00');
		    }
		}
		else if(window.location.href.indexOf("awards") > -1) {
			if($('.awards').css('display') !== 'none') {
		    	$('.awards').css('color','#99CC00');
		    }
		}
	}

//Awards page code
	    // Hide the reservation detail data
	    $('.expand-reservation').hide();

	    // Hide the reservation FAQ answers
	    $('.expand-faq').hide();

	    // Expand the reservation detail data or close it depending on the state
	    $('.view').on("click", function(e) {
			e.preventDefault();
			$(this).toggleClass('view');
			var expand_reservation = $(this).next('.expand-reservation');
			expand_reservation.toggle();
			$(this).toggleClass('minus');
			var rental_location = $(this).find('td.rental_location').text().trim();
			var name = $(this).find('td.renter_name').text();
			var renter_last = name.substring(0, name.indexOf(',')).trim();
			var conf_num = $(this).find('td.confirmation_num').text().trim();

			$.ajax({
					url: ADV_Rez_Ajax.ajaxurl,
					method: 'POST',
					data: {
						// wp ajax action
						action: 'advViewAndCancelRez',
	
						// vars
						rental_location_id: rental_location,
						renter_last: renter_last,
						confirm_num: conf_num,
						rez_task: 'viewReservation',
						// send the nonce along with the request
						advRezNonce: ADV_Rez_Ajax.advRezNonce
					},
					dataType: 'json'
				})
				.done(function(data) {
	
					var $form = $('<form>', {
						action: '/view-reservation',
						method: 'POST',
						enctype: 'multipart/form-data',
						target: '_blank',
					});
					// Append the form to the document body
					$(document.body).append($form);
	
					// Submit the form to the Choose page
					$form.submit();
	
				 })
				.fail(function(jqXHR, textStatus, errorThrown) {
					$submitButton.removeProp('disabled'); // remove disabled prop on fail
					console.log("error");
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
					removeCarSpinnerGif(0);
					return false;
				});
	
			return true;
		});

	function getMyReservationEvnApiUrl() {

		var getApiUrlPromise, newApiUrl;
		$ajax_URL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';

		getApiUrlPromise =
			$.post(
				$ajax_URL, {
					action: 'advGetApiUrl'
				},
				function(response) {
					dataObj = JSON.parse(response);
					return dataObj;
				}
			);
		$.when(getApiUrlPromise)
			.done(function(data){
					dataObj = JSON.parse(data);                                 
					newApiUrl = script_common_full_api_url + '/searchLocationsByBrands';
					var select2Url = script_common_full_api_url + '/searchLocationsByBrands';

				var config = {
						brand_name: dataObj.search_locations,
						url: select2Url,
						delay: 500,
						intl: dataObj.international_locations,
						services_url: script_common_services_url,
						logging_url: script_common_logging_url,
					};
		});
	}

	getMyReservationEvnApiUrl();
	removeCarSpinnerGif();

	//FAQ page code
 	// Expand the FAQ answers depending on the state
    $('.collapsed').click(function (e) {
        e.preventDefault();
        var expand_faq = $(this).next('.expand-faq');
        expand_faq.toggle();
        $(this).toggleClass('collapsed');
    });

	function goToAnchorReserve(anchor) {
		var loc = document.location.toString().split('#')[0];
		document.location = loc;
		// document.location = loc+'#reserve_top';
		return false;
	}

	function openSearchFormwithMenu(evt) {
        evt.preventDefault();
//if FAC is open, don't close it.
        if($('.aez-find-a-car-dropdown').hasClass('is-open')) {
        $('.aez-find-a-car-dropdown').toggleClass('is-open');
        	$('.aez-find-a-car-dropdown').find('.aez-form').slideToggle();
        }
//for Book Now, Redeem Now & Apply To Reservation
		var attr = $(this).attr('value');
        if (typeof attr !== typeof undefined && attr !== false) {
            var promoCode = $(this).attr('value');
        }
        else {
        	var promoCode = "";
        }

        $('#promo_codes1').attr('value', promoCode);
        $('#promo_codes1').html(promoCode);
	}

$redeem_now.off('click').on('click', openSearchFormwithMenu);

})(jQuery);
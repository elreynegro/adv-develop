/*
 *	ADV Modal Form Script
 */

(function($) {

	/*
	 *	Variables
	 */
	var $reservationEdit = $('#cancel_rez_form');
	var $closePopup = $('#go_back');
	var $closeModal = $('.aez-modal-dialog__close');
	var $cancelReservation = $('#cancel_reservation');
	var $modal = $('.aez-reservation-summary-modal');

    /* 
     *	Functions
     */

     // Modal Functionality Module
	var Modal = (function() {

		var open = function() {
    		return $('.aez-modal').addClass('aez-modal--active');
    	};

    	var close = function() {
    		return $('.aez-modal').removeClass('aez-modal--active');
    	};

    	var setVisible = function() {
    		return $('.aez-modal').data('visible', true);
    	};

    	var removeVisible = function() {
    		return $('.aez-modal').data('visible', false);
    	};

		return {
			open: open,
			close: close,
			setVisible: setVisible,
			removeVisible: removeVisible,
		};
	})();

	/*
	 *	Event Handlers
	 */
	function handleReservationEditClick(evt) {
		evt.preventDefault();
		Modal.open();
		Modal.setVisible();
	}

	function handleClosePopup(evt) {
		Modal.close();
		Modal.removeVisible();
	}

	function handleCloseModal(evt) {
		Modal.close();
		Modal.removeVisible();
	}

	function handleCancelReservation (evt) {

		evt.preventDefault();

		$rental_location_id = document.getElementsByName("cancel_rental_location_id")[0].value,
		$renter_last = document.getElementsByName("cancel_renter_last")[0].value,
		$confirm_num = document.getElementsByName("cancel_confirm_num")[0].value,

		$('body').append(createCarSpinnerGif());

		$.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				// wp ajax action
				action: 'advCancelRez',

				// vars
				rental_location_id: $rental_location_id,
				renter_last: $renter_last,
				confirm_num: $confirm_num,

				// send the nonce along with the request
				advRezNonce: ADV_Rez_Ajax.advRezNonce
			},
			dataType: 'json'
		})
		.done(function(data) {

			if (data.hasOwnProperty('content')) {
				if (data.content == "error") {
					// Set up variables for the error messages
					var $cnt = 0;
					var $errObject = {};
					var $tmpObj = {};

					// Make sure any previous error messages are hidden beforing showing new ones.
					removeErrMsg();

					// Display error message
					$tmpObj['title'] = 'We are unable to cancel your reservation at this time.';
					$tmpObj['text'] = '<div class="aez-confirmation-number__heading">Please call ' + 
									  '<a href="tel:+18007775500" style="color:#D8000C !important;">1-800-777-5500</a> ' +
									  'if you need assistance with your reservation.</div>';
					// Keep this commented code here for now. We can use this if we decide to display
					// the error messages from the API.
					//$tmpObj['text'] = data.message + '<div class="aez-confirmation-number__heading">Please call ' + 
					//				  '<a href="tel:+18007775500" style="color:#D8000C !important;">1-800-777-5500</a> with any questions ' +
					//				  'or concerns about your reservation.</div>';
					$errObject['err_' + $cnt++] = $tmpObj;
					displayErrorMessage($errObject);
					removeCarSpinnerGif(0);
					return false;
				}

			}

			var $form = $('<form>', {
				action: '/cancel-reservation',
				method: 'POST',
				enctype: 'multipart/form-data',
			});

			$form.appendTo('body');

			// Append the confirmation number to the form
			$('<input />').attr('type', 'hidden')
						  .attr('name', 'confirm_num')
						  .attr('value', data.confirm_num)
						  .appendTo('form');

			$form.submit();

			removeCarSpinnerGif(0);

			return true;

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            // Remove the car spinner gif on failed post
            // Function comes from main.js
            removeCarSpinnerGif(0);

            return false;

        });

    }

	/*
	 *	Event Listeners
	 */
	
	$('.aez-edit-block').on('click', handleReservationEditClick);
	$reservationEdit.on('click', handleReservationEditClick);
	$closePopup.on('click', handleClosePopup);
	$closeModal.on('click', handleCloseModal);
	$cancelReservation.on('click', handleCancelReservation);

})(jQuery);

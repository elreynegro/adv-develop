/*
 *	ADV Confirm Form Script
 */

(function($, window, document) {

	/* 
	 *	Variable References
	 */
	var $form = $('#aez_confirm_reservation_form');
	var $creditCardNumber = $('#card_number');
	// var $creditCardExpYear = $('#card_exp_year');
	// var $creditCardExpMonth = $('#card_exp_month');
	var $creditCardExp = $('#card_exp');
	var $useProfileAddressCheckbox = $('#use_profile_address');
	var $billingInfoContainer = $('.aez-form-billing-address');
	var $billingState = $('#billing_state');
    var $billingCountry = $('#billing_country');

	var $loginInfoContainer = $('.aez-form-block--log-in-information');
	var $addLoginInfoButton = $('#add-log-in-info');
    

	// Get the inputs for the billing info
	var $billingInfoInputs = {
		street_address_1: $billingInfoContainer.find('[name=billing_street_address_1]'),
		street_address_2: $billingInfoContainer.find('[name=billing_street_address_2]'),
		postal_code: $billingInfoContainer.find('[name=billing_postal_code]'),
		city: $billingInfoContainer.find('[name=billing_city]'),
		state: $billingInfoContainer.find('[name=billing_state]'),
		country: $billingInfoContainer.find('[name=billing_country]'),
	};

	// Get the billing info that is loaded with the page
	var billingInfo = {
		street_address_1: $billingInfoInputs.street_address_1.val(),
		street_address_2: $billingInfoInputs.street_address_2.val(),
		postal_code: $billingInfoInputs.postal_code.val(),
		city: $billingInfoInputs.city.val(),
		state: $billingInfoInputs.state.val(),
		country: $billingInfoInputs.country.val(),
	};

	var useProfileAddress = $useProfileAddressCheckbox.is(':checked');
	
	if($(window).innerWidth() >= 800) {
		$('.modify_reserve_mobile').css('display','block');
		$('.modify_reserve_desk').css('display','none');
	}
	else {
		$('.modify_reserve_mobile').css('display','none');
		$('.modify_reserve_desk').css('display','block');
	}
	/*
	 *	Functions
	 */

	 // Code for the abandonment error on the choose page
	$(document).ready(function(){

		var abandonment_choose_error = $("#abandonment_choose_error").attr("data-abandonment-choose-error");

		if (typeof abandonment_choose_error !== 'undefined' && abandonment_choose_error !== null && abandonment_choose_error !== "") {

			// Build error message
			var $cnt = 0;
			var $errObject = {};
			var $tmpObj = {};
			$tmpObj['title'] = 'Promo Code '+ abandonment_choose_error + ' can not be used.';
			$tmpObj['text'] = 'Please go back to the reserve page if you would like to use a different promo code.';
			$errObject['err_' + $cnt++] = $tmpObj;
			// Remove Spinner
			removeCarSpinnerGif();
			// Display Error Message
			displayErrorMessage($errObject);
			return false;

		}

	});


	function toggleLoginInfo() {
		$loginInfoContainer.animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 300);
	}

	function toggleBillingInfo() {
		$billingInfoContainer.animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 300);
	}

	function setBillingInfo(isChecked, $inputs, info) {
		if (isChecked) {
			// Populate the inputs with the billing info
			
			$billingInfoInputs.street_address_1.val(billingInfo.street_address_1);
			$billingInfoInputs.street_address_2.val(billingInfo.street_address_2);
			$billingInfoInputs.postal_code.val(billingInfo.postal_code);
			$billingInfoInputs.city.val(billingInfo.city);

			$billingInfoInputs.state.children('option')
				.filter(function() { if ($(this).val() === billingInfo.state) return $(this).attr('selected', true) } )
				.change();

			// $billingInfoInputs.country.children('option')
			// 	.filter(function() { if ($(this).val() === billingInfo.country) return $(this).attr('selected', true) } )
			// 	.change();
			$billingInfoInputs.street_address_1.attr('required', false);
                        $billingInfoInputs.postal_code.attr('required', false);
                        $billingInfoInputs.city.attr('required', false);
		} else {
			// Remove the inputs with the billing info
			$billingInfoInputs.street_address_1.attr('required', true);
                        $billingInfoInputs.postal_code.attr('required', true);
                        $billingInfoInputs.city.attr('required', true);
			$billingInfoInputs.street_address_1.val('');
			$billingInfoInputs.street_address_2.val('');
			$billingInfoInputs.postal_code.val('');
			$billingInfoInputs.city.val('');
			$billingInfoInputs.state.val('').change();
			$billingInfoInputs.country.val('').change();
		}
	}

	/***********************
        IE fix for select2
    ************************/
    // // After the user clicks on the location, this code will close the drop down
    // $creditCardExpYear.select2().on("change", function(e) {
    //     $creditCardExpYear.select2("close"); //call select2
    // });
	// // After the user clicks on the location, this code will close the drop down
    //  $creditCardExpMonth.select2().on("change", function(e) {
    //     $creditCardExpMonth.select2("close"); //call select2
    // });

     
        $billingState.select2().on("change", function(e) {
        $billingState.select2("close"); //call select2
    });
	// After the user clicks on the location, this code will close the drop down
     $billingCountry.select2().on("change", function(e) {
        $billingCountry.select2("close"); //call select2
    });


	// function setLoginInfo() {
		// Function that sets login information display
		// Possible hidden fields?
		
		// Ajax post info
		// On success remove the form inputs
		// Display User Credentials
	// }

	/*
	 *	Event Handlers
	 */
	
	// function handleUseProfileAddressCheckboxChange(evt) {
	// 	var isChecked = true;

	// 	// toggleBillingInfo();
	// 	setBillingInfo(isChecked, $billingInfoContainer, billingInfo);
	// }

	// function handleCreditCardChange(evt) {
	// 	// Testing out validator
	// 	var creditCardNumber = evt.target.value;
	// 	var isCreditCard = validator.isCreditCard(creditCardNumber);

	// 	console.log({ isCreditCard });
	// 	// append to input list with valid credit card message
	// }

	function handleLoginInfoButtonClick(evt) {
		evt.preventDefault();

		// setLoginInfo();
	}

	function handleLoginInfoButtonFirstClick(evt) {
		evt.preventDefault();

		// Display login info fields
		toggleLoginInfo();

		// Remove event listener
		// Add new event listener that handles post of login info
		// $addLoginInfoButton.off('click').on('click', handleLoginInfoButtonClick);
	}
        
        //Encrypty Credit card to save in user profile
        function handleCardEncryptAdd() {
            var pubKey = $("#pubKey").val();
            var cNumVal = $.trim($(this).val());
            var cNum = cNumVal.replace(/-/g, "");
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(pubKey);
            var encrypted = encrypt.encrypt(cNum); 
            $('#card_enc_value').val(encrypted);
        }        

		if(window.location.href.indexOf("confirm") > -1) {
			$('.pull-right').css('margin-bottom','3%');
		 }

	/* 
	 *	Event Listeners
	 */

	// $useProfileAddressCheckbox.on('change', handleUseProfileAddressCheckboxChange);
	// $creditCardNumber.on('change', handleCreditCardChange);
	$addLoginInfoButton.on('click', handleLoginInfoButtonFirstClick);
	$creditCardNumber.on('blur', handleCardEncryptAdd);

	/*
	 *	Function Invocations
	 */
	
	// setBillingInfo(useProfileAddress, $billingInfoContainer, billingInfo);

	// if ($creditCardExpMonth.length > 0) {
	// 	$creditCardExpMonth.select2({
	// 		placeholder: 'Expiration Month'
	// 	});
	// }
	
	// if ($creditCardExpYear.length > 0) {
	// 	$creditCardExpYear.select2({
	// 		placeholder: 'Expiration Year'
	// 	});
	// }

	if ($billingState.length > 0) {
		$billingState.select2({
			placeholder: 'State or Region'
		});
	}

	if ($creditCardNumber.length > 0) {
		$creditCardNumber.mask('0000-0000-0000-0000');
	}
	
})(jQuery, window, document);
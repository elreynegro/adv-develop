(function ($, document, window) {
	var $stateDDL = $('#state');
	var $emailSignUp = $('#email_sign_up_form');
	var $emailField = $('#sign_up_email_field');
	$('#adv_login').on('submit', function (e) {

		e.preventDefault();
		removeErrMsg();
		var getLoyaltyUrlPromise,
		newLoyaltyUrl;
		$ajax_URL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';
		$('body').append(createCarSpinnerGif());
		getLoyaltyUrlPromise = $.post($ajax_URL, {
				action: 'advGetLoyaltyUrl'
			}, function (response) {
				return response;
			});
		$.when(getLoyaltyUrlPromise).done(function (data) {
			if ($('[name="return_url"]').val().length > 1) {
				var $form = $('<form>', {
						id: "logged_in",
						action: $('[name="return_url"]').val(),
						method: 'POST',
					});
			} else {
				var $form = $('<form>', {
						id: "logged_in",
						//action: data + '/sso.php',
						action: data,
						method: 'POST',
					});
			}
			$.ajax({
				url: ADV_Rez_Ajax.ajaxurl,
				method: 'POST',
				data: {
					action: 'advLogin',
					email: document.getElementsByName("user_name")[0].value,
					password: document.getElementsByName("password")[0].value,
					is_home: document.getElementsByName("is_home")[0].value,
					advlogin: ADV_Ajax.advlogintNonce
				},
				dataType: 'json'
			}).done(function (data) {
				if ('error' in data) {
					if($(".errors").length) {
						$( ".errors" ).remove();
					}
					$('#error_messages').css("display", "block");
					$('.input-group').css("box-shadow", "0 0 0 1px rgb(198, 17, 17)");
					$('.input-group').css("border-radius", "5px");
					$('#error_messages').append('<span class="errors" style="width: 100%; font-size: 0.9em;">Login failed. </br> Please try again with correct username and password.</span>');
					removeCarSpinnerGif(0);
					return false;
				}
		
				$form.append(createHiddenInput('access_token', data.access_token));
				$form.append(createHiddenInput('membernumber', data.memberNumber));
				$form.append(createHiddenInput('id', data.userGUID));
				$form.append(createHiddenInput('hash', data.SSO_HASH));
				//$(document.body).append($form);
				//$form.submit();
                location.reload();
			}).fail(function (jqXHR, textStatus, errorThrown) {
				console.log("error");
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
				removeCarSpinnerGif(0);
				return false;
			});
		});
		return true;
	});	   
    
	$('#change_password').on('submit', function (event) {
            
		var $cnt = 0;
		var $errObject = {};
		$('body').append(createCarSpinnerGif());
		var new_password1 = document.getElementsByName("new_password1")[0].value;
		var new_password2 = document.getElementsByName("new_password2")[0].value;
		if (new_password1 != new_password2) {
			var $tmpObj = {};
			$tmpObj['title'] = 'Passwords do not match';
			$tmpObj['text'] = 'Please re-enter your passwords';
			$errObject['err_' + $cnt++] = $tmpObj;
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		}
		$.post(ADV_Rez_Ajax.ajaxurl, {
			action: 'advChangeProfilePassword',
			new_password1: new_password1,
			new_password2: new_password2,
			current_password: document.getElementsByName("current_password")[0].value,
			email: document.getElementsByName("email")[0].value,
			advlogin: ADV_Ajax.advlogintNonce
		}, function (response) {
			if (typeof(response) == 'string') {
				var response_object = JSON.parse(response);
			} else {
				var response_object = response;
			}
			if (response_object.status == "error") {
				var $cnt = 0;
				var $errObject = {};
				var $tmpObj = {};
				$tmpObj['title'] = "Password could not be changed";
				$tmpObj['text'] = response_object.error.errorMessage;
				$errObject['err_' + $cnt++] = $tmpObj;
				displayErrorMessage($errObject);
				removeCarSpinnerGif(0);
				return false;
			} else {
				$('<form id="password_changed" method="post" action="/profile"></form>').appendTo('body');
				$('<input />').attr('type', 'hidden').attr('name', 'message').attr('value', response_object.success).appendTo('#password_changed');
				var $password_changed = $('#password_changed').attr('data-password_changed');
				removeSuccessMsg();
				removeErrMsg();
				var $cnt = 0;
				var $errObject = {};
				var $tmpObj = {};
				$tmpObj['title'] = 'Password Changed';
				$tmpObj['text'] = 'Your password has successfully been changed.';
				$errObject['err_' + $cnt++] = $tmpObj;
				displaySuccessMessage($errObject);
				$('#password_changed').submit();
			}
		});
		return false;
	});
	$('#request_reset_forgot_password').on('submit', function (e) {
		e.preventDefault();
		removeErrMsg();
		$('body').append(createCarSpinnerGif());
		var email = document.getElementsByName("email")[0].value;
		var $cnt = 0;
		var $errObject = {};
		$.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'advRequestResetPassword',
				email: email,
				advlogin: ADV_Ajax.advlogintNonce
			},
			dataType: 'json'
		}).done(function (data) {
			removeCarSpinnerGif(0);
			$('<form action="/" method="post"><input type="hidden" name="password_reset" value="yes"></form>').appendTo('body').submit();
		}).fail(function (jqXHR, textStatus, errorThrown) {
			removeCarSpinnerGif(0);
			return false;
		});
		return false;
	});
	$('#reset_forgot_password').on('submit', function (e) {
		e.preventDefault();
		removeErrMsg();
		$('body').append(createCarSpinnerGif());
		var $terms = $('#terms_and_conditions');
		var email = document.getElementsByName("email")[0].value;
		var password = document.getElementsByName("password")[0].value;
		var password_again = document.getElementsByName("password_again")[0].value;
		var password_token = document.getElementsByName("password_token")[0].value;
		var $cnt = 0;
		var $errObject = {};
		if (password != password_again) {
			var $tmpObj = {};
			$tmpObj['title'] = "Passwords don't match.";
			$tmpObj['text'] = 'Please enter matching passwords.';
			$errObject['err_' + $cnt++] = $tmpObj;
		}
		if (!$terms.is(':checked')) {
			var $tmpObj = {};
			$tmpObj['title'] = 'Please review the Advantage Rent A Car' + "'" + 's Terms and Conditions.';
			$tmpObj['text'] = 'If you agree, please check box next to "I agree with Advantage Rent A Car' + "'" + 's Terms and Conditions".';
			$errObject['err_' + $cnt++] = $tmpObj;
		}
		if ($cnt > 0) {
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		}
		$.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'advResetForgotPassword',
				email: email,
				password: password,
				password_again: password_again,
				password_token: password_token,
				advlogin: ADV_Ajax.advlogintNonce
			},
			dataType: 'json'
		}).done(function (data) {
			var data_object = JSON.parse(data);
			if ('error' in data_object) {
				var $tmpObj = {};
				$tmpObj['title'] = data_object.error;
				$tmpObj['text'] = 'Please make sure your email address is correct';
				$errObject['err_' + $cnt++] = $tmpObj;
				removeCarSpinnerGif(0);
				displayErrorMessage($errObject);
				return false;
			} else {
				$.ajax({
					url: ADV_Rez_Ajax.ajaxurl,
					method: 'POST',
					data: {
						action: 'advLogin',
						email: email,
						password: password,
						advlogin: ADV_Ajax.advlogintNonce
					},
					dataType: 'json'
				}).done(function (data) {
					removeCarSpinnerGif(0);
					$('<form action="/" method="post"><input type="hidden" name="reset_forgot_password" value="yes"></form>').appendTo('body').submit();
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log("error");
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
					removeCarSpinnerGif(0);
					return false;
				});
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			removeCarSpinnerGif(0);
			return false;
		});
		return false;
	});

	// Validate US Zip codes
	function validateUSZip(zip) {
	   return /^\d{5}(-\d{4})?$/.test(zip);
	}

	$('#update_loyalty_profile').on('submit', function (event) {
		var $cnt = 0;
		var $errObject = {};
                removeErrMsg();
        //Payment preferences DOB and Renter Address validation
        var paymentPrefFlag = true;
        var locationPrefFlag = true;
        var $payment_preferences = $('#update_loyalty_profile input[name=payment_preferences]:checked').val();
        //var $postal_code = $('#zipCode');
        var $billing_postal_code = $('#billing_postal_code');

        if($payment_preferences == 1) {
            //Date of birth and renter address validation
            var $dob = $('#dob');
            //var $street_address1 = $('#address1');
            var $street_address1 = $('#billing_street_address_1');
          //  var $street_address2 = $('#address2');
            //var $city = $('#city');
            var $city = $('#billing_city');
         //   var $state = $('#state');
            //var $country = $('#country');

            if($dob.val() == '' || $.trim($street_address1.val()) == ''  || $.trim($billing_postal_code.val()) == '' || $.trim($city.val()) == '') {
                paymentPrefFlag = false;
            }
        }
        
        if($.trim($('#preferred_dropoff_location').val()) != '' && $.trim($('#preferred_rental_location').val()) == '') {
            locationPrefFlag = false;
        }

        //CC card validation
        var cc_name_input = $('.aez_card_name:visible');
        var cc_number_input = $('.aez_card_number:visible');
        var cc_year_input = $('.aez_card_year:visible');
        var cc_month_input = $('.aez_card_month:visible');
        var cc_year_edit_input = $('.expiry_year_dropdown');
        var cc_month_edit_input = $('.expiry_month_dropdown');
        var cc_err_flag = true;
        var cc_valid_err_flag = true;
        var cc_expiry_flag = true;
        var cc_holder_name_err_flag = true;
        
        $.each(cc_name_input, function( index, value ) {
            var cc_name = cc_name_input[index];
            var cc_number = cc_number_input[index];
            var cc_month = cc_month_input[index];
            var cc_year = cc_year_input[index];

            if($.trim($(cc_name).val()) != '') {
                var cc_name_holder_validate = validateCardholderName($(cc_name).val());
                if(!cc_name_holder_validate) {
                    cc_holder_name_err_flag = false; 
                }
                if($.trim($(cc_number).val()) == '' || $.trim($(cc_month).val()) == '' || $.trim($(cc_year).val()) == ''){
                    cc_err_flag = false;
                }
            }
            if($.trim($(cc_number).val()) != '') {
                if($.trim($(cc_name).val()) == '' || $.trim($(cc_month).val()) == '' || $.trim($(cc_year).val()) == ''){
                    cc_err_flag = false;
                }
            }
            if($.trim($(cc_month).val()) != '') {
                if($.trim($(cc_name).val()) == '' || $.trim($(cc_number).val()) == '' || $.trim($(cc_year).val()) == ''){
                    cc_err_flag = false;
                }
            }
            if($.trim($(cc_year).val()) != '') {
                if($.trim($(cc_name).val()) == '' || $.trim($(cc_number).val()) == '' || $.trim($(cc_month).val()) == ''){
                    cc_err_flag = false;
                }
            }

            if($.trim($(cc_number).val()) != '') {
                var cc_validate = validateCC($.trim($(cc_number).val()));
                if(!cc_validate) {
                    cc_valid_err_flag = false; 
                }
            }
            
            if($.trim($(cc_month).val()) != '' && $.trim($(cc_year).val()) != '') {
                var d = new Date();
                month = d.getMonth() + 1;
                year = d.getFullYear();

                var cc_m = parseInt($.trim($(cc_month).val()));
                var cc_y = parseInt($.trim($(cc_year).val()));

                if(cc_y <= year) {
                    if(cc_m <= month) {
                        cc_expiry_flag = false;
                   } 
                }
            }                       
        });
        
        
        $.each(cc_year_edit_input, function( index, value ) {
            var cc_month_edit = cc_month_edit_input[index];
            var cc_year_edit = cc_year_edit_input[index];

            if($.trim($(cc_month_edit).val()) != '' && $.trim($(cc_year_edit).val()) != '') {
                var d = new Date(),
                month = d.getMonth() + 1;
                year = d.getFullYear();
                
                var cc_m = parseInt($.trim($(cc_month_edit).val()));
                var cc_y = parseInt($.trim($(cc_year_edit).val()));
                if(cc_y <= year) {
                    if(cc_m <= month) {
                        cc_expiry_flag = false;
                   } 
                }
            }                       
        });            

        var cc_card_name = $('[name="name_on_card"]').serializeArray();
        var cc_card_number = $('[name="credit_card"]').serializeArray();
        var cc_expiry_year = $('[name="expiry_year"]').serializeArray();
        var cc_expiry_month = $('[name="expiry_month"]').serializeArray();
        var card_enc_value = $('[name="card_enc_value"]').serializeArray();
        var cc_card_update_id = $('[name="cc_card_update_id"]').serializeArray();
        var cc_card_update_year = $('[name="cc_card_update_year"]').serializeArray();
        var cc_card_update_month = $('[name="cc_card_update_month"]').serializeArray();
        
        //Validate Postal and Biiling ZIP
        //var renter_zip_flag = true;
        var billing_zip_flag = true;
        
        // if($postal_code.val() != '') {
        //     renter_zip_flag = validateUSZip($postal_code.val());
        // }

        //if(!$('#use_profile_address').prop('checked')) {
		 if($billing_postal_code.val() != '') {
			billing_zip_flag = validateUSZip($billing_postal_code.val());
		}

		if (paymentPrefFlag && locationPrefFlag && cc_err_flag && cc_valid_err_flag && cc_expiry_flag && billing_zip_flag && cc_holder_name_err_flag) {
			$('body').append(createCarSpinnerGif());
			var EmailOptIn = 0;
			var SMSOptIn = 0;
			if($('#update_loyalty_profile input[name=EmailOptIn]'). prop("checked")){
			    EmailOptIn = 1;
			}
			if($('#update_loyalty_profile input[name=SMSOptIn]'). prop("checked")){
			    SMSOptIn = 1;
			}
			$.post(ADV_Rez_Ajax.ajaxurl, {
				action: 'advEditProfile',
				memberNumber: document.getElementsByName("memberNumber")[0].value,
				FirstName: document.getElementsByName("first_name")[0].value,
				LastName: document.getElementsByName("last_name")[0].value,
				MobileNumber: document.getElementsByName("phone")[0].value,
				// AddressLine1: document.getElementsByName("address1")[0].value,
				// AddressLine2: document.getElementsByName("address2")[0].value,
				// PostalCode: document.getElementsByName("zipCode")[0].value,
				// City: document.getElementsByName("city")[0].value,
				// State: document.getElementsByName("state")[0].value,
				AddressLine1: '',
				AddressLine2: '',
				PostalCode: '',
				City: '',
				State: '',
				EmailOptIn: EmailOptIn,
				SMSOptIn: SMSOptIn,
				dob: document.getElementsByName("dob")[0].value,
				frequent_flyer_airline: document.getElementsByName("frequent_flyer_airline")[0].value,
				frequent_flyer_number: document.getElementsByName("frequent_flyer_number")[0].value,
				preferred_rental_location: document.getElementsByName("preferred_rental_location")[0].value,
				preferred_dropoff_location: document.getElementsByName("preferred_dropoff_location")[0].value,
				car_specification: document.getElementsByName("car_specification")[0].value,
				additional_driver: $('#update_loyalty_profile input[name=additional_driver]:checked').val(),
				child_seat: $('#update_loyalty_profile input[name=child_seat]:checked').val(),
				hand_controls_left: $('#update_loyalty_profile input[name=hand_controls_left]:checked').val(),
				hand_controls_right: $('#update_loyalty_profile input[name=hand_controls_right]:checked').val(),
				stroller: $('#update_loyalty_profile input[name=stroller]:checked').val(),
				gps: $('#update_loyalty_profile input[name=gps]:checked').val(),
				skirack: $('#update_loyalty_profile input[name=skirack]:checked').val(),
				payment_preferences: $('#update_loyalty_profile input[name=payment_preferences]:checked').val(),
				//Country: document.getElementsByName("country")[0].value,
				Country: '',
				is_billing_same_defalut_address: ($('#use_profile_address:checked').val() == 1)?1:0,
				billing_street_address1: document.getElementsByName("billing_street_address_1")[0].value,
				billing_street_address2: document.getElementsByName("billing_street_address_2")[0].value,
				billing_postal_code: document.getElementsByName("billing_postal_code")[0].value,
				billing_city: document.getElementsByName("billing_city")[0].value,
				billing_state: document.getElementsByName("billing_state")[0].value,
				billing_country: document.getElementsByName("billing_country")[0].value,  
				cc_card_name: cc_card_name,
				cc_card_number: cc_card_number,
				cc_expiry_year: cc_expiry_year,
				cc_expiry_month: cc_expiry_month,
				card_enc_value: card_enc_value,
				cc_card_update_id: cc_card_update_id,
				cc_card_update_month: cc_card_update_month,
				cc_card_update_year: cc_card_update_year,
				advlogin: ADV_Rez_Ajax.advlogintNonce
			}, function (response) {

				if (typeof(response) == 'string') {
					response_object = JSON.parse(response);
				} else {
					response_object = response;
				}

	            if(response_object.FrqFlyError && response_object.FrqFlyError == 'ERROR') {
	                    // Build error message
	                    var $cnt = 0;
	                    var $errObject = {};
	                    var $tmpObj = {};
	                    $tmpObj['title'] = 'Frequent Flyer Number Is Invalid.';
	                    $tmpObj['text'] = 'Please enter a valid Frequent Flyer Number';
	                    $errObject['err_' + $cnt++] = $tmpObj;

	                    // Remove Spinner
	                    removeCarSpinnerGif();

	                    // Display Error Message
	                    displayErrorMessage($errObject);

	                    return false;
	            }

				if (response_object.status == "error") {
					var $tmpObj = {};
					var $cnt = 0;
					var $errObject = {};
					$tmpObj['title'] = 'Your Profile could not be updated';
					$tmpObj['text'] = response_object.error;
					$errObject['err_' + $cnt++] = $tmpObj;
					displayErrorMessage($errObject);
					removeCarSpinnerGif(0);
					return false;
				} else {
					$('<form id="go_to_profile" method="post" action="/profile"></form>').appendTo('body');
					$('<input />').attr('type', 'hidden').attr('name', 'update_success').attr('value', 'Your profile has been updated').appendTo('#go_to_profile');
					var $go_to_profile = $('#go_to_profile').attr('data-go_to_profile');
					removeSuccessMsg();
					removeErrMsg();
					var $cnt = 0;
					var $errObject = {};
					var $tmpObj = {};
					$tmpObj['title'] = 'Profile Updated';
					$tmpObj['text'] = 'Your profile updated successfully.';
					$errObject['err_' + $cnt++] = $tmpObj;
					displaySuccessMessage($errObject);
					$('#go_to_profile').submit();
				}
			});

        } else {
            removeErrMsg();

            var $cnt = 0;
            var $errObject = {};
            // Check if payment preference "Pay Online" option, DOB and Renter address should be mandatory.
            if (paymentPrefFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Check Date Of Birth and Billing Address';
                $tmpObj['text'] = 'The Date Of Birth and Billing Address should be filled out for Pay Online option.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            //Check preferred renter validation
            if (locationPrefFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Check Preferred Rental Location';
                $tmpObj['text'] = 'Preferred Rental Location should be chosen on selecting Preferred Drop-Off Location.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            //Credit card fill all the details
            if (cc_err_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Credit card details';
                $tmpObj['text'] = 'Please fill all details for credit card';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            //Credit card invalid
            if (cc_valid_err_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid credit card';
                $tmpObj['text'] = 'Entered credit card number is invalid';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            //Credit card expiry invalid
            if (cc_expiry_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Card Expired';
                $tmpObj['text'] = 'Please choose valid expiry month and year';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            // Check if the card name is valid
            if (cc_holder_name_err_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Credit Card Name';
                $tmpObj['text'] = 'Please provide valid credit card name';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Postal Code is invalid
            // if (renter_zip_flag === false) {

            //     var $tmpObj = {};
            //     $tmpObj['title'] = 'Invalid Postal Code';
            //     $tmpObj['text'] = 'Please enter a valid postal code';
            //     $errObject['err_' + $cnt++] = $tmpObj;
            // }

            // Billing Postal Code is invalid
            if (billing_zip_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Billing Postal Code';
                $tmpObj['text'] = 'Please enter a valid billing postal code';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            displayErrorMessage($errObject);

        }

		return false;

	});

	$stateDDL.select2().on("change", function (e) {
		$stateDDL.select2("close");
	});

	function createHiddenInput(name, value) {
		return $('<input>', {
			type: 'hidden',
			name: name,
			value: value
		});
	}
	function handleEmailSignUp(evt) {
		evt.preventDefault();
		var isEmailValid = handleEmailField(evt);
		if (isEmailValid) {
			saveSignUpEmail();
			$('.pum-close').trigger('click');
			return true;
		}
		return false;
	}
	function handleEmailField(evt) {
		evt.preventDefault();
		var inputEmail = document.getElementsByName("sign_up_email")[0].value
			var isEmailValid = validateEmail(inputEmail);
		if (!isEmailValid) {
			$('.email_sign_up_msg').html('Please enter a valid email').css({
				'color': '#DD0000',
				'text-align': 'center'
			});
		} else {
			$('.email_sign_up_msg').html('');
		}
		return isEmailValid;
	}
	function saveSignUpEmail(evt) {
		$.post(ADV_Rez_Ajax.ajaxurl, {
			action: 'saveSignUpEmail',
			sign_up_email: document.getElementsByName("sign_up_email")[0].value,
			advlogin: ADV_Rez_Ajax.advlogintNonce
		}, function (response) {
			//console.log(response);
		});
		return false;
	}
	function validateEmail(email) {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	}
        // Validate a card name, returns true if valid and false if not
        function validateCardholderName(cardholdername) {
            // Regex for the phone number
            // var phoneregx = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;
            if(cardholdername !== ''){
                var holderregx = /^[a-zA-Z ]*$/;
                return holderregx.test(cardholdername);
            }
            return true;
        }
        function validateCC(ccNum){
                var ccNum = ccNum;
                var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
                var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
                var amexpRegEx = /^(?:3[47][0-9]{13})$/;
                var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
                var isValid = false;

                if (visaRegEx.test(ccNum)) { isValid = true; } 
                else if(mastercardRegEx.test(ccNum)) { isValid = true; } 
                else if(amexpRegEx.test(ccNum)) { isValid = true; } 
                else if(amexpRegEx.test(ccNum)) { isValid = true; }

                return isValid;
        }
        
	$emailSignUp.on('submit', handleEmailSignUp);
	$emailField.on('blur', handleEmailField);
}
(jQuery, document, window));
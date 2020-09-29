(function ($, document, window) {
	
	$(document).ready(function () {
		$(function () {$('[data-toggle="tooltip"]').tooltip()});
		var $choosePageForms = $('.vehicle_chosen');
		function removeDisabledFromSubmit() {
			var $form = $(this);
			var $submitButton = $form.find('button[type="submit"]');
			return $submitButton.removeProp('disabled');
		}
		$choosePageForms.each(removeDisabledFromSubmit);
	});
	$('#adv_rez').on('submit', function (e) {
		e.preventDefault();
		$pickup_date = document.getElementsByName("pickup_date")[0].value;
		$pickup_time = document.getElementsByName("pickup_time")[0].value;
		$dropoff_date = document.getElementsByName("dropoff_date")[0].value;
		$dropoff_time = document.getElementsByName("dropoff_time")[0].value;
		$return_location = document.getElementsByName("dropoffValue")[0].value;
		$rental_location = document.getElementsByName("pickupValue")[0].value;
		$pickup_time = $pickup_time.substr(0, 5) + " " + $pickup_time.substr(5);
		$dropoff_time = $dropoff_time.substr(0, 5) + " " + $dropoff_time.substr(5);
		$datetimeStart = $pickup_date + " " + $pickup_time;
		$datetimeEnd = $dropoff_date + " " + $dropoff_time;
		$vehicle_option = [];
		$selected_car_class = '';
		if(document.getElementsByName("vehicle_page_car_class").length > 0) {
			$selected_car_class = document.getElementsByName("vehicle_page_car_class")[0].value;
		}

		var renter_age = "";
		if(document.getElementById("renter_age") !== null) {
			renter_age = document.getElementById("renter_age").value;
			if(renter_age == "21") {
				$vehicle_option.push("UAGE");
			}
		}
		
		var $dateNow = new Date();
		var $cnt = 0;
		var $errObject = {};
		var $tmpObj = {};
		removeErrMsg();
		if ($return_location == "No locations found" || $rental_location == "No locations found") {
			$tmpObj['title'] = 'Search can not be done.';
			$tmpObj['text'] = 'Please search for a valid location';
			$errObject['err_' + $cnt++] = $tmpObj;
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		}
		if (Date.parse($datetimeStart) < Date.parse($dateNow)) {
			$tmpObj['title'] = 'Search can not be done.';
			$tmpObj['text'] = 'The rental date time can not be in the past. Please adjust your selection to the present.';
			$errObject['err_' + $cnt++] = $tmpObj;
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		}
		if ($pickup_date == $dropoff_date && Date.parse($datetimeEnd) < Date.parse($datetimeStart)) {
			$tmpObj['title'] = 'Search can not be done.';
			$tmpObj['text'] = 'The return time can not be earlier than the rental time. Please adjust your time selections.';
			$errObject['err_' + $cnt++] = $tmpObj;
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		} else if ($pickup_date !== $dropoff_date && Date.parse($datetimeEnd) < Date.parse($datetimeStart)) {
			$tmpObj['title'] = 'Search can not be done.';
			$tmpObj['text'] = 'The return date can not be earlier than the rental date. Please adjust your date selections.';
			$errObject['err_' + $cnt++] = $tmpObj;
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		} else if ($pickup_date == $dropoff_date && Date.parse($datetimeEnd) == Date.parse($datetimeStart)) {
			$tmpObj['title'] = 'Search can not be done.';
			$tmpObj['text'] = 'The rental date and time can not be the same as the return date and time. Please adjust your selections.';
			$errObject['err_' + $cnt++] = $tmpObj;
			displayErrorMessage($errObject);
			removeCarSpinnerGif(0);
			return false;
		}
		$('body').append(createCarSpinnerGif());
		var promo_codes = [];
		var myPromoCodes = document.getElementsByName('promo_codes[]');
		for (var i = 0; i < myPromoCodes.length; i++) {
			promo_codes[i] = myPromoCodes[i].value;
		}
		var express_checkout_val = $("#express_checkout_option").prop('checked') ? 1 : 0;
		var base_url = window.location.protocol + "//" + window.location.hostname + '/';
	
		$.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'advRezChoose',
				api_provider: document.getElementsByName("api_provider")[0].value,
				rental_location_id: document.getElementsByName("rental_location_id")[0].value,
				return_location_id: document.getElementsByName("return_location_id")[0].value,
				pickup_date: document.getElementsByName("pickup_date")[0].value.replace(/\//ig, ''),
				pickup_time: document.getElementsByName("pickup_time")[0].value,
				dropoff_date: document.getElementsByName("dropoff_date")[0].value.replace(/\//ig, ''),
                dropoff_time: document.getElementsByName("dropoff_time")[0].value,
				age:  renter_age,
				express_checkout_option: express_checkout_val,
				promo_codes: promo_codes,
				advRezNonce: ADV_Rez_Ajax.advRezNonce,
				vehicleOptions: $vehicle_option,
				selected_car_class: $selected_car_class,
			},
			dataType: 'json'
		}).done(function (data) {
			if (data.Status == "Failed") {
				$tmpObj['title'] = 'Search can not be done.';
				$tmpObj['text'] = data.Msg;
				$errObject['err_' + $cnt++] = $tmpObj;
				displayErrorMessage($errObject);
				removeCarSpinnerGif(0);
				return false;
			}
			if (data.express_checkout_flag == 1) {
				window.location.href = base_url + 'reserve';
				return false;
			}
			if (data.choosed_car_from_vehicle_page == 1) {
				window.location.href = base_url + 'enhance';
				return false;
			}			
			$('<input />').attr('type', 'hidden').attr('name', 'vehicles_html').attr('value', data.htmlString).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'date_of_pickup').attr('value', data.date_of_pickup).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'date_of_return').attr('value', data.date_of_return).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'rental_location').attr('value', data.rental_location).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'rental_location_city').attr('value', data.rental_location_city).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'rental_location_state').attr('value', data.rental_location_state).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'return_to_id').attr('value', data.return_to_id).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'return_location_city').attr('value', data.return_location_city).appendTo('#adv_rez');
			$('<input />').attr('type', 'hidden').attr('name', 'return_location_state').attr('value', data.return_location_state).appendTo('#adv_rez');
			$('#adv_rez').off('submit').submit();
			removeCarSpinnerGif(15000);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log("error");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			removeCarSpinnerGif(0);
			return false;
		});
		return true;
	});
	$('#test_button_1').on('click', function (event) {
		$.post(ADV_Rez_Ajax.ajaxurl, {
			action: 'advRezTest1',
			advlogin: ADV_Rez_Ajax.advlogintNonce
		}, function (response) {
			console.log(response);
		});
		return false;
	});
	function createHiddenInput(name, value) {
		return $('<input>', {
			type: 'hidden',
			name: name,
			value: value
		});
	}
	$('.vehicle_chosen').on('submit', function (event) {
		event.preventDefault();
		$('body').append(createCarSpinnerGif());
		$.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'advRezEnhance',
				class_code: $(this).find('[name="class_code"]').val(),
				prepaid: $(this).find('[name="prepaid"]').val(),
				rate_id: $(this).find('[name="rate_id"]').val(),
				payment_type: $(this).find('[name="payment_type"]').val(),
				vehicleIndex: $(this).find('[name="car_key"]').val(),
				advRezEnhanceNonce: ADV_Rez_Ajax.advRezEnhanceNonce
			},
			dataType: 'json',
		}).done(function (res) {
			//Redirect to home page if session exipred.
			if (typeof res.redirect !== 'undefined' && res.redirect) {
				window.location.href = res.redirect;
				return;
			}
			var $form = $('<form>', {
					action: '/enhance',
					method: 'POST',
					enctype: 'multipart/form-data',
				});
			$form.appendTo('body');
			$form.submit();
			//window.location = '/enhance';
			removeCarSpinnerGif(15000);
		}).fail(function () {
			removeCarSpinnerGif(0);
		});
		return true;
	});
	function validateEmail(email) {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	}
	function validateUSZip(zip) {
		return /^\d{5}(-\d{4})?$/.test(zip);
	}
	function validatePhoneNumber(phonenumber) {
		var phoneregx = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;
		return phonenumber.val().match(phoneregx);
	}
	$('#primary').on('click', '.aez-error__close', function () {
		removeErrMsg();
	});
	$('#aez_confirm_reservation_form').on('submit', function (evt) {
		evt.preventDefault();
		var $inputs = $('#aez_confirm_reservation_form :input');
		var $postal_code = $('#billing_postal_code:visible');
		var inputList = $.map($inputs, function (input) {
				var obj = {};
				if ($(input).is('[type="checkbox"]') || $(input).is('[type="radio"]')) {
					if ($(input).is(':checked')) {
						obj.name = $(input).attr('name');
						obj.value = $(input).val();
					}
				} else {
					obj.name = $(input).attr('name');
					obj.value = $(input).val();
				}
				return obj;
			});
		var formData = {
			action: 'advComplete',
			advConfirmNonce: ADV_Rez_Ajax.advCompleteNonce,
		};
		inputList.forEach(function (input) {
			return formData[input.name] = input.value;
		});
		var confirm_page_postal_code_flag = true;
		if ($postal_code.length > 0 && $postal_code.val() != '') {
			confirm_page_postal_code_flag = validateUSZip($postal_code.val());
		}
		if (confirm_page_postal_code_flag) {
			removeErrMsg();
			$(this).find(':submit').attr('disabled', 'disabled');
			$('body').append(createCarSpinnerGif());
			$.ajax({
				url: ADV_Rez_Ajax.ajaxurl,
				method: 'POST',
				data: formData,
				dataType: 'json'
			}).done(function (data) {
				var promo_codes = [];
				if (data.hasOwnProperty('content')) {
					if (data.content.hasOwnProperty('error')) {
						var $cnt = 0;
						var $errObject = {};
						var $tmpObj = {};
						$tmpObj['title'] = 'Reservation is complete.';
						$tmpObj['text'] = 'Your confirmation number is: ' + data.content.error + '. You should receive a confirmation email soon. <br><br>' + 'If you would like to make another reservation, please <a href="/find-a-car-worldwide?error=remove">click here.</a>';
						$errObject['err_' + $cnt++] = $tmpObj;
						displayErrorMessage($errObject);
						removeCarSpinnerGif(0);
						return false;
					}
				}
				if (data.hasOwnProperty('content')) {
					if (data.content.content == 'error') {
						var $cnt = 0;
						var $errObject = {};
						var $tmpObj = {};
						$tmpObj['title'] = 'There was an error completing your reservation.';
						$tmpObj['text'] = 'Please check all your information to make sure it is correct. <br>' + data.content.message + '.';
						$errObject['err_' + $cnt++] = $tmpObj;
						displayErrorMessage($errObject);
						removeCarSpinnerGif(0);
						$('button').removeAttr("disabled");
						return false;
					}
				}
				var $form = $('<form>', {
						action: '/complete',
						method: 'POST',
						enctype: 'multipart/form-data',
					});
				Object.keys(formData).forEach(function (key) {
					var value = formData[key];
					if (key === 'promo_codes[]') {
						value.forEach(function (code) {
							$form.append(createHiddenInput(key, code));
						});
					} else {
						$form.append(createHiddenInput(key, value));
					}
				});
				$form.appendTo('body');
				$form.submit();
				removeCarSpinnerGif(15000);
			}).fail(function (jqXHR, textStatus, errorThrown) {
				console.log("error");
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
				removeCarSpinnerGif(0);
				return false;
			});
		} else {
			var $cnt = 0;
			var $errObject = {};
			if (confirm_page_postal_code_flag === false) {
				var $tmpObj = {};
				$tmpObj['title'] = 'Invalid Postal Code';
				$tmpObj['text'] = 'Please enter a valid postal code';
				$errObject['err_' + $cnt++] = $tmpObj;
			}
			displayErrorMessage($errObject);
		}
		return true;
	});
	$('#adv_choose_sort').on('change', function (evt) {
		var sort_value = $('#filter').val();
		var $form = $('<form>', {
				action: '/choose',
				method: 'POST',
				enctype: 'multipart/form-data',
			});
		$form.append(createHiddenInput('sort_value', sort_value));
		$(document.body).append($form);
		$form.submit();
	});
})(jQuery, document, window);
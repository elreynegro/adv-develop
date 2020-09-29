(function ($) {
    $('ul.ui-autocomplete').removeAttr('style');
    var pickupval = document.getElementById('pickupValue_loc');
    var dropval = document.getElementById('dropoffValue_loc');


	var locationsData;
	locationsData = $.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'activeBookingLocations',
			},
			async: false,
			dataType: 'json'
		})
		$.when(locationsData).done(function (response) {
			locationsData = response;
		});
	$("#adv_rez_submit_loc").click(function () {
		//$("#toggle_return").css('display', 'block');
	});
	if (pickupval) {
		/*if ($('#pickupValue_loc').val().length != 0) {
			$("#toggle_return").css('display', 'block');
		}*/
	}
	function getLocations() {
		var arr = [];
		for (myLoc in locationsData) {
			if (locationsData.hasOwnProperty(myLoc)) {
				var loc = locationsData[myLoc].L;
				var alias_value = loc.split(";");
				var locToPush = new Array();
				locToPush[0] = locationsData[myLoc].C;
				locToPush.value = loc;
				locToPush.label = alias_value[0];
				arr.push(locToPush);
			}
		}
		return arr;
	}
	String.prototype.replaceAllOcc = function (valToReplace, replacingVal) {
		return this.split(valToReplace).join(replacingVal);
	};
	function cleanCode(arrVal) {
		return arrVal.replaceAllOcc(/[^a-zA-Z\d]/g, "");
	}
	$.ui.autocomplete.filter = function (array, term) {
		term = cleanCode(term);
		var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), 'i');
		return $.grep(array, function (arrVal) {
			var arrRowValue = cleanCode(arrVal.value);
			return matcher.test(arrRowValue) || matcher.test(arrVal);
		});
	};
	if (pickupval || dropval) {
		$('#pickupValue_loc').autocomplete({
			maxShowItems: 10,
			minLength: 2,
			source: getLocations(),
			select: function (event, ui) {
				ui.item.value = ui.item.label;
				var value = ui.item.value;
				$("#rental_location_id_loc").val(ui.item[0]);
				$("#toggle_return").css('display', 'block');
				$("#dropoffValue_loc").val(ui.item.value);
				$("#return_location_id_loc").val(ui.item[0]);
			},
			response: function (event, ui) {
				if (!ui.content.length) {
					var noResult = {
						value: "",
						label: "No locations found"
					};
					ui.content.push(noResult);
				}
			}
		}).focus(function () {
			$(this).select();
			$(this).autocomplete('search', $(this).val())
			$(this).attr('placeholder', 'Please start typing')
			var save_this = $(this);
			window.setTimeout(function () {
				save_this.select();
			}, 100);
		}).blur(function () {
			$(this).attr('placeholder', 'Rent from')
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			var srchTerm = $.trim(this.term).split(/\s+/).join('|');
			var label = item.label;
			return $('<li></li>').data('ui-autocomplete-item', item).append('<a>' + label + '</a>').appendTo(ul);
		};
		$('#pickupValue_loc').autocomplete({
			url: "index.php",
			sortResults: false
		});
		$('#dropoffValue_loc').autocomplete({
			url: "index.php",
			sortResults: false
		});
		$('#dropoffValue_loc').autocomplete({
			maxShowItems: 10,
			minLength: 2,
			source: getLocations(),
			select: function (event, ui) {
				ui.item.value = ui.item.label;
				var value = ui.item.value;
				$("#return_location_id_loc").val(ui.item[0]);
			},
			response: function (event, ui) {
				if (!ui.content.length) {
					var noResult = {
						value: "",
						label: "No locations found"
					};
					ui.content.push(noResult);
				}
			}
		}).focus(function () {
			$(this).select();
			$(this).autocomplete('search', $(this).val())
			$(this).attr('placeholder', 'Please start typing')
			var save_this = $(this);
			window.setTimeout(function () {
				save_this.select();
			}, 100);
		}).blur(function () {
			$(this).attr('placeholder', 'Return to')
		}).data('uiAutocomplete')._renderItem = function (ul, item) {
			var term = $('#dropoffValue_loc').val();
			var label = item.label;
			return $('<li></li>').data('item.autocomplete', item).append('<a>' + label + '</a>').appendTo(ul);
		};

		$(window).resize(function () {
			var isMobile = false;
			try {
				document.createEvent("TouchEvent");
				isMobile = true;
			} catch (e) {
				isMobile = false;
			}
			if (!isMobile) {
				$('#pickupValue_loc').blur();
				$('#dropoffValue_loc').blur();
			}
		});
	}
})(jQuery);


jQuery(function ($) {
	var dateFormat = "mm/dd/yy";
	var pickup_date = jQuery("#pickup_date_loc").datepicker({
			numberOfMonths: 1,
			minDate: 0,
			showButtonPanel: true,
			showOtherMonths: true,
			selectOtherMonths: false,
			currentText: "Today",
			closeText: "x",
			changeMonth: true,
			changeYear: true,
			maxDate: "1y",
			defaultDate: +1
		}).on("change", function () {
			dropoff_date.datepicker("option", "minDate", getDate(this));
			var date2 = jQuery('#pickup_date_loc').datepicker('getDate');
			date2.setDate(date2.getDate() + 2);
			jQuery("#dropoff_date_loc").datepicker('setDate', date2);
		});
	var dropoff_date = jQuery("#dropoff_date_loc").datepicker({
			numberOfMonths: 1,
			changeMonth: true,
			minDate: 0,
			changeYear: true,
			showButtonPanel: true,
			showOtherMonths: true,
			selectOtherMonths: false,
			maxDate: "+1y",
			currentText: "Today",
			closeText: "x",
			defaultDate: +3
		});
	jQuery("#adv_rez_loc.aez-form").scroll(function () {
		dropoff_date.datepicker('hide');
		jQuery('#dropoff_date_loc').blur();
		pickup_date.datepicker('hide');
		jQuery('#pickup_date_loc').blur();
	});
	jQuery(window).resize(function () {
		dropoff_date.datepicker('hide');
		jQuery('#dropoff_date_loc').blur();
		pickup_date.datepicker('hide');
		jQuery('#pickup_date_loc').blur();
	});
	jQuery.datepicker._gotoToday = function (id) {
		var target = jQuery(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			var date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			this._setDateDatepicker(target, date);
			this._selectDate(id, this._getDateDatepicker(target));
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	}
	function getDate(element) {
		var date;
		try {
			date = jQuery.datepicker.parseDate(dateFormat, element.value);
		} catch (error) {
			date = null;
		}
		return date;
	}
        
    $('#adv_rez_loc').on('submit', function(e) {

        e.preventDefault();
        $pickup_date = document.getElementsByName("pickup_date_loc")[0].value;
        $pickup_time = document.getElementsByName("pickup_time_loc")[0].value;
        $dropoff_date = document.getElementsByName("dropoff_date_loc")[0].value;
        $dropoff_time = document.getElementsByName("dropoff_time_loc")[0].value;
        $return_location = document.getElementsByName("dropoffValue_loc")[0].value;
        $rental_location = document.getElementsByName("pickupValue_loc")[0].value;
        $pickup_time = $pickup_time.substr(0, 5) + " " + $pickup_time.substr(5);
        $dropoff_time = $dropoff_time.substr(0, 5) + " " + $dropoff_time.substr(5);
        $datetimeStart = $pickup_date + " " + $pickup_time;
		$datetimeEnd = $dropoff_date + " " + $dropoff_time;
		$vehicle_option = [];
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
        var myPromoCodes = document.getElementsByName('locPromoCodes[]');
        for (var i = 0; i < myPromoCodes.length; i++) {
            promo_codes[i] = myPromoCodes[i].value;
        }
        var express_checkout_val = $("#express_checkout_option_loc").prop('checked') ? 1 : 0;
		var base_url = window.location.protocol + "//" + window.location.hostname + '/';
		console.log($vehicle_option);
        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                action: 'advRezChoose',
                api_provider: document.getElementsByName("api_provider_loc")[0].value,
                rental_location_id: document.getElementsByName("rental_location_id_loc")[0].value,
                return_location_id: document.getElementsByName("return_location_id_loc")[0].value,
                pickup_date: document.getElementsByName("pickup_date_loc")[0].value.replace(/\//ig, ''),
                pickup_time: document.getElementsByName("pickup_time_loc")[0].value,
                dropoff_date: document.getElementsByName("dropoff_date_loc")[0].value.replace(/\//ig, ''),
				dropoff_time: document.getElementsByName("dropoff_time_loc")[0].value,
				age:  renter_age,
                express_checkout_option: express_checkout_val,
				promo_codes: promo_codes,
				vehicleOptions: $vehicle_option,
                advRezNonce: ADV_Rez_Ajax.advRezNonce
            },
            dataType: 'json'
        }).done(function(data) {
            if (data.express_checkout_flag == 1) {
                window.location.href = base_url + 'reserve';
                return false;
            }
            $('<input />').attr('type', 'hidden').attr('name', 'vehicles_html').attr('value', data.htmlString).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'date_of_pickup').attr('value', data.date_of_pickup).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'date_of_return').attr('value', data.date_of_return).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'rental_location').attr('value', data.rental_location).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'rental_location_city').attr('value', data.rental_location_city).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'rental_location_state').attr('value', data.rental_location_state).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'return_to_id').attr('value', data.return_to_id).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'return_location_city').attr('value', data.return_location_city).appendTo('#adv_rez_loc');
            $('<input />').attr('type', 'hidden').attr('name', 'return_location_state').attr('value', data.return_location_state).appendTo('#adv_rez_loc');
            $('#adv_rez_loc').off('submit').submit();
            removeCarSpinnerGif(15000);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            removeCarSpinnerGif(0);
            return false;
        });
        return true;
    });   
    
    function createNewPromoCodeInputLoc(prevNum) {
        var number = Number(prevNum) + 1;
        var $container = $('<div>', {
            class: 'aez-form-item--with-btn'
        });
        var $item = $('<div>', {
            class: 'aez-form-item'
        });
        var $label = $('<label>', {
            for: 'locPromoCodes' + number,
            class: 'aez-form-item__label',
            text: 'Code'
        });
        var $input = $('<input>', {
            id: 'locPromoCodes' + number,
            type: 'text',
            class: 'aez-form-item__input',
            name: 'locPromoCodes[]',
            'data-number': number,
            placeholder: 'Enter Code',
        });
        if ($("input[name*='locPromoCodes']").size() < 1) {
            var $button = $('<span>', {
                class: 'aez-add-btn-loc',
                'data-number': number
            });
        } else {
            var $button = $('<span>', {
                class: 'aez-remove-btn-loc',
                'data-number': number
            });
        }
        $item.append($label).append($input);
        $container.append($item).append($button);
        return $container;
    }    

    function handleAddCodeButtonClick_loc(evt) {
        var $button = $(evt.target);
        var currentNum = $("input[name*='locPromoCodes']").size();
        var $newCodeInput = createNewPromoCodeInputLoc(currentNum);
        var $parent = $button.parents('.aez-form-item--with-btn');
        $button.removeClass('aez-add-btn-loc').addClass('aez-remove-btn-loc');
        $parent.after($newCodeInput);
    }

    function handleRemoveCodeButtonClick_loc(evt) {
        var $button = $(evt.target);
        var $parent = $button.parents('.aez-form-item--with-btn');
        $parent.remove();
        if ($("input[name*='locPromoCodes']").size() == 1 ) {
            lastButton = $('.aez-remove-btn-loc').last();
            lastButton.removeClass('aez-remove-btn-loc').addClass('aez-add-btn-loc');
        }
        $("input[name*='locPromoCodes']").each(function(i, val) {
            $(this).attr('id', 'locPromoCodes' + (i + 1));
            $(this).attr('data-number', (i + 1));
        });
    }
	
    //To display Google Map in Location detail page    
    function getLatAndLng(lat, lng) {
            // Function that formats the latitude and longitude
            return { 
                    lat: Number(lat), 
                    lng: Number(lng),
            };
    }

    function handleGoogleMap(evt) {

        $(".aez-location-google-map").hide();
        $("#google-map-location-page").show();

        var latLng = getLatAndLng($('#google-map-location-page').data('latitude'), $('#google-map-location-page').data('longitude'));
        var map = new google.maps.Map(document.getElementById('google-map-location-page'), {
                zoom: 16,
                center: latLng,
                scrollwheel: false
        });
        var marker = new google.maps.Marker({
                position: latLng,
                map: map
        });
    }   
    
    $('body').on('click', '.aez-add-btn-loc', handleAddCodeButtonClick_loc);
    $('body').on('click', '.aez-remove-btn-loc', handleRemoveCodeButtonClick_loc);
    $('body').on('click', '.aez-location-google-map', handleGoogleMap);
	

});

// A $( document ).ready() block.
jQuery( document ).ready(function($) {
    
        //Load JS after page reload
        $.getScript("//maps.google.com/maps/api/js?key=AIzaSyCcJEu_F9bGxmUc8hw05U0uKLu5l6Qb8JA");
	
	$.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {action: 'advGetLocationInfo',location_code:$("#location_code_hidden").val()},
            cache: false
        })
        .done(function(data) {
            $("#adv_location_info_block").html(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#adv_location_info_block").html("No location info found...");
            return false;
        });

});
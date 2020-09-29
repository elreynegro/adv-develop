/*
 *  ADV Reserve Form Script
 */

(function($, document, window) {
        
    /*
     *  Variable References
     */
    var $signupAdvAwardsForm = $('#adv-awards-sign-up');
    var $signupBookFriendlyForm = $('#book-friendly-sign-up');
    var $signupCorporateForm = $('#sign-up-corporate');
    // var $signupForm = $('#sign-up');
    var $dob = $('#dob');
    var $useProfileAddressCheckbox = $('#use_profile_address');
    var $billingInfoContainer = $('.aez-form-billing-address');
    var $billingInfoInputs = {
        street_address_1: $billingInfoContainer.find('[name=billing_street_address_1]'),
        street_address_2: $billingInfoContainer.find('[name=billing_street_address_2]'),
        postal_code: $billingInfoContainer.find('[name=billing_postal_code]'),
        city: $billingInfoContainer.find('[name=billing_city]'),
        state: $billingInfoContainer.find('[name=billing_state]'),
        country: $billingInfoContainer.find('[name=billing_country]'),
    };
    var useProfileAddress = $useProfileAddressCheckbox.is(':checked');    
    var $rentalLocationDropdown = $('#preferred_rental_location');
    var $dropoffLocationDropdown = $('#preferred_dropoff_location');

    var select2Placeholder = 'Enter a City or Country to find a location...';
    var services_url = '';
    var logging_url = '';
    
    var $signupForm = $('#adv-awards-sign-up');
    var $payTotalCheckboxes = $('input[name="payment_preferences"]');
    var $payNowCheckbox = $('#pay_now_total');
    var $payLaterCheckbox = $('#pay_later_total');
    var isPayNow = $payNowCheckbox.is(':checked');
    var $addMoreCardInfo = $('.add_more_card_info');
    var $moreCardDetailContainer = $("#more_card_detail_container");
    var first_name = document.getElementById('first_name');
    var last_name = document.getElementById('last_name');
    // Get the billing info that is loaded with the page
    var billingInfo = {
            street_address_1: $billingInfoInputs.street_address_1.val(),
            street_address_2: $billingInfoInputs.street_address_2.val(),
            postal_code: $billingInfoInputs.postal_code.val(),
            city: $billingInfoInputs.city.val(),
            state: $billingInfoInputs.state.val(),
            country: $billingInfoInputs.country.val(),
    };

    var eighteenYearsAgo = moment().subtract(18, 'years').toDate();
  
    var dateOfBirth = new Pikaday({
        field: document.getElementById('dob'),
        format: 'MM/DD/YYYY',
        defaultDate: moment('01/01/1980', 'MM/DD/YYYY').toDate(),
        maxDate: moment().subtract(18, 'years').toDate(),
        position: 'bottom right',
        reposition: false,
        theme: 'triangle-theme',
        yearRange: [1900, moment(eighteenYearsAgo).format('YYYY')],
    });

    $("#first_name").change(function(){
        if(first_name.validity.patternMismatch){  
            first_name.setCustomValidity("Please enter a valid First Name (no special characters).");  
        }  
        else {  
            first_name.setCustomValidity("");  
        }    
    });

    $("#last_name").change(function(){
        if(last_name.validity.patternMismatch){  
            last_name.setCustomValidity("Please enter a valid Last Name (no special characters).");  
        }  
        else {  
            last_name.setCustomValidity("");  
        }    
    });

    function parse_query_string(query) {
        var vars = query.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          var key = decodeURIComponent(pair[0]);
          var value = decodeURIComponent(pair[1]);
          // If first entry with this name
          if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
          } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
          } else {
            query_string[key].push(decodeURIComponent(value));
          }
        }
        return query_string;
    }

    var url_string = window.location.search.substring(1);
    var parsed_qs = parse_query_string(url_string);
    if(parsed_qs.firstname !== undefined) {
            document.getElementById("first_name").value = parsed_qs.firstname;
    }
    if(parsed_qs.lastname !== undefined) {
        document.getElementById("last_name").value = parsed_qs.lastname;
    }
    if(parsed_qs.email !== undefined) {
        document.getElementById("email").value = parsed_qs.email;
        document.getElementById("confirm_email").value = "";
    }

    /* Location Search Begins */
 
    function boxGetRentalLocation() {

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
                var select2Url = script_common_full_api_url + '/searchLocationsByBrands';
                services_url = script_common_services_url;
                logging_url = script_common_logging_url;

                $rentalLocationDropdown.select2({
                    placeholder: select2Placeholder,
                    ajax: select2Ajax.config(select2Url),
                    minimumInputLength: 1,
                    language: {
                        inputTooShort: function() {
                            return;
                        },
                    },
                });

                return select2Url;
            });
    }
    
    function boxGetDropoffLocation() {

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
                var select2Url = script_common_full_api_url + '/searchLocationsByBrands';
                services_url = script_common_services_url;
                logging_url = script_common_logging_url;

                $dropoffLocationDropdown.select2({
                    placeholder: select2Placeholder,
                    ajax: select2Ajax.config(select2Url),
                    minimumInputLength: 1,
                    language: {
                        inputTooShort: function() {
                            return;
                        },
                    },
                });

                return select2Url;
            });
    }
    
    boxGetRentalLocation();
    boxGetDropoffLocation();
    
    var select2Ajax = (function() {
        // select2 ajax setup

        var _formatQuery = function(params) {
            // Formats the query used in the url
            var query = {
                LocationBrands: 'Advantage,Europcar',
                LocationSearchString: params.term,
                page: params.page,
                HTTP_ORIGIN: window.location.origin,
                services_url: services_url,
                logging_url: logging_url,
            };

            return query;
        };

        var config = function(url) {
            // Set up the ajax config
            return {
                url: url,
                dataType: 'json',
                delay: 500,
                data: _formatQuery,
                // processResults: function (data, params) {
                // Do things with the results
                // return {
                //   results: data,
                // };
                // },
            };
        };

        return {
            config: config,
        };
    })();

    /***********************
        IE fix for select2
    ************************/
    // After the user clicks on the location value, this code will close the drop down
    $rentalLocationDropdown.select2().on("change", function(e) {
        $rentalLocationDropdown.select2("close"); //call select2
    });
    /* Location Search Ends */ 

    /* Get car specification begins */
    var carSpecificationDropdown = $('#car_specification'); 
    
    
    
    $($rentalLocationDropdown).on("select2:selecting", function(e) { 
        boxGetCarSpecification();
    });
    /* Get car specification ends */
    

    $('#frequent_flyer_airline').change(function() {
        $('#frequent_flyer_number').val('');
        $('#frequent_flyer_number').prop('disabled', true);
        if($(this).val() != '') {
            $('#frequent_flyer_number').prop('disabled', false);
        }
    });
    
    $('#state').select2();
    $('#country').select2();
    $('#billing_state').select2();
    $('#billing_country').select2();
    $('#frequent_flyer_airline').select2(); 
    
    
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
    
        function getLocations() {
	        var arr = [];
	        for (myLoc in locationsData) {
	            if (locationsData.hasOwnProperty(myLoc)) {
	                var loc = locationsData[myLoc].L;
	                var alias_value= loc.split(";");
	                			/*LocationName 
	                			+ ' (' + locationsData[myLoc].City + ', ' 
	                			+ locationsData[myLoc].State + ' '
	                			+ locationsData[myLoc].CountryName 
	                			+  ') - '
	                			+ locationsData[myLoc].LocationCode;*/
            		var locToPush = new Array();
					locToPush[0] = locationsData[myLoc].C;
					locToPush.value = loc;
					locToPush.label = alias_value[0];
	                arr.push(locToPush);
	            }
	        }
	        return arr;
	    }
      var pickup = document.getElementById("pickup_select_dropdown");
        // console.log(pickup);
      if(pickup) {
        $('#pickup_select_dropdown').autocomplete({
            maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {
	        		ui.item.value =ui.item.label;
			        var value = ui.item.value;
                    $("#preferred_rental_location_value").val(ui.item[0]);
                    $("#preferred_dropoff_location_value").val(ui.item[0]);
			        $("#toggle_return").css('display', 'block');
			        $("#dropoff_select_dropdown").val(ui.item.value);
                    boxGetCarSpecification();
	        }, 
// To display "no results found" message if there're no matches
	        response: function(event, ui) {
        			if (!ui.content.length) {
			            var noResult = { value:"",label:"No locations found"};
			            ui.content.push(noResult);
        			}
    		}
		    }).focus(function() {
			    		$(this).autocomplete('search', $(this).val())
			    		$(this).attr('placeholder', 'Please start typing')
                                        $("#preferred_rental_location_value").val('');
                                        $("#preferred_dropoff_location_value").val('');
                                        $('#carClassSelector').html('').removeClass('dd-container');
                                        $(".dropoff_select_dropdown").val('');
			}).blur(function() {
			         $(this).attr('placeholder', 'Rent from');
                     var pre_location = $("#preferred_rental_location_value").val().length;
                     if(pre_location == 0) {
                        $(this).val('');
                        $('#carClassSelector').html('').removeClass('dd-container');
                        $("#preferred_dropoff_location_value").val('');
                        $(".dropoff_select_dropdown").val('');
                     }
			}).data('ui-autocomplete')._renderItem = function( ul, item ) {
			     var srchTerm = $.trim(this.term).split(/\s+/).join ('|');
					var label = item.label;
			      return $( '<li></li>' )
			        .data( 'ui-autocomplete-item', item )
			        .append( '<a>' + label + '</a>' )
			        .appendTo( ul );
 		};
		       
        $('#dropoff_select_dropdown').autocomplete({
	    	maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {
	           	ui.item.value =ui.item.label; 
		        var value = ui.item.value;
		        $("#preferred_dropoff_location_value").val(ui.item[0]);
	        },
// To display "no results found" message if there're no matches
	        response: function(event, ui) {
        				if (!ui.content.length) {
	            			var noResult = { value:"",label:"No locations found" };
	            			ui.content.push(noResult);
        			}
    		}	      
		    }).focus(function() {
			    		$(this).autocomplete('search', $(this).val())
			    		$(this).attr('placeholder', 'Please start typing')
                                        $("#preferred_dropoff_location_value").val('');
			}).blur(function() {
		    		 $(this).attr('placeholder', 'Return to');
                     var pre_location = $("#preferred_dropoff_location_value").val().length;
                     if(pre_location == 0) {
                        $(this).val('');
                     }
			}).data('uiAutocomplete')._renderItem = function( ul, item ) {
					      var term = $('.dropoffValue').val();
					      var label = item.label;
					      return $( '<li></li>' )
					        .data( 'item.autocomplete', item )
					        .append( '<a>' + label + '</a>' )
					        .appendTo( ul );
	 	};
        
        
        $("#pickup_select_dropdown").keydown(function(){
            $("#preferred_rental_location_value").val('');
        });
        $("#dropoff_select_dropdown").keydown(function(){
            $("#preferred_dropoff_location_value").val('');
        });
        
   }      
    
    
    function boxGetCarSpecification() {
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
            .done(function(data) {
                
                $('body').append(createCarSpinnerGif());
                $('#carClassSelector').html('').removeClass('dd-container');
                var preferred_rental_location = $('.preferred_rental_location').val();        
                
                if(preferred_rental_location != null) {
                    
                    $.ajax({
                        url: $ajax_URL,
                        method: 'POST',
                        data: {
                            // wp ajax action
                            action: 'getCarClasses',
                            rental_location_id: preferred_rental_location
                   },
                        dataType: 'json'
                    })
                    .done(function(response) {

						   if (response.status == "error") {
								// Build error message
								var $cnt = 0;
								var $errObject = {};
								var $tmpObj = {};
								$tmpObj['title'] = 'Car classes not found';
								$tmpObj['text'] = 'No car class found for the selected rental location';
								$errObject['err_' + $cnt++] = $tmpObj;

								// Remove Spinner
								removeCarSpinnerGif();

								// Display Error Message
								displayErrorMessage($errObject);
								return false;

							}
					   
                            // Remove Spinner
                           removeCarSpinnerGif();     

                            $('#car_specification').val('');
                            $('#carClassSelector').ddslick('destroy');
                            //$('#carClassSelector').html('').removeClass('dd-container');

                            carClassData = [{text: "--NONE--",  
                                                    value:  '',
                                                    selected:  false,
                                                    description:  '&nbsp;',
                                                    imageSrc:  '',
                                                    }]; 
                            //Dropdown plugin data
                            var carClasses =  response;
                            if(carClasses.length > 0) {
                                $.each( carClasses, function( key, value ) {
                                  carClassData.push({text: carClasses[key].ClassCode,  
                                                    value:  carClasses[key].ClassCode,
                                                    selected:  false,
                                                    description:  carClasses[key].ClassDesc,
                                                    imageSrc:  carClasses[key].ClassImageURL,
                                                    });
                                });
                            }  
                            $('#carClassSelector').ddslick({
                            data: carClassData,
                            width: '100%',
                            selectText: "Select your Car Class",
                            imagePosition: "left",
                            onSelected: function(selectedData) {
                                $('#car_specification').val(selectedData.selectedData.value);
                            }
                            });                          
                    });        
                }
                else {
                    // Remove Spinner
                    removeCarSpinnerGif();
                }                
            });
    }
    

    /* 
     *  Functions
     */

    // Validate an email address, returns true if valid and false if not
    function validateEmail(email) {
        // Regex to test if the email has @ . in it
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // Validate a phone number, returns true if valid and false if not
    function validatePhoneNumber(phonenumber) {
        // Regex for the phone number
        // var phoneregx = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;
        if(phonenumber !== ''){
            var phoneregx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
            return phoneregx.test(phonenumber);
        }
        return true;
    }
    
    // Validate a card name, returns true if valid and false if not
    function validateCardholderName(cardholdername) {
        // Regex for the phone number
        // var phoneregx = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;
        if(cardholdername !== ''){
            var holderregx = /^[a-zA-Z ]*$/
            return holderregx.test(cardholdername);
        }
        return true;
    }

    // Create hidden input fields
    function createHiddenInput(name, value) {
        return $('<input>', {
            type: 'hidden',
            name: name,
            value: value
        });
    }

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

                    $billingInfoInputs.country.children('option')
                            .filter(function() { if ($(this).val() === billingInfo.country) return $(this).attr('selected', true) } )
                            .change();
            } else {
                    // Remove the inputs with the billing info

                    $billingInfoInputs.street_address_1.val('');
                    $billingInfoInputs.street_address_2.val('');
                    $billingInfoInputs.postal_code.val('');
                    $billingInfoInputs.city.val('');
                    $billingInfoInputs.state.val('').change();
                    $billingInfoInputs.country.val('').change();
            }
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
    // Validate US Zip codes
    function validateUSZip(zip) {
	   return /^\d{5}(-\d{4})?$/.test(zip);
    }


    /* 
     *  Event Handlers
     */

    function handleAdvAwardSignUpFormSubmit(evt) {
        evt.preventDefault();

        removeErrMsg();

        var $rentalPolicy = $('#read_location_policy');

        var $inputs = $('#aez_rez_form :input');

        // var $confirmPhoneNumber = $('#confirm_phone_number');
        var $confirmPassword = $('#confirm_password');
        // var $email = $('#email');
        var $password = $('#password');
        var $confirmEmail = $('#confirm_email');

        var $email = $('#email');

        var $phoneNumber = $('#phone_number');

        var $confirmPhoneNumber = $('#confirm_phone_number');
        
        var $postal_code = $('#postal_code');
        
        var $billing_postal_code = $('#billing_postal_code');

        // Check if the phone number and the confirm phone number are the same, if not set flag to false
        var $phoneFlag = true;
        if ($phoneNumber.val() !== $confirmPhoneNumber.val()) {
            $phoneFlag = false;
        }

        // Check if the email and the confirm email are the same, if not set flag to false
        var $emailFlag = true;
        if ($email.val() !== $confirmEmail.val()) {
            $emailFlag = false;
        }

        // Confirm the passwords are the same 
        function confirmPasswords(password, confirm_password) {
            if (password == confirm_password) {
                    return true;
            } else {
                    return false;
                }
        }

        //Payment preferences DOB and Renter Address validation
        var paymentPrefFlag = true;
        var locationPrefFlag = true;
       
        var $payment_preferences = $('#adv-awards-sign-up input[name=payment_preferences]:checked').val();
        
        if($payment_preferences == 1) {
            //Date of birth and renter address validation
            var $dob = $('#dob');
            var $street_address1 = $('#billing_street_address_1');
            //var $street_address2 = $('#street_address2');
            var $postal_code = $('#billing_postal_code');
            var $city = $('#billing_city');
         //   var $state = $('#state');
          //  var $country = $('#country');
            
            if($dob.val() == '' || $.trim($street_address1.val()) == ''  || $.trim($postal_code.val()) == '' || $.trim($city.val()) == '' ) {
                paymentPrefFlag = false;
            }
        }     
        
        if($.trim($('.preferred_dropoff_location').val()) != '' && $.trim($('.preferred_rental_location').val()) == '') {
            locationPrefFlag = false;
        }  
        
        //CC card validation
        var cc_name_input = $('.aez_card_name:visible');
        var cc_number_input = $('.aez_card_number:visible');
        var cc_year_input = $('.aez_card_year:visible');
        var cc_month_input = $('.aez_card_month:visible');
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
        
         //Validate Postal and Biiling ZIP
        var renter_zip_flag = true;
        var billing_zip_flag = true;
        
        // if($postal_code.val() != '') {
        //     renter_zip_flag = validateUSZip($postal_code.val());
        // }

        //if(!$('#use_profile_address').prop('checked')) {
        if($billing_postal_code.val() != '') {
            billing_zip_flag = validateUSZip($billing_postal_code.val());
        }  
        
        // if ($rentalPolicy.is(':checked') && validatePhoneNumber($phoneNumber) && validateEmail($email.val()) && validateEmail($confirmEmail.val()) && $phoneFlag && $emailFlag) {
        if ($rentalPolicy.is(':checked') && validateEmail($email.val()) && validateEmail($confirmEmail.val()) && renter_zip_flag && validatePhoneNumber($phoneNumber.val()) && validatePhoneNumber($confirmPhoneNumber.val()) && billing_zip_flag && $emailFlag && $phoneFlag && paymentPrefFlag && locationPrefFlag&& cc_err_flag && cc_valid_err_flag && cc_expiry_flag && cc_holder_name_err_flag && confirmPasswords($password.val(), $confirmPassword.val())) {

            // Put transition gif in place here
            // Appending it to the body
            $('body').append(createCarSpinnerGif());

            var getLoyaltyUrlPromise, newLoyaltyUrl;
            $ajax_URL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';

            getLoyaltyUrlPromise =
            $.post(
                $ajax_URL, {
                    action: 'advGetLoyaltyUrl'
                },
                function(response) {
                    return response;
                }
            );

            $.when(getLoyaltyUrlPromise)
            .done(function(data_url){

                var $form = $('<form>', {
                    // action: data_url + '/sso.php' ,
                    action: data_url,
                    method: 'POST',
                    enctype: 'multipart/form-data',
                });
                
                //var frequent_flyer_airline = ($.type(document.getElementById("frequent_flyer_airline")) != '')?document.getElementsByName("frequent_flyer_airline")[0].value:''; 
                //var frequent_flyer_number = ($.type(document.getElementById("frequent_flyer_number"))) != '')?document.getElementsByName("frequent_flyer_number")[0].value:''; 

                var cc_card_name = $('[name="name_on_card"]').serializeArray();
                var cc_card_number = $('[name="credit_card"]').serializeArray();
                var cc_expiry_year = $('[name="expiry_year"]').serializeArray();
                var cc_expiry_month = $('[name="expiry_month"]').serializeArray();
                var card_enc_value = $('[name="card_enc_value"]').serializeArray();
          
                $.ajax({
                    url: ADV_Rez_Ajax.ajaxurl,
                    method: 'POST',
                    data: {
                        // wp ajax action
                        action: 'advCreateUser',
                        first_name: document.getElementsByName("first_name")[0].value,
                        last_name: document.getElementsByName("last_name")[0].value,
                        email: document.getElementsByName("email")[0].value,
                        password: document.getElementsByName("password")[0].value,
                        phone_number: document.getElementsByName("phone_number")[0].value,
                        dob: document.getElementsByName("dob")[0].value,
                        EmailOptIn:$('#adv-awards-sign-up input[name=EmailOptIn]:checked').val(),
                        SMSOptIn:$('#adv-awards-sign-up input[name=SMSOptIn]:checked').val(),
                        frequent_flyer_airline: document.getElementsByName("frequent_flyer_airline")[0].value,
                        frequent_flyer_number: document.getElementsByName("frequent_flyer_number")[0].value,
                        preferred_rental_location: document.getElementsByName("preferred_rental_location")[0].value,
                        preferred_dropoff_location: document.getElementsByName("preferred_dropoff_location")[0].value,
                        car_specification: document.getElementsByName("car_specification")[0].value,
                        additional_driver: $('#adv-awards-sign-up input[name=additional_driver]:checked').val(),
                        child_seat: $('#adv-awards-sign-up input[name=child_seat]:checked').val(),
                        hand_controls_left: $('#adv-awards-sign-up input[name=hand_controls_left]:checked').val(),
                        hand_controls_right: $('#adv-awards-sign-up input[name=hand_controls_right]:checked').val(),
                        stroller: $('#adv-awards-sign-up input[name=stroller]:checked').val(),
                        gps: $('#adv-awards-sign-up input[name=gps]:checked').val(),
                        skirack: $('#adv-awards-sign-up input[name=skirack]:checked').val(),
                        payment_preferences: $('#adv-awards-sign-up input[name=payment_preferences]:checked').val(),
                        // street_address1: document.getElementsByName("street_address1")[0].value,
                        // street_address2: document.getElementsByName("street_address2")[0].value,
                        // postal_code: document.getElementsByName("postal_code")[0].value,
                        // city: document.getElementsByName("city")[0].value,
                        // state: document.getElementsByName("state")[0].value,
                        // country: document.getElementsByName("country")[0].value,
                        street_address1: '',
                        street_address2: '',
                        postal_code: '',
                        city: '',
                        state: '',
                        country: '',
                        //is_billing_same_defalut_address: ($('#use_profile_address:checked').val() == 1)?1:0,
                        is_billing_same_defalut_address: 0,
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
                        
                        // values for parameters
                        // Related car rental information
                        // send the nonce along with the request
                        advLogoutNonce: ADV_Rez_Ajax.advLogoutNonce
                    },
                    dataType: 'json'
                })
                .done(function(response_object) {

                    if (typeof response_object === 'object') {
                        var data = response_object
                    } else {
                        var data = JSON.parse(response_object);

                    }
                    
                    if(data.FrqFlyError && data.FrqFlyError == 'ERROR') {
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
// console.log(data);

// console.log(response_object);
                    if ('error' in data) {

                        var $cnt = 0;
                        var $errObject = {};

                        var $tmpObj = {};
                        $tmpObj['title'] = 'User cannot be created';
                        $tmpObj['text'] = data.error;
                        $errObject['err_' + $cnt++] = $tmpObj;

                        displayErrorMessage($errObject);

                        // Remove Spinner
                        removeCarSpinnerGif(0);

                        return false;

                    }


                    // $('<form id="logged_in" method="post" action="' + data_url + '/sso.php' + '"></form>').appendTo('body');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'access_token')
                    //               .attr('value', data.access_token)
                    //               .appendTo('#logged_in');
                     // $('#logged_in').append(createHiddenInput('membernumber', data.memberNumber));
                    // $('#logged_in').append(createHiddenInput('id', data.userGUID));
                    // $('#logged_in').append(createHiddenInput('hash', data.SSO_HASH));
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'membernumber')
                    //               .attr('value', data.memberNumber)
                    //               .appendTo('#logged_in');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'id')
                    //               .attr('value', data.userGUID)
                    //               .appendTo('#logged_in');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'hash')
                    //               .attr('value', data.SSO_HASH)
                    //               .appendTo('#logged_in');
                    // $('#logged_in').submit();

                    $form.append(createHiddenInput('membernumber', data.memberNumber));
                    $form.append(createHiddenInput('id', data.userGUID));
                    $form.append(createHiddenInput('hash', data.SSO_HASH));
                    $form.appendTo('body');
                    $form.submit();
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log("error");
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);

                    // Remove Spinner
                    removeCarSpinnerGif(0);

                    return false;
                });


                return true;
            });
        
        } else {

            var $cnt = 0;
            var $errObject = {};

            if (!$rentalPolicy.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Terms & Conditions';
                $tmpObj['text'] = 'Please read & accept Advantage Expressway terms and conditions to continue.';
                $errObject['err_' + $cnt++] = $tmpObj;
           }

            // Check if the phone number is legit
            if(!validatePhoneNumber($phoneNumber.val())) {
                
                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Phone Number';
                $tmpObj['text'] = 'The phone number you entered is not correct. Please enter a phone number.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the confirm phone number is legit
            if(!validatePhoneNumber($confirmPhoneNumber.val())) {
                
                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Phone Number';
                $tmpObj['text'] = 'The confirm phone number you entered is not correct. Please enter a phone number.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the email is valid
            if (!validateEmail($email.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Email Address';
                $tmpObj['text'] = 'Email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the confirm email is valid
            if (!validateEmail($confirmEmail.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Email Address';
                $tmpObj['text'] = 'Confirm email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the email and confirm email matches.
            if ($emailFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Email Address Mismatch';
                $tmpObj['text'] = 'Email address and confirm email address should match';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the password and confirm password matches.
            if (!confirmPasswords($password.val(), $confirmPassword.val())) {
                var $tmpObj = {};
                $tmpObj['title'] = 'Passwords do not match';
                $tmpObj['text'] = 'The password and confirm password do not match. Please enter the same password in both.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the phone number and confirm phone number matches.
            if ($phoneFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Phone Number Mismatch';
                $tmpObj['text'] = 'Phone number and confirm phone number should match';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            // Check if payment preference "Pay Online" option, DOB and Renter address should be mandatory.
             if (paymentPrefFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Check Date Of Birth and Renter Address';
                $tmpObj['text'] = 'The DOB and Renter Address should be chosen for Pay Online option';
                $errObject['err_' + $cnt++] = $tmpObj;
            }       
            
            //Check preferred renter validation
            if (locationPrefFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Check Preferred Rental Location';
                $tmpObj['text'] = 'Preferred Rental Location should be chosen on selecting Preferred Drop-Off Location';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            //Credit card fill all the details
            if (cc_err_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Credit Card Details';
                $tmpObj['text'] = 'Please provide all details for credit card';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            // Check if the card name is valid
            if (cc_holder_name_err_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Credit Card Name';
                $tmpObj['text'] = 'Please provide valid credit card name';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            //Credit card invalid
            if (cc_valid_err_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Credit Card';
                $tmpObj['text'] = 'Please provide valid credit card number';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            //Credit card expiry invalid
            if (cc_expiry_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Expiration Date';
                $tmpObj['text'] = 'Please provide valid credit card expiration date';
                $errObject['err_' + $cnt++] = $tmpObj;
            }  
            
            // Postal Code is invalid
            if (renter_zip_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Postal Code';
                $tmpObj['text'] = 'Please enter a valid postal code';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Billing Postal Code is invalid
            if (billing_zip_flag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Invalid Billing Postal Code';
                $tmpObj['text'] = 'Please enter a valid billing postal code';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            displayErrorMessage($errObject);
        }

        return true;
    }

    function handleBookFriendlySignUpFormSubmit(evt) {

        evt.preventDefault();

        removeErrMsg();

        var $rentalPolicy = $('#read_location_policy');

        var $inputs = $('#aez_rez_form :input');

        var $phoneNumber = $('#phone_number');

        var $confirmPhoneNumber = $('#confirm_phone_number');
        
        var $email = $('#email');
        var $confirmEmail = $('#confirm_email');
        var $confirm_password = $('#confirm_password');
        var $password = $('#password');
        var $passwordFlag = true;
        if ($password.val() !== $confirm_password.val()) {
            $passwordFlag = false;
        }

        // Check if the email and the confirm email are the same, if not set flag to false
        var $emailFlag = true;
        if ($email.val() !== $confirmEmail.val()) {
            $emailFlag = false;
        }

        var $phoneFlag = true;
        if ($phoneNumber.val() !== $confirmPhoneNumber.val()) {
            $phoneFlag = false;
        }
// console.log('just before check data');
        // if ($rentalPolicy.is(':checked') && validatePhoneNumber($phoneNumber) && validateEmail($email.val()) && validateEmail($confirmEmail.val()) && $phoneFlag && $emailFlag) {
       
        if ($rentalPolicy.is(':checked') && validateEmail($email.val()) && validateEmail($confirmEmail.val()) && validatePhoneNumber($phoneNumber.val()) && validatePhoneNumber($confirmPhoneNumber.val()) && $emailFlag && $phoneFlag && $passwordFlag) {
// console.log('data ok');
            $('body').append(createCarSpinnerGif());
            var getLoyaltyUrlPromise, newLoyaltyUrl;
            $ajax_URL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';

            getLoyaltyUrlPromise =
            $.post(
                $ajax_URL, {
                    action: 'advGetLoyaltyUrl'
                },
                function(response) {
                    return response;
                }
            );

            $.when(getLoyaltyUrlPromise)
            .done(function(data){



                var $form = $('<form>', {
                    // action: data + '/sso.php' ,
                    action: data,
                    method: 'POST',
                    enctype: 'multipart/form-data',
                });
// console.log($form);
                $.ajax({
                    url: ADV_Rez_Ajax.ajaxurl,
                    method: 'POST',
                    data: {
                        // wp ajax action
                        action: 'advCreateBookFriendly',
                        first_name: document.getElementsByName("first_name")[0].value,
                        last_name: document.getElementsByName("last_name")[0].value,
                        email: document.getElementsByName("email")[0].value,
                        password: document.getElementsByName("password")[0].value,
                        MobileNumber: document.getElementsByName("phone_number")[0].value,
                        IATA: document.getElementsByName("IATA")[0].value,

                        // values for parameters
                        // Related car rental information
                        // send the nonce along with the request
                        advLogoutNonce: ADV_Rez_Ajax.advLogoutNonce
                    },
                    dataType: 'json'
                })
                .done(function(response_object) {

                    if (typeof response_object === 'object') {
                        var data = response_object
                    } else {
                        var data = JSON.parse(response_object);

                    }
// console.log(data);

 //console.log(response_object);
                    if ('error' in data) {

                        var $cnt = 0;
                        var $errObject = {};

                        var $tmpObj = {};
                        $tmpObj['title'] = 'User cannot be created';
                        $tmpObj['text'] = data.error.errorMessage;
                        $errObject['err_' + $cnt++] = $tmpObj;

    // console.log($errObject);
                        displayErrorMessage($errObject);
                        removeCarSpinnerGif();
    // alert('error');
                        return false;

                   }
                    // $('<form id="logged_in" method="post" action="' + return_url + '"></form>').appendTo('body');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'access_token')
                    //               .attr('value', data.access_token)
                    //               .appendTo('#logged_in');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'membernumber')
                    //               .attr('value', data.memberNumber)
                    //               .appendTo('#logged_in');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'userGUID')
                    //               .attr('value', data.userGUID)
                    //               .appendTo('#logged_in');
                    // $('<input />').attr('type', 'hidden')
                    //               .attr('name', 'SSO_HASH')
                    //               .attr('value', data.SSO_HASH)
                    //               .appendTo('#logged_in');
                    // $('#logged_in').submit();

                    $form.append(createHiddenInput('membernumber', data.memberNumber));
                    $form.append(createHiddenInput('id', data.userGUID));
                    $form.append(createHiddenInput('hash', data.SSO_HASH));
                    $form.appendTo('body');
                    $form.submit();
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log("error");
                    console.log("jqXHR:" + jqXHR);
                    console.log(jqXHR);
                    console.log("Text Status:" + textStatus);
                    console.log("errorThrown:" + errorThrown);
                    removeCarSpinnerGif();
                    return false;
                });


                return data;
            });
        
        } else {
// console.log('data bad bad bad');

            var $cnt = 0;
            var $errObject = {};

            if (!$rentalPolicy.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Please read the Terms and Conditions.';
                $tmpObj['text'] = 'I agree with the Terms and Conditions of the Advantage Expressway Program.';
                $errObject['err_' + $cnt++] = $tmpObj;
           }

             // Check if the phone number is legit
            if(!validatePhoneNumber($phoneNumber.val())) {
                
                var $tmpObj = {};
                $tmpObj['title'] = 'Phone Number';
                $tmpObj['text'] = 'The phone number you entered is not correct. Please enter a phone number.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            //  // Check if the confirm phone number is legit
            if(!validatePhoneNumber($confirmPhoneNumber.val())) {
                
                var $tmpObj = {};
                $tmpObj['title'] = 'Confirm Phone Number';
                $tmpObj['text'] = 'The confirm phone number you entered is not correct. Please enter a phone number.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the email is valid
            if (!validateEmail($email.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Email';
                $tmpObj['text'] = 'The email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the confirm email is valid
            if (!validateEmail($confirmEmail.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Confirm Email';
                $tmpObj['text'] = 'The confirm email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the email and confirm email matches.
            if ($emailFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Emails do not match';
                $tmpObj['text'] = 'The email and confirm email do not match. Please enter the same email in both.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the phone and confirm phone matches.
            if ($phoneFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Phone Numbers do not match';
                $tmpObj['text'] = 'The phone number and confirm phone number do not match. Please enter the same phone number in both.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            // Check if the password and confirm password matches.
            if ($passwordFlag === false) {
                var $tmpObj = {};
                $tmpObj['title'] = 'Passwords do not match';
                $tmpObj['text'] = 'The password and confirm password do not match. Please enter the same password in both.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            displayErrorMessage($errObject);
        }

        return true;
    }

    function handleCorporateSignUpFormSubmit(evt) {

// console.log('in handleCorporateSignUpFormSubmit');
        evt.preventDefault();

        removeErrMsg();

        var $rentalPolicy = $('#read_location_policy');

        var $inputs = $('#aez_rez_form :input');

        var $email = $('#ContactEmail');

        var $confirmEmail = $('#confirm_ContactEmail');

        // Check if the email and the confirm email are the same, if not set flag to false
        var $emailFlag = true;
        if ($email.val() !== $confirmEmail.val()) {
            $emailFlag = false;
        }

// console.log('just before check data');
        // if ($rentalPolicy.is(':checked') && validatePhoneNumber($phoneNumber) && validateEmail($email.val()) && validateEmail($confirmEmail.val()) && $phoneFlag && $emailFlag) {
        if ($rentalPolicy.is(':checked') && validateEmail($email.val()) && validateEmail($confirmEmail.val()) && $emailFlag) {
// console.log('data ok');
        $('body').append(createCarSpinnerGif());
            var $form = $('<form>', {
                action: '/confirm-corporate-advantage' ,
                method: 'POST',
                enctype: 'multipart/form-data',
            });

            $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data:
                {
                    // wp ajax action
                    action: 'advCreateCorporate',

                    // vars
                    BizName: document.getElementsByName("BizName")[0].value,
                    ContactFirstName: document.getElementsByName("ContactFirstName")[0].value,
                    ContactLastName: document.getElementsByName("ContactLastName")[0].value,
                    ContactEmail: document.getElementsByName("ContactEmail")[0].value,

                    // send the nonce along with the request
                    advlogin: ADV_Rez_Ajax.advlogintNonce

                },
                dataType: 'json'
            })
            .done(function(response_object) {

// console.log('here in done in corp');
// console.log(response_object);

                    if (typeof response_object === 'object') {
                        var data = response_object
                    } else {
                        var data = JSON.parse(response_object);

                    }
// console.log(data);

                    if ('error' in data) {

                        var $cnt = 0;
                        var $errObject = {};

                        var $tmpObj = {};
                        $tmpObj['title'] = 'Corporate Advantage cannot be created';
                        $tmpObj['text'] = data.error;
                        $errObject['err_' + $cnt++] = $tmpObj;
    // console.log($errObject);
                        displayErrorMessage($errObject);
                        removeCarSpinnerGif();
    // alert('error');
                        return false;

                   }

                    $form.append(createHiddenInput('SMBID', data.d.SMBID));
                    $form.append(createHiddenInput('BizName', data.d.BizName));
                    $form.append(createHiddenInput('RateCode', data.d.RateCode));
                    $form.append(createHiddenInput('ContactFName', data.d.ContactFName));
                    $form.append(createHiddenInput('ContactLName', data.d.ContactLName));
                    $form.append(createHiddenInput('ContactEmail', data.d.ContactEmail));
                    $form.append(createHiddenInput('BizCode', data.d.BizCode));
// console.log('just before submit here in done in corp');
                    $form.appendTo('body');
                    $form.submit();

                    // $('<form action="/confirm-corporate-advantage"></form>').appendTo('body').submit();

            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log("error");
                    console.log("jqXHR:" + jqXHR);
                    console.log(jqXHR);
                    console.log("Text Status:" + textStatus);
                    console.log("errorThrown:" + errorThrown);
                    removeCarSpinnerGif();
                    return false;
            })
            ;

            return false;

        } else {
// console.log('data bad bad bad');

            var $cnt = 0;
            var $errObject = {};

            if (!$rentalPolicy.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Please read the Terms and Conditions.';
                $tmpObj['text'] = 'I agree with the Terms and Conditions of the Advantage Expressway Program.';
                $errObject['err_' + $cnt++] = $tmpObj;
           }

            // Check if the email is valid
            if (!validateEmail($email.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Email';
                $tmpObj['text'] = 'The email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the confirm email is valid
            if (!validateEmail($confirmEmail.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Confirm Email';
                $tmpObj['text'] = 'The confirm email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if the email and confirm email matches.
            if ($emailFlag === false) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Emails do not match';
                $tmpObj['text'] = 'The email and confirm email do not match. Please enter the same email in both.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            displayErrorMessage($errObject);
        }

        return true;

    }
    
    function handleUseProfileAddressCheckboxChange(evt) {
        var isChecked = $useProfileAddressCheckbox.is(':checked');

        toggleBillingInfo();
        setBillingInfo(isChecked, $billingInfoContainer, billingInfo);
    }
    
    function handleDateOfBirth() {

        var dobPicked = $(this).val();
        var dobEntered = moment(dobPicked, "MM-DD-YYYY");
        var pick_up_date = moment($("input[name='pickup_date_comparison']").val(), "YYYYMMDD");
        var ago_25_years = moment(pick_up_date).subtract(25, 'years');
        var ago_21_years = moment(pick_up_date).subtract(21, 'years');
        // console.log(dobEntered);
        // console.log(pick_up_date);
        // console.log(ago_25_years);
        // console.log(ago_21_years);

        if (ago_21_years < dobEntered) {
            // console.log('under 21 years old')  ;          
            $('.younger_than_21_message').show('slow');
            $('.younger_than_25_message').hide('slow');
        } else if (ago_25_years < dobEntered) {
            // console.log('under 25 ok ')  ;          
            $('.younger_than_25_message').show('slow');
            $('.younger_than_21_message').hide('slow');
        } else {
            // console.log('over 25 fine')  ;          
            $('.younger_than_25_message').hide('slow');
            $('.younger_than_21_message').hide('slow');    
        }
    }
    
    /****code start for paynow requried ******/
    
     var RequiredFields = (function() {
        // Required Fields For Form Module
        
        // Set the pay later fields to be required
        var PAY_LATER_FIELDS = [
            'first_name',
            'last_name',
            'phone_number',
            'email',
            'confirm_email',
            'password',
            'confirm_phone_number'
        ];

        function removeRequiredLabel() {
            // Find the label and remove the required asterisk
            var $label = $(this).parents('.aez-form-item').find('label');
            var $sup = $label.find('sup');
            return $sup.remove();
        }
		
	/***********************
        IE fix for select2
	************************/
        // After the user clicks on a value in the state drop down, this code will close the drop down
        $('#state').select2().on("change", function(e) {
                $('#state').select2("close"); //call select2
        });
        // After the user clicks on a value in the country drop down, this code will close the drop down
        $('#country').select2().on("change", function(e) {
                $('#country').select2("close"); //call select2
        });
        // After the user clicks on a value in the airline drop down, this code will close the drop down
        $('#billing_state').select2().on("change", function(e) {
                $('#billing_state').select2("close"); //call select2
        });
         // After the user clicks on a value in the airline drop down, this code will close the drop down
        $('#billing_country').select2().on("change", function(e) {
                $('#billing_country').select2("close"); //call select2
        })
         // After the user clicks on a value in the airline drop down, this code will close the drop down
        $('#frequent_flyer_airline').select2().on("change", function(e) {
                $('#frequent_flyer_airline').select2("close"); //call select2
        })

        function setRequiredLabel() {
            // Find the label and append a required asterisk
            var $label = $(this).parents('.aez-form-item').find('label');
            var $sup = $('<sup>', { html: '*' });
            return $label.append($sup);
        }

        function removeRequiredInput() {
            // Remove the required input
            return $(this).removeProp('required');
        }

        function setRequiredInput() {
            // Set the reuqired input
            return $(this).prop('required', true);
        }

        function filterByRequired() {
            // If the element has the prop require return it
            return ($(this).prop('required')) ? $(this) : false;
        }

        function filterByPayNow() {
            // If the element doesn't match one of the ids provided return it
            return (PAY_LATER_FIELDS.indexOf($(this).attr('id')) === -1) ? $(this) : false;
        }

        function filterByPayLater() {
            // If the element matches one of the ids provided return it
            return (PAY_LATER_FIELDS.indexOf($(this).attr('id')) !== -1) ? $(this) : false;
        }

        // Get inputs in reserve form
        var $requiredInputs = $signupForm.find(':input').filter(filterByRequired);
        var $payNowRequiredInputs = $requiredInputs.filter(filterByPayNow);
        var $payLaterRequiredInputs = $requiredInputs.filter(filterByPayLater);

        var setPayNow = function() {
            // Set the required fields with pay now
            return $payNowRequiredInputs
                    .each(setRequiredLabel)
                    .each(setRequiredInput);
        };

        var setPayLater = function() {
            // Set the required fields with pay later
            return $payNowRequiredInputs
                    .each(removeRequiredLabel)
                    .each(removeRequiredInput);
        };

        var set = function(isPayNow) {
            // Determine which required fields to set based on if isPayNow or not
            if (isPayNow) {
                setPayNow();
            } else {
                setPayLater();
            }
        };

        return {
            set: set,
            setPayNow: setPayNow,
            setPayLater: setPayLater,
        };
    })();
    
    function handlePayTotalCheckboxChange() {
        // Get the new value of the $payNowCheckbox
        var isPayNow = $payNowCheckbox.is(':checked');
        // Set the requiredfields based on the current value of the pay now checkbox
        RequiredFields.set(isPayNow);
    }
    
    
    $payTotalCheckboxes.on('change', handlePayTotalCheckboxChange);
    
    
    $('#use_profile_address').on('click', function(){
         var checked = $('#use_profile_address').is(':checked');
        if(checked == false)
        {   
           $('#billing_street_address_1').attr('required', true);
           $('#billing_postal_code').attr('required', true);
           $('#billing_city').attr('required', true);
        }
        else {   
           $('#billing_street_address_1').attr('required', false);
           $('#billing_postal_code').attr('required', false);
           $('#billing_city').attr('required', false);
        }
    });

    /****code end for paynow requried ******/
    
    function handleDateOfBirth18() {

        var dobPicked = $(this).val();
        var dobEntered = moment(dobPicked, "MM-DD-YYYY");
        var pick_up_date = moment($("input[name='pickup_date_comparison']").val(), "YYYYMMDD");
        var ago_25_years = moment(pick_up_date).subtract(25, 'years');
        // var ago_21_years = moment(pick_up_date).subtract(21, 'years');
        var ago_18_years = moment(pick_up_date).subtract(18, 'years');
        // console.log(dobEntered);
        // console.log(pick_up_date);
        // console.log(ago_25_years);
        // console.log(ago_18_years);

        if (ago_18_years < dobEntered) {
            // console.log('under 18 years old')  ;          
            $('.younger_than_18_message').show('slow');
            $('.younger_than_25_message').hide('slow');
            $('.aez-save-and-review').prop('disabled', true);

        } else if (ago_25_years < dobEntered) {
            // console.log('under 25 ok ')  ;          
            $('.younger_than_25_message').show('slow');
            $('.younger_than_18_message').hide('slow');
            $('.aez-save-and-review').prop('disabled', false);
        } else {
            // console.log('over 25 fine')  ;          
            $('.younger_than_25_message').hide('slow');
            $('.younger_than_18_message').hide('slow');    
            $('.aez-save-and-review').prop('disabled', false);
        }
    }    

    var config_total_card = 2;
    function handleAddMoreCards() {
        
        var more_card_count = $(".aez_card_number:visible");
        var total_card_length = more_card_count.length;
        
        if(total_card_length <= config_total_card) {
            var more_card_length = 2;
            if(total_card_length > 0) {
               more_card_length = more_card_count.length + 1;
               total_card_length += 1;
            }

            var class_name = "more_card_" + more_card_length;
            $moreCardDetailContainer.append('<div class="'+class_name+'"></div>');   
            $cardDetailCont = $moreCardDetailContainer.find('.'+class_name+'');
            $cardDetailCont.append($('#more_card_detail_data').html());
            //$cardDetailCont.find('.card-section-title .card_title').text(more_card_length);
            $cardDetailCont.find('.aez-remove-btn-card').attr('id', 'remove_' + class_name);

            $cardDetailCont.find('.aez_card_name_label').attr('for', 'name_on_card_' + more_card_length);
            $cardDetailCont.find('.aez_card_name').attr('id', 'name_on_card_' + more_card_length);
            $cardDetailCont.find('.credit_card_label').attr('for', 'credit_card_' + more_card_length);
            $cardDetailCont.find('.aez_card_number').attr('id', 'credit_card_' + more_card_length);     
            $cardDetailCont.find('.expiry_year_label').attr('for', 'expiry_year_' + more_card_length);
            $cardDetailCont.find('.aez_card_year').attr('id', 'expiry_year_' + more_card_length); 
            $cardDetailCont.find('.aez_card_year').addClass('.expiry_year_dropdown' + more_card_length); 
            $cardDetailCont.find('.expiry_month_label').attr('for', 'expiry_month_' + more_card_length);
            $cardDetailCont.find('.aez_card_month').attr('id', 'expiry_month_' + more_card_length);    
            $cardDetailCont.find('.card_enc_value').attr('id', 'card_enc_value_' + more_card_length);
        }

        if(total_card_length >= config_total_card) {
            $('.add-more-card-btn-container').hide();
        }
        
        $('.'+class_name + ' .aez_card_year').select2();
        $('.'+class_name + ' .aez_card_month').select2();
        
        // After the user clicks on a value in the state drop down, this code will close the drop down
        $('.'+class_name + ' .aez_card_year').select2().on("change", function(e) {
            $('.'+class_name + ' .aez_card_year').select2("close"); //call select2
        });   

        // After the user clicks on a value in the state drop down, this code will close the drop down
        $('.'+class_name + ' .aez_card_month').select2().on("change", function(e) {
            $('.'+class_name + ' .aez_card_month').select2("close"); //call select2
        });          
        
    }
    
    function handleRemoveMoreCards() {
        var $this = $(this);
        var this_id = $($this).attr('id');
        var remove_id = this_id.split('remove_');
        $('.'+remove_id[1]).remove();
        
        var more_card_count = $(".aez_card_number:visible");
        var total_card_length = more_card_count.length;
        
        if(total_card_length < config_total_card) {
            $('.add-more-card-btn-container').show();
        }
        
    }
    
    function handleCardEncrypt() {
        var pubKey = $("#pubKey").val();
        var cNum = $(this).val();
        var this_id = $(this).attr('id');
        var ele_id = this_id.split('credit_card_');
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        var encrypted = encrypt.encrypt(cNum); 
        $('#card_enc_value_'+ele_id[1]).val(encrypted);
    }



 /************************ START cc number display large ***********/
    
    $('body').on('focus', '.aez_card_number', function() {
        var this_local = $(this);
        $(this_local).css("font-size","35px");
    });
    $('body').on('blur', '.aez_card_number', function() {
        var this_local = $(this);
        if(!$(this_local).val()){
            $(this_local).css("font-size",".9em");
        } else {
            $(this_local).css("font-size","35px");
        }
        
    });
    
    /************************ END cc number display large ***********/
     
 

    /*
     *  Event Listeners
     */
    $signupAdvAwardsForm.on('submit', handleAdvAwardSignUpFormSubmit);
    $signupBookFriendlyForm.on('submit', handleBookFriendlySignUpFormSubmit);
    $signupCorporateForm.on('submit', handleCorporateSignUpFormSubmit);
    $dob.on('change', handleDateOfBirth18);
    $useProfileAddressCheckbox.on('change', handleUseProfileAddressCheckboxChange);
    $addMoreCardInfo.on('click', handleAddMoreCards);
    $('body').on('click', '.aez-remove-btn-card', handleRemoveMoreCards);
    $('body').on('blur', '.aez_card_number', handleCardEncrypt);
    
    /*
     *  Function Invocations
     */
    
    // Set the requiredfields based on the current value of the pay now checkbox
    if (!isPayNow) {
        RequiredFields.setPayLater();
    }

    $('.expiry_year_dropdown').select2();
    $('.expiry_month_dropdown').select2();
    
    // After the user clicks on a value in the state drop down, this code will close the drop down
    $('.expiry_year_dropdown').select2().on("change", function(e) {
        $('.expiry_year_dropdown').select2("close"); //call select2
    });   
   
    // After the user clicks on a value in the state drop down, this code will close the drop down
    $('.expiry_month_dropdown').select2().on("change", function(e) {
        $('.expiry_month_dropdown').select2("close"); //call select2
    });     

    //Handle Hand control left right options
	$("input[name='hand_controls_left']").click(function() {
		var hcl_val = $('input[name=hand_controls_left]:checked').val();
		if(hcl_val == 1) {
				$('input[name=hand_controls_right]').filter('[value="0"]').attr('checked', true);
		}
	});	
	$("input[name='hand_controls_right']").click(function() {
		var hcr_val = $('input[name=hand_controls_right]:checked').val();
		if(hcr_val == 1) {
				$('input[name=hand_controls_left]').filter('[value="0"]').attr('checked', true);
		}	
	});
})(jQuery, document, window);
(function($, document, window) {
    /*
     *  Variable References
     */

   

    var $dob = $('#dob');
    var $use_profile_address = $('#use_profile_address');
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
    
    var $updateprofileForm = $('#update_loyalty_profile');
    var $payTotalCheckboxes = $('input[name="payment_preferences"]');
    var $payNowCheckbox = $('#pay_now_total');
    var $payLaterCheckbox = $('#pay_later_total');
    var isPayNow = $payNowCheckbox.is(':checked');
    var $addMoreCardInfo = $('.add_more_card_info');
    var $moreCardDetailContainer = $("#more_card_detail_container");
    var $ccCardEditBtn = $('.cc_card_edit_btn');
    var $expiryMonthOption = $('.expiry_month_dropdown');
    var $expiryYearOption = $('.expiry_year_dropdown');
    

    function toggleLoginInfo() {
            $loginInfoContainer.animate({
            height: 'toggle',
            opacity: 'toggle'
            }, 300);
    }

    // function toggleBillingInfo() {
    //     $billingInfoContainer.animate({
    //     height: 'toggle',
    //     opacity: 'toggle'
    //     }, 300);
    // }

    function setBillingInfo(isChecked, $inputs, info) {
            //if (isChecked) {
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
           // } else {
                    // Remove the inputs with the billing info

            //         $billingInfoInputs.street_address_1.val('');
            //         $billingInfoInputs.street_address_2.val('');
            //         $billingInfoInputs.postal_code.val('');
            //         $billingInfoInputs.city.val('');
            //         $billingInfoInputs.state.val('').change();
            //         $billingInfoInputs.country.val('').change();
            // }
    }
    
    
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
        
        $('#pickup_select_dropdown').autocomplete({
            maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {
	        		ui.item.value =ui.item.label;
			        var value = ui.item.value;
                    $("#preferred_rental_location").val(ui.item[0]);
                    $(".preferred_dropoff_location").val(ui.item[0]);
			        $("#toggle_return").css('display', 'block');
			        $(".dropoff_select_dropdown").val(ui.item.value);
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
			}).blur(function() {
			         $(this).attr('placeholder', 'Rent from');
                     var pre_location = $("#preferred_rental_location").val().length;
                     if(pre_location == 0) {
                        $(this).val('');
                        $('#carClassSelector').html('').removeClass('dd-container');
                        $(".preferred_dropoff_location").val('');
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
        
        $("#pickup_select_dropdown").keydown(function(){
            $("#preferred_rental_location").val('');
        });
        $("#dropoff_select_dropdown").keydown(function(){
            $(".preferred_dropoff_location").val('');
        });
        
       
         $('#dropoff_select_dropdown').autocomplete({
         	    	maxShowItems: 10,
         	    	minLength: 2,
         	        source: getLocations(),
         	        select: function (event, ui) {
         	           	ui.item.value =ui.item.label; 
         		        var value = ui.item.value;
         		        $(".preferred_dropoff_location").val(ui.item[0]);
         	        },
         // To display "no results found" message if there're no matches
         	        response: function(event, ui) {
                 				if (!ui.content.length) {
         	            			var noResult = { value:"",label:"No locations found" };
         	            			ui.content.push(noResult);
                 			}
             		}	      
         		    }).focus(function() {
                     $(this).select();
         		                $(this).autocomplete('search', $(this).val())
         			    		$(this).attr('placeholder', 'Please start typing')
         			}).blur(function() {
         			    		$(this).attr('placeholder', 'Return to');
                                var pre_location = $("#preferred_dropoff_location").val().length;
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
    
    /* 
     *  Functions
     */

   
    // Create hidden input fields
    function createHiddenInput(name, value) {
        return $('<input>', {
            type: 'hidden',
            name: name,
            value: value
        });
    }

    var config_total_card = 2;
    function handleAddMoreCards() {

        var more_card_count = $(".aez_card_year_edit:visible");
        var cc_pre_container_count = $(".cc_pre_container:visible");
        var total_card_length = more_card_count.length;
        if(total_card_length <= config_total_card) {
            var more_card_length = (cc_pre_container_count.length == 0)?1:(cc_pre_container_count.length+1);
            if(total_card_length > 0) {
               more_card_length = more_card_count.length + 1;
               total_card_length += 1;
            }
            
            //Check if container already exist
            if($("." + "more_card_" + more_card_length).length > 0) {
                more_card_length += 1;
            }
            
            var class_name = "more_card_" + more_card_length;
            //$('.'+class_name+':first').remove();
            $moreCardDetailContainer.append('<div class="'+class_name+'"></div>');   
            $cardDetailCont = $moreCardDetailContainer.find('.'+class_name+'');
            //console.log($('#more_card_detail_data').html());
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
            
            if(more_card_count.length < 1) {
                $('.'+class_name+' .aez-remove-btn-card').remove();
            }
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
        
        var more_card_count = $(".aez_card_year_edit:visible");
        var total_card_length = more_card_count.length;
        
        if(total_card_length < config_total_card) {
            $('.add-more-card-btn-container').show();
        }
        
    }
    
    function handleEditCards() {
        var this_id = $(this).data('id');
        $("#cc_pre_container_"+this_id + " .expiry_year_dropdown").prop('disabled', false);
        $("#cc_pre_container_"+this_id + " .expiry_year_dropdown option").prop('disabled', false);
        $("#cc_pre_container_"+this_id + " .expiry_year_dropdown").select2();
        $("#cc_pre_container_"+this_id + " .expiry_month_dropdown").prop('disabled', false);
        $("#cc_pre_container_"+this_id + " .expiry_month_dropdown option").prop('disabled', false);
        $("#cc_pre_container_"+this_id + " .expiry_month_dropdown").select2();
    }
    
    function handleUpdateCardData() {
        var token_id = $(this).data('tokenid');
        $('#cc_card_update_'+$(this).data('id')).val(token_id);
        $('#cc_card_update_'+$(this).data('id')).prop('disabled', false);
        
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
    
    function handleCardDelete() {
        var confirmDelete = confirm('Are you sure want to delete this card? Click ok to proceed.');
        if(confirmDelete) {
            var $this = $(this);
            var card_token = $this.data('token');

            $('body').append(createCarSpinnerGif());
            $.post(ADV_Rez_Ajax.ajaxurl, {
                    action: 'advDeleteCard',
                    CardTokenID:card_token
            }, function (response) {
                $('#cc_pre_container_' + $this.data('id')).remove();
                var more_card_count = $(".aez_card_year_edit:visible");
                var total_card_length = more_card_count.length;

                if(total_card_length < config_total_card) {
                   $('.add-more-card-btn-container').show();
                }
                
                if(more_card_count.length > 0) {
                    $('#more_card_detail_container').find('.aez-remove-btn-card:first-child').remove();
                }                
               removeCarSpinnerGif(0);

            });
        }
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
    $dob.on('change', handleDateOfBirth);
    //$useProfileAddressCheckbox.on('change', handleUseProfileAddressCheckboxChange);
    $addMoreCardInfo.on('click', handleAddMoreCards);
    $('body').on('click', '.aez-remove-btn-card', handleRemoveMoreCards); 
    $ccCardEditBtn.on('click', handleEditCards);
    $expiryMonthOption.on('change', handleUpdateCardData);
    $expiryYearOption.on('change', handleUpdateCardData);
    $('body').on('blur', '.aez_card_number', handleCardEncrypt);
    $('body').on('click', '.aez-delete-btn-card', handleCardDelete);
    
    /* Location Search Begins */
    var $rentalLocationDropdown = $('.preferred_rental_location');
    var $dropoffLocationDropdown = $('.preferred_dropoff_location');

    var select2Placeholder = 'Enter a City or Country to find a location...';
    var services_url = '';
    var logging_url = '';

    
    /*function boxGetRentalLocation() {

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
                var select2Url = dataObj.full_api_url + '/searchLocationsByBrands';
                services_url = dataObj.services_url;
                logging_url = dataObj.logging_url;
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
    }*/
    
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
    
    /*function boxGetDropoffLocation() {

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
                var select2Url = dataObj.full_api_url + '/searchLocationsByBrands';
                services_url = dataObj.services_url;
                logging_url = dataObj.logging_url;

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
    }*/
    
    //boxGetRentalLocation();
    //boxGetDropoffLocation();
    
    /*var select2Ajax = (function() {
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
    })();*/

    /***********************
        IE fix for select2
    ************************/
    // After the user clicks on the location value, this code will close the drop down
    /*$rentalLocationDropdown.select2().on("change", function(e) {
        $rentalLocationDropdown.select2("close"); //call select2
    });*/
    /* Location Search Ends */ 
    
    /* 
     *  Event Handlers
     */

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
        console.log(dobEntered);
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

    /*
     *  Event Listeners
     */


    /* Get car specification begins */
    var carSpecificationDropdown = $('#car_specification'); 
    
/*    function boxGetCarSpecification() {

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
                var preferred_rental_location = $('#preferred_rental_location').val();        
                
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
    
    function boxGetCarSpecification() {
        
        $('#carClassSelector').html('');
        $('#car_specification').val(''); 

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
                var select2Url = dataObj.full_api_url + '/getVehicles';
                services_url = dataObj.services_url;
                logging_url = dataObj.logging_url;
                var preferred_rental_location = $('#preferred_rental_location').val()

                if(preferred_rental_location != '') {

                    //Ajax call to get vehicle class by location
                   // console.log($('#preferred_rental_location').val());
                    $.ajax({
                          type: "GET",
                          url: select2Url,
                          data: 'rental_location_id='+preferred_rental_location+'&services_url='+services_url,
                          dataType: "json",
                          success: function(response) {
                            $('#carClassSelector').html('');
                            $('#car_specification').val('');                                  
                            carClassData = []; 
                            var carClasses =  response.d;

                            if(carClasses.length > 0) {
                                $.each( carClasses, function( key, value ) {
                                    var ksel = false;
                                    if($('#car_specification_val').val() == carClasses[key].ClassCode) {
                                        ksel = true;
                                    }
                                    imageUrl = (carClasses[key].ClassImageURL == '')?carClasses[key].ClassImageURL:'';
                                    carClassData.push({text: carClasses[key].ClassCode,  
                                                    value:  carClasses[key].ClassCode,
                                                    selected:  ksel,
                                                    description:  carClasses[key].ClassDescription,
                                                    imageSrc:  imageUrl,
                                                    });
                                });
                            }  

                            $('#carClassSelector').ddslick({
                            data: carClassData,
                            width: 620,
                            selectText: "Select your Car Class",
                            imagePosition: "left",
                            onSelected: function(selectedData) {
                                $('#car_specification').val(selectedData.selectedData.value);
                            }
                            });                          
                              //$(carSpecificationDropdown).html('<option value="">--Select--</option>');
                              //$(carSpecificationDropdown).select2({data: response.d});
                          }
                    });
                }
                

            });
    }
    
    */
    
    /*$($rentalLocationDropdown).on("select2:selecting", function(e) {
        boxGetCarSpecification();
    });*/
    //boxGetCarSpecification();
    /* Get car specification ends */


    /****code start for paynow requried ******/
    
     var RequiredFields = (function() {
        // Required Fields For Form Module
        
        // Set the pay later fields to be required
        var PAY_LATER_FIELDS = [
            'first_name',
            'last_name',
            'phone',
            'email'
        ];

        function removeRequiredLabel() {
            // Find the label and remove the required asterisk
            var $label = $(this).parents('.aez-form-item').find('label');
            var $sup = $label.find('sup');
            return $sup.remove();
        }

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
        var $requiredInputs = $updateprofileForm.find(':input').filter(filterByRequired);
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
    //$useProfileAddressCheckbox.on('change', handleBillingAddress);
     /*
     *  Function Invocations
     */
    
    // Set the requiredfields based on the current value of the pay now checkbox
    if (!isPayNow) {
        RequiredFields.setPayLater();
    }
    
    //handleBillingAddress();
    
    function handleBillingAddress(){
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
    }
    /****code end for paynow requried ******/

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
    $('.expiry_year_dropdown').select2();
    $('.expiry_month_dropdown').select2();
    $('.aez_card_month_first').select2();
    $('.aez_card_year_first').select2();    
    
    // After the user clicks on a value in the state drop down, this code will close the drop down
    $('.expiry_year_dropdown').select2().on("change", function(e) {
        $('.expiry_year_dropdown').select2("close"); //call select2
    });    
    
    // After the user clicks on a value in the state drop down, this code will close the drop down
    $('.expiry_month_dropdown').select2().on("change", function(e) {
        $('.expiry_month_dropdown').select2("close"); //call select2
    });    

    // After the user clicks on a value in the state drop down, this code will close the drop down
    $('.aez_card_month_first').select2().on("change", function(e) {
        $('.aez_card_month_first').select2("close"); //call select2
    });    
   
    // After the user clicks on a value in the state drop down, this code will close the drop down
    $('.aez_card_year_first').select2().on("change", function(e) {
        $('.aez_card_year_first').select2("close"); //call select2
    });      
    
    var pre_cards = $('.cc_pre_container');
    if(pre_cards.length >= 2) {
        $('.add-more-card-btn-container').hide();
    }
    
})(jQuery, document, window);

jQuery( document ).ready(function($) {
  
    $('#carClassSelector').ddslick({
    data: carClassData,
    width: '100%',
    selectText: "Select your Car Class",
    imagePosition: "left",
    onSelected: function(selectedData) {
        $('#car_specification').val(selectedData.selectedData.value);
    }
    });    
    
    
     if( !$('.preferred_rental_location').val() ) { 
        $('#carClassSelector').html('').removeClass('dd-container');
    }     
    
    
    //if rent from location empty
    $("#pickup_select_dropdown").blur(function(){ 
       var pre_location = $("#pickup_select_dropdown").val().length;
        if(pre_location == 0) {
            $(this).attr('placeholder', 'Rent from');
            $('#preferred_rental_location').val('');
            $('#preferred_dropoff_location').val('');
            $(this).val('');
            $('#carClassSelector').html('').removeClass('dd-container');
            $(".preferred_dropoff_location").val('');
            $(".dropoff_select_dropdown").val('');
        }
    });
    
    $("#dropoff_select_dropdown").blur(function(){ 
       var drop_location = $("#dropoff_select_dropdown").val().length;
        if(drop_location == 0) {
            $(this).attr('placeholder', 'Return to');
            $('#preferred_dropoff_location').val('');
        }
    });
    
    //show edit profile part
    $(".toggle-show-edit-profile").click(function(){
        $(".profile-edit-part-dropdowm").slideDown("slow").delay(100);
        $(".toggle-show-edit-profile").hide();
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
    
});
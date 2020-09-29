/*
 *	ADV Modal Form Script
 */
(function($) {
	/*
	 *	Variables
	 */
	
	var $form = $('#update_rez');
	var $returnToSameCheckbox = $('#return_to_same');
	var $rentalLocationDropdown = $('#rental_location_id');
    var $returnLocationDropdown = $('#return_location_id');
    var $pickupTimeDropdown = $('#pickup_time');
    var $dropoffTimeDropdown = $('#dropoff_time');
	var $reservationEdit = $('.aez-reservation-edit');
    var $reservationEditClose = $('.aez-modal-dialog__close');
    var $modal = $('.aez-reservation-summary-modal');
    var $search = $('.aez-select2-search');
    var $dropoffDate = $('#dropoff_date');
   	var $pickupDate = $('#pickup_date');
    var services_url = '';
    var logging_url = '';

    /* 
     *	Functions
     */

    function getApiUrl() {
	    var getApiUrlPromise, newApiUrl;

	    $ajaxURL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';

	    getApiUrlPromise = $.post(
			$ajaxURL, 
			{
				// wp ajax action
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
                services_url = script_common_services_url;
                logging_url = script_common_logging_url;
	 
			    // Rental Locations Dropdown Select2 Setup
				$rentalLocationDropdown.select2({
			        placeholder: 'Rent from...',
			        ajax: select2Ajax.config(select2Url),
			        minimumInputLength: 1,
			        language: {
			            inputTooShort: function() {
			                return;
			            },
			        },
			    });

				// Return Locations Dropdown Select2 Setup
			    $returnLocationDropdown.select2({
			        placeholder: 'Return to...',
			        ajax: select2Ajax.config(select2Url),
			        minimumInputLength: 1,
			        language: {
			            inputTooShort: function() {
			                return;
			            },
			        },
			    });

	            return newApiUrl;
	        });
	}

    function checkReturnToSame() {
        return $returnToSameCheckbox.is(':checked');
    }

    function toggleReturnToLocation() {
        $returnLocationDropdown.parents('.aez-form-item').animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 300);
    }

    function setReturnLocationDropdown() {
        $("#return_location_id").val($("#rental_location_id").val());
        $("#modify_search_return_loc").val($("#modify_search_pickup_loc").val());
    }

    var select2Ajax = (function() {
        // select2 ajax setup

        var _formatQuery = function(params) {
            // Formats the query used in the url
            var query = {
                LocationBrands: "Advantage,Europcar",
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
                delay: 200,
                data: _formatQuery,
            };
        };

        return {
            config: config,
        };
    })();


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

    /***********************
        IE fix for select2
    ************************/
    var isIE = (function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf("msie") > 0 || ua.indexOf("trident") > 0 ) {
        return true;
    }

    else {
        return false;
    }

    }());
    
    var input_event = !isIE ? 'input' : '';

	 //when the user clicks outside, this code will close the drop down
    /*if (isIE) {
        $('.aez-reservation-summary-modal').click(function(e) {
            $('#rental_location_id').select2("close");
            $('#return_location_id').select2("close"); 
            $pickupTimeDropdown.select2("close");
            $dropoffTimeDropdown.select2("close"); 
        });
    }*/


	/*
	 *	Event Handlers
	 */
	
	function handleCheckboxChange(evt) {
        var isChecked = checkReturnToSame();
        if (isChecked) setReturnLocationDropdown();
        toggleReturnToLocation();
    }

    function handleRentFromChange(evt) {
        var isChecked = checkReturnToSame();

        if (isChecked) setReturnLocationDropdown();
    }

	function handleReservationEditClick(evt) {
    	Modal.open();
        Modal.setVisible();
    }

    function handleReservationEditClose(evt) {
    	Modal.close();
    	Modal.removeVisible();
    }

	function handleUpdateSubmission(evt) {
		evt.preventDefault();

		function delete_cookie( name ) {
		  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

		delete_cookie('search');
		delete_cookie('enhance');

		var promo_codes = [];
	    var myPromoCodes = document.getElementsByName('promo_codes[]');
	    for (var i = 0; i < myPromoCodes.length; i++) {
	        promo_codes[i] = myPromoCodes[i].value;
	    }

	    var fd = new FormData($form.get(0));

        fd.append('action', 'advRezChoose');
        fd.append('advRezNonce', ADV_Rez_Ajax.advRezNonce);
        fd.append('pickup_date', $form.find('#pickup_date').val().replace(/\//ig, ''));
        fd.append('dropoff_date', $form.find('#dropoff_date').val().replace(/\//ig, ''));
        fd.append('from_modal', 'yes');

        $pickup_date = document.getElementsByName("pickup_date")[0].value;
        $pickup_time = document.getElementsByName("pickup_time")[0].value;
        $dropoff_date = document.getElementsByName("dropoff_date")[0].value;
        $dropoff_time = document.getElementsByName("dropoff_time")[0].value;
        $pickup_time = $pickup_time.substr(0, 5) + " " + $pickup_time.substr(5);
        $dropoff_time = $dropoff_time.substr(0, 5) + " " + $dropoff_time.substr(5);
        $datetimeStart = $pickup_date + " " + $pickup_time;
        $datetimeEnd = $dropoff_date + " " + $dropoff_time;
        var $dateNow = new Date();
        var $cnt = 0;
        var $errObject = {};
        var $tmpObj = {};
        removeErrMsg();
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

	    // Put transition gif in place here
        // Appending it to the body
        $('body').append(createCarSpinnerGif());

	    $.ajax({
	            url: ADV_Rez_Ajax.ajaxurl,
	            method: 'POST',
	            data: fd,
	            dataType: 'json',
	            processData: false,
					contentType: false,
	        })
	        .done(function(data) {
	            // Create hidden input for html string
	            var $responseInput = $('<input>', {
	            	type: 'hidden',
	            	name: 'vehicles_html',
	            	value: data.htmlString,
	            });

	            var $responseForm = $('<form>', {
	            	action: '/choose',
	            	method: 'POST',
	            	role: 'form'
	            });

	            $responseForm.append($responseInput);
	        
	            // Append the form to the document body
	            $(document.body).append($responseForm);

	            // Delay submission of form in order to show the car spinner gif
	            $responseForm.submit();
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
	}
        
    var modifySearchPickupLoc = $('#modify_search_pickup_loc');
      // console.log(pickup);
    if(modifySearchPickupLoc) {
		  
		    
        function getLocations() {
            var arr = [];
            for (myLoc in locationsData) {
                if (locationsData.hasOwnProperty(myLoc)) {
                    var loc = locationsData[myLoc].L;
                    var alias_value= loc.split(";");
                    var locToPush = new Array();
                    locToPush[0] = locationsData[myLoc].C;
                    locToPush.value = loc;
                    locToPush.label = alias_value[0];
                    arr.push(locToPush);
                }
            }
            return arr;
        }
		
        $('#modify_search_pickup_loc').autocomplete({
            maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {
	        		ui.item.value =ui.item.label;
			        var value = ui.item.value;
                    $("#rental_location_id").val(ui.item[0]);
					$("#return_location_id").val(ui.item[0]);
					$("#modify_search_return_loc").val(ui.item.value);
	        }, 
            // To display "no results found" message if there're no matches
	        response: function(event, ui) {
        			if (!ui.content.length) {
			            var noResult = { value:"",label:"No locations found"};
			            ui.content.push(noResult);
        			}
    		}
            }).focus(function() {
                $(this).select();
                $(this).autocomplete('search', $(this).val())
                $(this).attr('placeholder', 'Please start typing')
            }).blur(function() {
                $(this).attr('placeholder', 'Rent from');
            }).data('ui-autocomplete')._renderItem = function( ul, item ) {
                var srchTerm = $.trim(this.term).split(/\s+/).join ('|');
                        var label = item.label;
                return $( '<li></li>' )
                .data( 'ui-autocomplete-item', item )
                .append( '<a>' + label + '</a>' )
                .appendTo( ul );
            };
        
        $('#modify_search_return_loc').autocomplete({
            maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {
	        		ui.item.value =ui.item.label;
			        var value = ui.item.value;
					$("#return_location_id").val(ui.item[0]);
	        }, 
            // To display "no results found" message if there're no matches
	        response: function(event, ui) {
        			if (!ui.content.length) {
			            var noResult = { value:"",label:"No locations found"};
			            ui.content.push(noResult);
        			}
    		}
            }).focus(function() {
                $(this).select();
                $(this).autocomplete('search', $(this).val())
                $(this).attr('placeholder', 'Please start typing')
            }).blur(function() {
                        $(this).attr('placeholder', 'Rent to');

            }).data('ui-autocomplete')._renderItem = function( ul, item ) {
                var srchTerm = $.trim(this.term).split(/\s+/).join ('|');
                        var label = item.label;
                return $( '<li></li>' )
                .data( 'ui-autocomplete-item', item )
                .append( '<a>' + label + '</a>' )
                .appendTo( ul );
            };
    }         



	/*
	 *	Event Listeners
	 */
	
	$('.aez-edit-block').on('click', handleReservationEditClick);
	$reservationEdit.on('click', handleReservationEditClick);
	$reservationEditClose.on('click', handleReservationEditClose);
	$returnToSameCheckbox.on('change', handleCheckboxChange);
    $rentalLocationDropdown.on('change', handleRentFromChange);
    $form.on('submit', handleUpdateSubmission);

	/*
	 *	Function Invocations
	 */

	if ($rentalLocationDropdown.val() === $returnLocationDropdown.val()) {
		toggleReturnToLocation();
	}

	/*
	 *	Select 2 Initializations
	 */

    // Rental Time Dropdown Select2 Setup
    $pickupTimeDropdown.select2();

    // Return Time Dropdown Select 2 Setup
    $dropoffTimeDropdown.select2();


    /* 
     *	Pikaday Initializations
     */


	// // Date Pickers
    // var dropoffDate = new Pikaday({
    //     field: $dropoffDate.get(0),
    //     format: 'MM/DD/YYYY',
    //     minDate: moment().toDate(),
    //     position: 'bottom right',
    //     reposition: false,
    // });

    // var pickupDate = new Pikaday({
    //     field: $pickupDate.get(0),
    //     format: 'MM/DD/YYYY',
    //     minDate: moment().toDate(),
    //     position: 'bottom right',
    //     reposition: false,
    //     onSelect: function(e) {
    //         var after2days = '';
    //     	//var dateIsAfter = moment(pickupDate.getDate()).isAfter(moment(dropoffDate.getDate()));
    //         var dateIsAfter = true;
    //         after2days = moment(pickupDate.getDate()).add({days: 2}).toDate();
    //         dropoffDate.setMinDate(pickupDate.getDate());
    //         dropoffDate.gotoDate(pickupDate.getDate());

	// 		if (dateIsAfter) {
	// 			dropoffDate.setDate(after2days);
	// 		}
    //     }
    // });
	

    //getApiUrl();
    
    //hide expanddetail text in choose your car
    $('.aez-reservation-summary__full').click(function(e) {
               
        if ($("#summary_detail_expand").is(":visible")) {
           $("#summary_detail_expand").hide();
        }
        else {
           $("#summary_detail_expand").show()
     }
        
    });

})(jQuery);

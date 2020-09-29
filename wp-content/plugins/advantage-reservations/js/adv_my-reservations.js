/*
 *	My Reservation Script
 *    
 *  Require:
 *  - jQuery
 *  - select2
 *  - select2Helpers
 */

(function($) {

    // Hide the view reservation content div until the user submits the form to view their reservation
    $('#view_reservation_content').hide();

	/* Variable References */
    var $locationsDropdown = $('#locations-dropdown-my-reservations');
    var $viewReservationForm = $('#find_rez_form');
    var services_url = '';
    var logging_url = '';

	/* Event Handlers */
    function handleViewReservationSubmit(evt) {
        evt.preventDefault();
        var rental_loc_id = $('#rental_id').val();
        var $submitButton = $(this).find('button[type="submit"]');
        $submitButton.prop('disabled', true); //set submit button to disabled on submit
        // Create and append the car spinner on submission
        // createCarSpinnerGif() is pulled from a global function
        // on main.js in the theme directory
        $('body').append(createCarSpinnerGif());

        $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data: {
                    // wp ajax action
                    action: 'advViewAndCancelRez',

                    // vars
                    rental_location_id: rental_loc_id,
                    renter_last: document.getElementsByName("renter_last")[0].value,
                    confirm_num: document.getElementsByName("confirm_num")[0].value,
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
                });

                $submitButton.removeProp('disabled'); // remove disabled prop when done

                // Check if there's an error message
                if (data.hasOwnProperty('content')) {
                    if (data.content.content == 'error') {
                        var $cnt = 0;
                        var $errObject = {};
                        var $tmpObj = {};
                        $tmpObj['title'] = 'The data you entered is not in the system.';
                        $tmpObj['text'] = 'Make sure you have the correct Location, Last Name, and Confirmation Number. Please try again.</a>';
                        $errObject['err_' + $cnt++] = $tmpObj;
                        displayErrorMessage($errObject);
                        removeCarSpinnerGif(0);
                        return false;
                    }
                }

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
    }

	/* Functions */
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

    /* Event Listeners */
    $viewReservationForm.on('submit', handleViewReservationSubmit);

    /* Function Invocations */
    getMyReservationEvnApiUrl();
    removeCarSpinnerGif();
     $('ul.ui-autocomplete').removeAttr('style');
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
                    var locToPush = new Array();
                    locToPush[0] = locationsData[myLoc].C;
                    locToPush.value = loc;
                    locToPush.label = alias_value[0];
                    arr.push(locToPush);
                }
            }
            return arr;
        }

String.prototype.replaceAllOcc = function(valToReplace, replacingVal) {
            return this.split(valToReplace).join(replacingVal);
};
function cleanCode (arrVal) {
          return arrVal.replaceAllOcc(/[^a-zA-Z\d]/g, "");
}

//overriding autocomplete search filter
$.ui.autocomplete.filter = function (array, term) {
    term = cleanCode(term);
    var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), 'i');
    return $.grep(array, function (arrVal) {
        // var arrRowLabel = cleanCode(arrVal.label);
        // console.log(arrRowLabel);
        var arrRowValue = cleanCode(arrVal.value);
        //console.log(arrRowValue);
        return matcher.test(arrRowValue) || matcher.test(arrVal);
    });
};

        $('#locations-dropdown-my-reservations').autocomplete({
            maxShowItems: 10,
            minLength: 2,
            source: getLocations(),
            select: function (event, ui) {
                    ui.item.value =ui.item.label;
                    var value = ui.item.value;
                    $("#rental_id").val(ui.item[0]);
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
                        $(this).attr('placeholder', 'Enter a city or country to find a location')
            }).data('ui-autocomplete')._renderItem = function( ul, item ) {
                    var term = $('#locations-dropdown-my-reservations').val();
                    var label = item.label;
                  return $( '<li></li>' )
                    .data( 'ui-autocomplete-item', item )
                    .append( '<a>' + label + '</a>' )
                    .appendTo( ul );
        };


})(jQuery);

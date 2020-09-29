/*
 *	Location Policy Script
 */

(function($) {

	/*
	 *	Variable References
	 */
// console.log('in adv_vehicles_list.js');

    var $locationsDropdown = $('#list-vehicles-dropdown');
    var services_url = '';
    var logging_url = '';

	/*
     *  Functions
     */
    function createHiddenInput(name, value) {
        return $('<input>', {
            type: 'hidden',
            name: name,
            value: value
        });
    }

    function handleLocationsDropdownChange(evt) {
        var $dropdown = $('#rental_id');
        var toSplit = $dropdown.val();

        // Create and append the car spinner on submission
        // createCarSpinnerGif() is pulled from a global function
        // on main.js in the theme directory
        $('body').append(createCarSpinnerGif());
        
        // Create form to submit the RentalLocation data to.
        var $form = $('<form>', {
            action: '/vehicles',
            method: 'POST',
            enctype: 'multipart/form-data',
        });
        // Append the hidden input box RentalLocation to the form
        $form.append(createHiddenInput('RentalLocation', toSplit));
        // Append the form to the document body
        $(document.body).append($form);
        // Submit the form to the Vehicles page
        $form.submit();

        // Remove the car spinner if ten seconds have passed
        removeCarSpinnerGif(15000);
    }

    /***********************
        IE fix for select2
    ************************/
    // After the user clicks on the location, this code will close the drop down
    // $locationsDropdown.select2().on("change", function(e) {
    //     $locationsDropdown.select2("close"); //call select2
    // });
    /*
     *  Event Listeners
     */
    $locationsDropdown.on('change', handleLocationsDropdownChange);

    /*
     *  Function Invocations
     */

    function getVehiclesListEvnApiUrl() {

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

                 var config = {
                    brand_name: dataObj.search_locations,
                    url: select2Url,
                    delay: 500,
                    intl: dataObj.international_locations,
                    services_url: script_common_services_url,
                    logging_url: script_common_logging_url,
                };

                $locationsDropdown = $.ajax({
                    url: ADV_Rez_Ajax.ajaxurl,
                    method: 'POST',
                    data: {
                        action: 'activeBookingLocations',
                        HTTP_ORIGIN: window.location.origin,
                        services_url: services_url,
                        logging_url: logging_url,
                    },
                    async: false,
                    dataType: 'json'
                })
                $.when($locationsDropdown).done(function (response) {
                    locationsDropdown = response;
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
    });
}

    getVehiclesListEvnApiUrl();
    removeCarSpinnerGif();
    $('ul.ui-autocomplete').removeAttr('style');

        // Create the AJAX call that calls activeBookingLocations
        // which sends back the $_SESSION["ActiveBookingLocations"] data 
        // for the To and From drop down locations.
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

        $( "#adv_rez_submit" ).click(function() {
              $("#toggle_return").css('display', 'block');
        });
        if($('#pickupValue').val().length != 0)
        {
            $("#toggle_return").css('display', 'block');
        }
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
String.prototype.replaceAllOcc = function(valToReplace, replacingVal) {
            return this.split(valToReplace).join(replacingVal);
};
function cleanCode (arrVal) {
          // return arrVal.replaceAllOcc(/[°"§\%(|)\[\]{\}=\\?´/`'#<>|,;.:+_\s-]+/g, "");
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

        $('#list-vehicles-dropdown').autocomplete({
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
                        $(this).attr('placeholder', 'Rent from')
            }).data('uiAutocomplete')._renderItem = function( ul, item ) {
                    var label = item.label;
                    var term = $('#list-vehicles-dropdown').val();
                    return $( '<li></li>' )
                    .data( 'item.autocomplete', item )
                    .append( '<a>' + label + '</a>' )
                    .appendTo( ul );
        };
        /*code for page get load after search location in vehicle page */
        var pre_rental_id = $('#rental_id').val();
        $('#list-vehicles-dropdown').on('blur',function(e) {
                var rental_id = $('#rental_id').val();

                if(pre_rental_id != rental_id) {
                        handleLocationsDropdownChange(e);
                }
        });

})(jQuery);

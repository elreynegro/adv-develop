/*
 *	Location Policy Script
 */

(function($) {

	/*
	 *	Variable References
	 */

    var $locationsDropdown = $('#location-policy-dropdown');
    // var select2Url = 'https://qapi.advantage.com/api/v1/searchLocationsByBrands';
    var select2Placeholder = 'Enter a City or Country to find a location...';
    var services_url = '';
    var logging_url = '';

	/*
     *  Functions
     */
    var $locations_policies =  $('.aez-location-policies-dd');
      // Form submission of the Search Form
    // $('.aez-location-policies-dd').on('click', function(e) {
    //     handleLocationsDropdownChange('MCO');

    // });

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

    function handleLocationsDropdownChange(evt) {
        var $dropdown = $(evt.target);

        // Check if the hidden field 'location', which is on the locations-check.php page,
        // is defined or not. If it's undefined, then we use the value of the event target, else
        // we use the value of the hidden field 'location'.
        if (typeof document.getElementsByName("location")[0] != 'undefined') {
            $drop_down_value = document.getElementsByName("location")[0].value;
        } else {
            $drop_down_value = $dropdown.val();
        }

        $adding = "";
        if($("#location_country").length) {
            $location_country = $("#location_country").val();
        }   
        if($("#location_phone").length) {
            $current_number_display = $("#location_phone_display").val();
            $current_number = $("#location_phone").val();
            if($location_country !== "US" && $current_number_display !== "" && $current_number_display !== null && $current_number_display !== undefined) {
                $adding = "<b>SUPPORT</b><br><span>Call <a href='tel:+"+$current_number+"'>"+$current_number_display+"</a></span>";
            }
        }

        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                // wp ajax action
                action: 'advLocationPolicy',

                // values for parameters
                // Rental Location ID
                rental_location_id: $drop_down_value,

                // send the nonce along with the request
                advPolicyNonce: ADV_Rez_Ajax.advPolicyNonce
            },
            dataType: 'json'
        })
        .done(function(data) {
            // Create the policies in the policies div, which will be formated by php in the 
            // locations-check.php page in the ajax_advLocationPolicy_func method.
            $('#policies').html(data);
            if($adding !== "") {
                $("div.aez-helpful-links").html($adding);
            }
        });
    }

    /***********************
        IE fix for select2
    ************************/
    // After the user clicks on the location, this code will close the drop down
    $locationsDropdown.select2().on("change", function(e) {
        $locationsDropdown.select2("close"); //call select2
    });


    /*
     *  Event Listeners
     */
    $locationsDropdown.on('change', handleLocationsDropdownChange);
    $locations_policies.on('click', handleLocationsDropdownChange);

    /*
     *  Function Invocations
     */

    function getLocationPolicyEvnApiUrl() {

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

                $locationsDropdown.select2({
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

    getLocationPolicyEvnApiUrl();

    // $locationsDropdown.select2({
    //     placeholder: select2Placeholder,
    //     ajax: select2Ajax.config(select2Url),
    //     minimumInputLength: 1,
    //     language: {
    //         inputTooShort: function() {
    //             return;
    //         },
    //     },
    // });

})(jQuery);

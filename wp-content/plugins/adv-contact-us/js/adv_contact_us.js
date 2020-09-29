/*
 *  Contact Us Script
 *
 *  Require:
 *  - jQuery
 *  - select2
 *  - select2Helpers
 */

(function($) {	
    /* Variable References */
    var $locationsDropdown = $('#contact-us-locations-dropdown');
    var $contactUsForm = $('#submit_contact_us');
    //$locationsDropdown.on('change', handleLocationsDropdownChange);  
    
    /* Event Handlers */

    // function handleLocationsDropdownChange(evt) {
    //     // If the location on the contact us page changes, then set the value of the hidden field 
    //     // so it appears in the email to customer service.

    //     // Get the title of the element when it gets populate dynamically.
    //     $(document).bind('DOMNodeInserted', function(e) {
    //         var element = e.target;
    //         var $location = $(element).attr("title");
    //         $("#contact-us-hidden-location").val($location);
    //     });
    // }

    /* Event Listeners */

    //$locationsDropdown.on('change', handleLocationsDropdownChange);
    $contactUsForm.on('submit', handleContactUsForm);
    
    function handleContactUsForm(evt) {
//    $('#submit_contact_us').submit(function(event) {
        evt.preventDefault();

        $first_name = document.getElementsByName("first-name")[0].value;
        $last_name = document.getElementsByName("last-name")[0].value;
        $your_email = document.getElementsByName("your-email")[0].value;
        $rental_location_id = document.getElementsByName("rental_location_id")[0].value;
        $rental_location_text = $('.location-policy-dropdown')[1].value;
        $your_message = document.getElementsByName("your-message")[0].value;

        // Create and append the car spinner on submission
        // createCarSpinnerGif() is pulled from a global function
        // on main.js in the theme directory
        $('body').append(createCarSpinnerGif());

        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                // wp ajax action
                action: 'advContactUsCommunication',

                // values for parameters
                first_name: $first_name,
                last_name: $last_name,
                your_email: $your_email,
                rental_location_id: $rental_location_id,
                rental_location_text: $rental_location_text,
                your_message: $your_message,
             // send the nonce along with the request
                advContactUsCommunication: ADV_Rez_Ajax.advContactUsCommunication
            },
            dataType: 'json'
        })
        .done(function(data) {

            removeSuccessMsg();
            removeErrMsg();

            var $cnt = 0;
            var $errObject = {};
            var $tmpObj = {};

            // Reset fields to nothing            
            document.getElementsByName("first-name")[0].value = '';
            document.getElementsByName("last-name")[0].value = '';
            document.getElementsByName("your-email")[0].value = '';
            $('.location-policy-dropdown')[1].value = '';
            document.getElementsByName("your-message")[0].value = '';
            
            var dataObj = JSON.parse(data);
            
            if (dataObj.status == "success") {
                $tmpObj['title'] = 'Thanks for your feedback!';
                $tmpObj['text'] = 'Your feedback has been sent.';
                $errObject['err_' + $cnt++] = $tmpObj;
                displaySuccessMessage($errObject);
            } else {
                $tmpObj['title'] = 'Your feedback could not be sent!';
                $tmpObj['text'] = 'Please try again later.';
                $errObject['err_' + $cnt++] = $tmpObj;
                displayErrorMessage($errObject);
                removeCarSpinnerGif(0);
                return false;
            }

            // Remove Spinner
            removeCarSpinnerGif(0);

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

    //  $locationsDropdown.select2().on("change", function(e) {
    //     $locationsDropdown.select2("close"); //call select2
    // });

    /* Function Invocations */
    // function getContactUsEvnApiUrl() {

    //     var getApiUrlPromise, newApiUrl;
    //     $ajax_URL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';

    //     getApiUrlPromise =
    //         $.post(
    //             $ajax_URL, {
    //                 action: 'advGetApiUrl'
    //             },
    //             function(response) {
    //                 return JSON.parse(response);
    //             }
    //         );

    //     $.when(getApiUrlPromise)
    //         .done(function(data) {
    //             var dataObj = JSON.parse(data);
    //             var select2Url = dataObj.full_api_url + '/searchLocationsByBrands';

    //             // Select2 Config Object
    //             var config = {
    //                 brand_name: dataObj.search_locations,
    //                 url: select2Url,
    //                 delay: 500,
    //                 intl: dataObj.international_locations,
    //                 services_url: dataObj.services_url,
    //                 logging_url: dataObj.logging_url,
    //             };

    //             $locationsDropdown.select2({
    //                 placeholder: 'Enter a City or Country to find a location...',
    //                 ajax: select2Helpers.ajaxConfig(config),
    //                 minimumInputLength: 1,
    //                 language: {
    //                     inputTooShort: function() {
    //                         return;
    //                     },
    //                 },
    //             });

    //             return select2Url;
    //         });
    // }

    // getContactUsEvnApiUrl();

})(jQuery);

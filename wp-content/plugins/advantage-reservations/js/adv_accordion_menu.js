/*
 *	Reserve Accordion Menu Script
 *
 *  Opens and Closes the Reservation Flow Accordion Items
 */

(function($) {

	/*
	 *	Variable References
	 */

    var $accordionTab = $('.aez-extra-header');
    var $locationsPoliciesAccordionTab = $('.aez-location-policies-dd');
    var $locationRentalPolicyLink = $('#location-rental-policy-link');
    var $termsAndConditionsAccordionTab = $('#terms-and-conditions-accordion-tab');
    var $termsAndConditionsLink = $('#terms-and-conditions-link');
    var modal = $('#myModal');                     // Get the modal
    var modal2 = $('#myModal2');                    // Get modal2
    var btn = $('#location-rental-policy-link');  // Get the button that opens the modal
    var btn2 = $('#terms-and-conditions-link');  // Get the button that opens the modal
    var btn3 = $('#cancellation-policy');
    var span1 = $('#close1');           // Get the <span> element that closes the modal
    var span2 = $('#close2');           // Get the <span> element that closes the modal
    var span2 = $('#close2'); 
    var span3 = $('#close3');  

    /*
     *  Functions
     */
    function handleBtnClick(evt) {
        $('#policies .policies_content').html('Loading...');
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
        var modal = document.getElementById('myModal');
         modal.style.display = "block";
       
      // Check the hidden field 'location', which is on the ADVRez_ReservationShortcode.php page,
        // for the value of the location_id
       $rental_location_id = document.getElementsByName("location")[0].value;
       $('body').append(createCarSpinnerGif());
        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                // wp ajax action
                action: 'advReserveConfirmPolicy',

                // values for parameters
                // Rental Location ID
                rental_location_id: $rental_location_id,

                // send the nonce along with the request
                advReservePolicyNonce: ADV_Rez_Ajax.advPolicyNonce
            },
            dataType: 'json'
        })
        .done(function(data) {
            $('#policies .policies_content').html(data);
            if($adding !== "") {
                $("div.aez-helpful-links").html($adding);
            }
			removeCarSpinnerGif();

        });
    }

    function handleBtn2Click(evt) {
        var modal2 = document.getElementById('myModal2');
        modal2.style.display = "block";
        evt.preventDefault();
    }

    function handleBtn3Click(evt) {
        var modal3 = document.getElementById('myModal3');
        modal3.style.display = "block";
        evt.preventDefault();
    }

    function handleSpanClick(evt) {
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
        return $('.modal').data('visible', false);
    }

    function handleSpan2Click(evt) {
        var modal2 = document.getElementById('myModal2');
        modal2.style.display = "none";
        return $('.modal').data('visible', false);
    }

    function handleSpan3Click(evt) {
        var modal3 = document.getElementById('myModal3');
        modal3.style.display = "none";
        return $('.modal').data('visible', false);
    }

    function handleAccordionTabClick(evt) {
        // Open/Close the accordion tab

        var selectedContent = $(this).next();
        var otherContent = $('.aez-extra-content').not(selectedContent);

        selectedContent.slideToggle('400');

        $(this)
            .children('.fa')
            .toggleClass('fa-chevron-down')
            .toggleClass('fa-chevron-up');
    }

    function handleLocationsDropdownChange(evt) {
        $('#policies .policies_content').html('Loading...');
        // Check the hidden field 'location', which is on the ADVRez_ReservationShortcode.php page,
        // for the value of the location_id
        $rental_location_id = document.getElementsByName("location")[0].value;

        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                // wp ajax action
                action: 'advReserveConfirmPolicy',

                // values for parameters
                // Rental Location ID
                rental_location_id: $rental_location_id,

                // send the nonce along with the request
                advReservePolicyNonce: ADV_Rez_Ajax.advPolicyNonce       
            },
            dataType: 'json'
        })
        .done(function(data) {
            // Create the policies in the policies div, which will be formated by php in the ADVRez_ReservationShortcode.php
            // page or the AdvRez_ConfirmShortcode.php in the handleShortcode method for both pages
            $('#policies .policies_content').html(data);
        });
    }

    function handleLocationPolicyLinkClick(evt) {
        evt.preventDefault();

        // trigger the click event of the location policies accordion tab
        $locationsPoliciesAccordionTab.trigger('click');
    }

    function handleTermsAndConditionsLinkClick(evt) {
        evt.preventDefault(); // prevent following the link

        // trigger the click event of the terms and conditions accordion tab
       $termsAndConditionsAccordionTab.trigger('click');

    }

    /*
     *  Event Listeners
     */

    $accordionTab.off('click').on('click', handleAccordionTabClick);
    $locationsPoliciesAccordionTab.on('click', handleLocationsDropdownChange);
    $locationRentalPolicyLink.on('click', handleLocationPolicyLinkClick);
    $termsAndConditionsLink.on('click', handleTermsAndConditionsLinkClick);
    btn.on('click', handleBtnClick);
    btn2.on('click', handleBtn2Click);
    btn3.on('click', handleBtn3Click);
    span1.on('click', handleSpanClick);
    span2.on('click', handleSpan2Click);
    span3.on('click', handleSpan3Click);

})(jQuery);

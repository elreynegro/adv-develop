/*
 * Summary Dropdown Script
 *
 * Open and close the summary dropdown
 */
    
(function($) {
    'use strict';

    var $dropdownSummaryBar = $('.aez-reservation-title-bar');
    var $dropdownCloseText = $('span.aez-all-caps');
    var $arrowReserveSum = $('span.arrow_reserve');
    // Check if it is the reserve page summary bar
    var isReservePage = ($dropdownSummaryBar.data('pageName') === 'reserve');
    var $progress = $('#progress');

    /* 
     *  Functions
     */
    function loadChooseProgress() {

        $('body').append(createCarSpinnerGif());

        var promo_codes = [];
        var myPromoCodes = document.getElementsByName('progress-promo-codes[]');
        for (var i = 0; i < myPromoCodes.length; i++) {
            promo_codes[i] = myPromoCodes[i].value;
        }

        var $form = $('<form>', {
                action: '/choose',
                method: 'POST',
                enctype: 'multipart/form-data',
            });

        $form.appendTo('body');

        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                action: 'advRezChoose',
                api_provider: document.getElementsByName("api_provider")[0].value,
                rental_location_id:  document.getElementById('progress-rental-location').value,
                return_location_id: document.getElementById('progress-return-location').value,
                pickup_date: document.getElementById('progress-pickup-date').value,
                pickup_time: document.getElementById('progress-pickup-time').value,
                dropoff_date: document.getElementById('progress-dropoff-date').value,
                dropoff_time: document.getElementById('progress-dropoff-time').value,
                express_checkout_option: document.getElementById('progress-express-checkout-option').value,
                promo_codes: promo_codes,
                advRezNonce: ADV_Rez_Ajax.advRezNonce
            },
            dataType: 'json'
        }).done(function(data) {

            $form.submit();

        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            removeCarSpinnerGif(0);
            return false;
        });

    }
    
    function setEventListenerByWidth(width, $element, evtHandler) {
        // checks the window width and applies the correct event listener
        if (width < 2000) {
            // add the event listener if < 2000
            $element
                .off('click')
                .on('click', evtHandler);
        } else {
            // else remove the event listener
            $element.off('click');
        }
    }

//only for Reserve page
    function setEventListenerForReserve (width, $element, evtHandler) {
        // checks the window width and applies the correct event listener
        if (width < 910) {
            // add the event listener if < 910
            $element
                .off('click')
                .on('click', evtHandler);
        } else {
            // else remove the event listener
            $element.off('click');
        }
    }

    /*
     *	Event Handlers
     */

    function handleDropdownSummaryClick(evt) {
        // open the dropdown summary
        $('span.arrow_reserve').css("display:none;");
        var contentToShow = $(this).parent().children('.aez-reservation-container');

        contentToShow
            .slideToggle()
            .toggleClass('is-open');

        $(this).parent().toggleClass('is-open');
    }

    function handleCloseTextClick(evt) {
        // click on the close text
        // closes the dropdown summary
        $(this)
            .parent()
            .slideToggle()
            .toggleClass('is-open');

        $(this)
            .parent()
            .parent()
            .toggleClass('is-open');
    }

    function handleWindowResize(evt) {
        // runs on window resize
        // sets the correct event listener based on resized width
        setEventListenerForReserve(
            $(window).width(),
            $dropdownSummaryBar,
            handleDropdownSummaryClick
        );
    }

    /*
     *	Event Listeners
     */

    if (isReservePage) {
        // Checks for the reserve page
        // Adds event listener for resize
        $(window).on('resize', handleWindowResize);
        // Sets the correct event listener based on initial width
        setEventListenerForReserve(
            $(window).width(),
            $dropdownSummaryBar,
            handleDropdownSummaryClick
        );
    } else {
        setEventListenerByWidth(
            $(window).width(),
            $dropdownSummaryBar,
            handleDropdownSummaryClick
        );
    }

    $(window).on('resize', function () {
        if (!isReservePage) {
            setEventListenerByWidth(
                $(window).width(),
                $dropdownSummaryBar,
                handleDropdownSummaryClick
            );
        }
    })

    // Always sets the event listener for the close text click event
    $dropdownCloseText
            .off('click')
            .on('click', handleCloseTextClick);

    $progress.on('click', loadChooseProgress);

})(jQuery);

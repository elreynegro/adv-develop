/*
 *	Promo Code Addition and Removal Script
 *
 *	Include this script where you need to add functionality to the promo codes on a form
 */
(function($) {
    /*
     *  Variables
     */

    var $oldPromos = [];
    var $newPromos = [];
    var $promoCode = $('[name="promo_codes[]"]').filter(':first');
    var $promotCode = $('[name="promot_codes[]"]').filter(':first');

    /*
     *  Functions
     */

    var $currentPromos =  function(){
        $i = 0;
        $getPromos = [];
        $('.aez-validate-promo-code').each(function(){
            $getPromos[$i] = $(this).val();
            $i = $i + 1;
        });
        return $getPromos;
    };
    
	/******* popup code for discount deal on reserve page **********/

    if ( document.location.href.indexOf('reserve') > -1 ) {
        $('.radio_select').click(function(evt) {
             var $coupon_value = $(this).val();
            $promoCode.val($coupon_value);
            $promotCode.val($coupon_value);
            handleValidatePromoCode(evt);
        });
    }

    // if (document.location.href.indexOf('enhance') > -1) {
    //     $('.extra_rewards').click(function(evt) {
    //         var $coupon_value = $(this).val();
    //         var $norate_class = (event.target.id).toLowerCase();
    //         $(this).attr('expressway-selected', true);
            
    //         $promoCode.val($coupon_value);
    //         $promotCode.val($coupon_value);

    //         var withoutR = "without_rate_"+$norate_class;
    //         var withR = "with_rate_"+$norate_class;

    //         var x = document.getElementById(withR);
    //         var y = document.getElementById(withoutR);

    //         if (x.style.display === "none" && y.style.display == "block") {
    //             x.style.display = "block";
    //             y.style.display = "none";
    //         }
    //         else {
    //             y.style.display = "block";
    //             x.style.display = "none";
    //         }

    //         if($(this).attr('data-stackable') == 'false') {
    //             $( ".extra_rewards" ).toggle();
    //         }

    //         handleValidatePromoCode(evt);
    //     });
    // }


    function handleReservePromoCode(evt) {

        $('.pum .popmake-close').trigger('click');
        //var reserve_promocode_apply = $("#reserve_promocode_apply").data('promocode');
        var reserve_promocode_apply = $("#abandonment_promocode").val();
        $('.aez-validate-promo-code:first').val(reserve_promocode_apply);
        handleValidatePromoCode(evt, "yes");

    }

   // var show_discount_popup_flag = $('#show_discount_popup_flag').val();
    //var abandonment_promocode_exists = $('#abandonment_promocode_exists').val();
   // var show_abandonment_popup = $('#show_abandonment_popup').val();

    // if(show_discount_popup_flag == 1) {
    //     callpopupunload();
    // }
    
//     function callpopupunload() {

//         var check_promo_flag = 0;
//         var show_abandonment_popup_flag = 0;
//         $('.aez-validate-promo-code').each(function() {
//             if($.trim($(this).val()) != '') {
//                 check_promo_flag = 1;
//                 return false;
//             }
//         });
//         // If abandonment_promocode_exists is true then set flag to not display popup
//         if (abandonment_promocode_exists == "true") {
//             check_promo_flag = 1;
//         }

//         // If the abandonment popup is blank then don't show the popup
//         if (show_abandonment_popup == "false") {
//             show_abandonment_popup_flag = 1;
//         }

//         // For Cart Abandonment. Restrictions are:
//         // 1. US locations only
//         // 2. Can't use ECAR, CCAR, or XXAR
//         var $location_country = $("#location_country").val();
//         var $ClassCode = $('#class_code').val();
//         var $car_restrictions = ['ECAR', 'CCAR', 'XXAR'];

//         if(check_promo_flag == 0 && show_abandonment_popup_flag == 0 && show_discount_popup_flag == 1 && $location_country == "US" && !$car_restrictions.includes($ClassCode)) { 
//             // Blue conic even only should fire once per hour.
//             //blueConicClient.event.subscribe('exitintent', this, function() {
//                 $('.pum-theme-lightbox').css('display', 'block');
//             //});
//         }
//     }
    // function showPromoPopup() {
    //     // Remove Spinner
    //     removeCarSpinnerGif(0);

    //     if(show_discount_popup_flag == 1) {
    //         $('.pum-theme-lightbox').css('display','block');
    //     }
    //     show_discount_popup_flag = 0;
    // }
    
    $('body').on('click','.pum .popmake-close', function() {
        $('.pum-theme-lightbox').css('display','none');
    });
    
    function popup_close_button() {
        $('.pum .popmake-close').trigger('click');
    }
    function disableReservePopup() {
        $(window).off('beforeunload');
    }
    /*******end  popup code for discount **********/
	
    var $promo1_html = $('#adv_rez .promo-code-section-dynamic .aez-form-item__label').html();    
    function createNewPromoCodeInput(prevNum) {
        // Function that creates a new promo code input
        var number = Number(prevNum) + 1;
        var $container = $('<div>', { class: 'aez-form-item--with-btn promo-code-section-dynamic' });
        var $item = $('<div>', { class: 'aez-form-item' });
        var $label = $('<label>', { for: 'promo_codes' + number, class: 'aez-form-item__label', text:'Code'});
        var $input = $('<input>', {
            id: 'promo_codes' + number,
            type: 'text',
            class: 'aez-form-item__input',
            name: 'promo_codes[]',
            'data-number': number,
            placeholder: 'Enter Code',
        });
        if ( $( "input[name*='promo_code']" ).size() < 1 ) {
            var $button = $('<span>', { class: 'aez-add-btn aez-btn--rounded', 'data-number': number });
        } else {
            var $button = $('<span>', { class: 'aez-remove-btn aez-btn--rounded', 'data-number': number });
        }
        var $space = $('<div>', { class: "" });
        
        $label = $label.html($promo1_html);
        $item.append($label).append($input);
        $container.append($item).append($button).append($space);

        return $container;
    }


    function createNewPromoCodeTotalInput(prevNum) {
        // Function that creates a new promo code input
        var number = Number(prevNum) + 1;
        var $check_side = number % 2;

        if ($check_side == 0 ) {
            $class_to_add = 'aez-form-item--with-btn renter-info add2';
        } else {
            $class_to_add = 'aez-form-item--with-btn renter-info add1';
        }
        var $container = $('<div>', { class:  $class_to_add });
        var $item = $('<div>', { class: 'aez-form-item renter-info-left code' });
        var $label = $('<label>', { for: 'promot_label' + number, name: 'promot_label', class: 'aez-form-item__label', text: 'Code' });
        var $input = $('<input>', {
            id: 'promot_codes' + number,
            type: 'text',
            class: 'aez-form-item__input aez-validate-promo-code',
            name: 'promot_codes[]',
            'data-number': number,
            placeholder: 'Enter Code',
        });
        if ( $( "input[name*='promot_code']" ).size() < 1 ) {
            var $button = $('<span>', { class: 'aez-btn--rounded reserve-code aez-add-btn-total', 'data-number': number });
        } else {
            var $button = $('<span>', { class: 'aez-btn--rounded reserve-code aez-remove-btn-total', 'data-number': number });
        }

        $item.append($label).append($input);
        $container.append($item).append($button);

        return $container;
    }


    /* 
     *	Event Handlers
     */

    function handleAddCodeButtonClick(evt) {
        // Function that handles the click event of an add promo code button
        var $button = $(evt.target);
        var currentNum = $( ".aez-form-item input[name*='promo_code']" ).size();
        var $newCodeInput = createNewPromoCodeInput(currentNum);
        var $parent = $button.parents('.aez-form-item--with-btn');

        $button.removeClass('reserve-code aez-add-btn').addClass('reserve-code aez-remove-btn');
        $parent.after($newCodeInput);
    }

    function handleRemoveCodeButtonClick(evt) {
        // Function that handles the click event of a remove promo code button
        var $button = $(evt.target);
        var $parent = $button.parents('.aez-form-item--with-btn');

        $parent.remove();

        if ($( ".aez-form-item input[name*='promo_code']" ).size() == 1){
            lastButton = $('.aez-remove-btn').last();
            lastButton.removeClass('reserve-code aez-remove-btn').addClass('reserve-code aez-add-btn');
        }

        $( ".aez-form-item input[name*='promo_code']" ).each(function( i, val ) {
            $(this).attr('id', 'promo_code' + (i + 1));
            $(this).attr('data-number', (i + 1));
        });
    }

    function handleAddCodeButtonTotalClick(evt) {
        // Function that handles the click event of an add promo code button
        var $button = $(evt.target);
        var currentNum = $( "input[name*='promot_code']" ).size();
        var $newCodeInput = createNewPromoCodeTotalInput(currentNum);
        var $parent = $button.parents('.aez-form-item--with-btn');
        $button.removeClass('reserve-code aez-add-btn-total').addClass('reserve-code aez-remove-btn-total');
        $parent.after($newCodeInput);
    }

    function handleRemoveCodeButtonTotalClick(evt) {
        
        //handle oldpromos when remove and without reload    
        $oldPromos = $currentPromos();
        $oldPromos = $cleanPromoArray($oldPromos);
        
        // Function that handles the click event of a remove promo code button
        var $button = $(evt.target);
        var $parent = $button.parents('.aez-form-item--with-btn');

        $parent.remove();

        if ($( "input[name*='promot_code']" ).size() == 1){
            lastButton = $('.aez-remove-btn-total').last();
            lastButton.removeClass('reserve-code aez-remove-btn-total').addClass('reserve-code aez-add-btn-total');
        }

        $( "input[name*='promot_code']" ).each(function( i, val ) {
            $(this).attr('id', 'promot_code' + (i + 1));
            $(this).attr('data-number', (i + 1));
        });

        $( "label[name*='promot_label']" ).each(function( i, val ) {
            $(this).attr('for', 'promot_label' + (i + 1));
        });

        $( ".aez-form-item--with-btn" ).each(function( i, val ) {
            $(this).removeClass('add1');
            $(this).removeClass('add2');

            $column_check = i % 2;
            if ($column_check === 0 ) {
                $(this).addClass('add1');
            } else {
                $(this).addClass('add2');
            }


        });

        $( ".aez-btn--rounded" ).each(function( i, val ) {
            $(this).attr('data-number', (i + 1));
        });

        handleValidatePromoCode(evt);
    }

    var $cleanPromoArray = function (arr) {

        arr.forEach( function(s, i) { arr[i] = s.trim(); } );
        var splice_array = [];
        arr.forEach( function(s, i) { 
            if (s.length === 0) {
                splice_array.push(i);
            }
        });

        splice_array.reverse().forEach( function(s, i) { 
            arr.splice(s, 1);
        });
        return arr;
    }


    function handleValidatePromoCode(event, abandonment = "no") {
        disableReservePopup(); 
        enableSubmitReservationButtons();

        $newPromos = $currentPromos();
        $newPromos = $cleanPromoArray($newPromos);        
        $oldPromos = $cleanPromoArray($oldPromos);        
        $newPromos.sort();
        $oldPromos.sort();

        var is_same = $oldPromos.length == $newPromos.length && $oldPromos.every(function(element, index) {
            return element === $newPromos[index]; 
        });
        

        if (! is_same) {
            
            event.preventDefault();
            $('.aez-warning-container').hide();
            removeErrMsg();

            var promo_codes = $currentPromos();
            promo_codes = $cleanPromoArray(promo_codes);

            var classCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
            var rateId = $(".aez-car-option--active input[name='rate_id']").data('rateId');
            var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
            var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
            var dob = $('#dob').val();
            var pickupDate = $('#pickup_date_comparison').val();
            var payType = $("#submit-reserve input[name='pay_total']:checked").val();

            var vehicleOptions = [];
            var oldtotal=$('#last_total_price').val();
            var cnt = 0;
            $('.vehicle_options_checkbox').each(function(i) {
                if ($(this).is(':checked')) {
                    vehicleOptions[cnt] = $(this).val();

                    cnt++;
                    // vehicleOptions = $(this).val();
                    // Do stuff with checked box
                }
            });

            var ClassCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
            var RateID = $(".aez-car-option--active input[name='rate_id']").data('rateId');
            var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
            var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');

            var formData = {
                promo_codes: promo_codes,
                action: 'advRezPromoCheck',
                advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
                vehicleOptions: vehicleOptions,
                ClassCode: ClassCode,
                RateID: RateID,
                vehicleEnhanceType: vehicleEnhanceType,
                vehicleIndex: vehicleIndex,
                dob: dob,
                pickupDate: pickupDate,
                payType: payType,
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                email: $('#email').val(),
                phone_number: $('#phone_number').val(),
                street_address_1: $('#street_address_1').val(),
                street_address_2: $('#street_address_2').val(),
                city: $('#city').val(),
                state: $('#state').val(),
                postal_code: $('#postal_code').val(),
                abandonment: abandonment,
                last_total:oldtotal,
                reservesummaryupdated_without_pagereload:1
            };
            // Create and append the car spinner on submission
            // createCarSpinnerGif() is pulled from a global function
            // on main.js in the theme directory
            $('body').append(createCarSpinnerGif());

            $.ajax({
                    url: ADV_Rez_Ajax.ajaxurl,
                    method: 'POST',
                    data: formData,
                    dataType: 'json'
                })
                  .done(function(data) {
                 
                    removeErrMsg();
                    removeCarSpinnerGif(0);
                    var resvalue = jQuery.parseJSON(data);                    
                 
                     //show success message for only if  price updated
                   if(parseFloat($('#last_total_price').val())!=parseFloat(resvalue.vehicle_counter_total)) {
                       
                     $( ".showmessage" ).show( 0 ).delay( 2000 ).slideUp( 1000 );
                    }
                    //Display promo warning message html
                    $("#primary").append(resvalue.promo_msg_html);
                    
                    //Update Reserve Summary Update
                     $(".aez-list").html(resvalue.updated_content);
                     
                     //Update Promo code HTML
                     $(".promocode").html(resvalue.promocode_section_html);
                     
                     //Update  modify option popup Promocode HTML
                     $(".modify-option-promos").html(resvalue.modify_options_promos);
                     
                     
                    //vehicle total both prepaid and counter price without page reload
                    $("#vehicle_prepaid_total").html(resvalue.vehicle_prepaid_total);
                    $("#vehicle_counter_total").html(resvalue.vehicle_counter_total);
                    $("#vehicle_prepaid_total_title").html(resvalue.vehicle_prepaid_total);
                    $("#vehicle_counter_total_title").html(resvalue.vehicle_counter_total); 


                    //remove promocode manually in the reserve form, it auto remove same option in the modify option section begins
                    //currently manually removed promocode
                    if($oldPromos != '' && ($oldPromos.length > $newPromos.length)){
                        var diff = $($oldPromos).not($newPromos).get();
                        triggerExpresswayOptions(diff);
                    } else if($oldPromos.length < $newPromos.length) {
                        var diff = $($newPromos).not($oldPromos).get();
                        triggerExpresswayOptions(diff);
                    } else if($oldPromos.length == $newPromos.length){
                        var diff1 = $oldPromos.filter(function(obj) { return $newPromos.indexOf(obj) == -1; });
                        var diff2 = $newPromos.filter(function(obj) { return $oldPromos.indexOf(obj) == -1; });

                        var diff = diff1.concat(diff2);
                        triggerExpresswayOptions(diff1);
                        triggerExpresswayOptions(diff2);
                    }

                    
                    var validPromocodeArray = [];
                    $(".aez-validate-promo-code").each(function() {
                        validPromocodeArray.push($(this).val());
                    });
                    if(validPromocodeArray != ''){
                        recheckModifyOptions(validPromocodeArray,$newPromos);
                    }
                    
                    validPromoString = validPromocodeArray.join();
                    $('#expressway_promo_codes_list').val(validPromoString);
                    //remove promocode manually in the reserve form, it auto remove same option in the modify option section end
					
					// If abandonment promo code 2 is setnull and expresswayFlowPromos has a promo code in it then 
					// then don't display the popup after add promos in promo code section
					var check_promo_flag = 0;

					$('.aez-validate-promo-code').each(function() {
						if($.trim($(this).val()) != '') {
							check_promo_flag = 1;
							return false;
						}
					});			
					
					if (check_promo_flag == 1) {
						blueConicClient.event.subscribe('exitintent', this, function() {
							$('.pum-theme-lightbox').css('display', 'none');
						});
					}						
               })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("error");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);

                // Remove the car spinner gif on failed post
                // Function comes from main.js
                removeCarSpinnerGif(0);

                return false;
            });

        return false;

        }
        
    }

    function recheckModifyOptions(validPromocodeArray,$newPromos){
        var temp_arr = [];
        $(".expressway-options-btn").each(function() {
            var promo_code = $(this).data('promo_code').toString();
            
            //check the current promocode is match with entered promocode
            var index = $.inArray(promo_code, validPromocodeArray);
            var index1 = $.inArray(promo_code, temp_arr);
            var index2 = $.inArray(promo_code, $newPromos);
            
            if(index2 !== -1 && index !== -1 && (index1 == -1)){
                if(!$(this).hasClass('btn_list_benifits_active')){
                    $(this).trigger("click");
                }
                temp_arr.push(promo_code);
            } if(index2 !== -1 && index == -1){
                if(!$(this).hasClass('btn-grey')){
                    $(this).trigger("click");
                }   
            }
        });
    }

    function triggerExpresswayOptions(diff){
        var temp_arr = [];
        $(".expressway-options-btn").each(function() {
            var promo_code = $(this).data('promo_code').toString();
            
            //check the current promocode is match with entered promocode
            var index = $.inArray(promo_code, diff);
            var index1 = $.inArray(promo_code, temp_arr);

            if ((index !== -1) && (index1 == -1)) {
                if(!$(this).hasClass('btn-grey')){
                    $(this).trigger("click");
                    temp_arr.push(promo_code);
                }
            }
        });
    }

    function handleFocusPromoCodeField(event) {

        event.preventDefault();
        disableSubmitReservationButtons();
           
    }

    function handleOver18(event) {

        enableSubmitReservationButtons();

    }

    function handleUnder18(event) {

        disableSubmitReservationButtons();

    }
    function enableSubmitReservationButtons(evt) {
        $('#submit-reserve-button1').show();
        $('#submit-reserve-button1-disabled').hide();
        $('#submit-reserve-button2').show();
        $('#submit-reserve-button2-disabled').hide();
    }

    function disableSubmitReservationButtons() {
        $('#submit-reserve-button1').hide();
        $('#submit-reserve-button1-disabled').show();
        $('#submit-reserve-button2').hide();
        $('#submit-reserve-button2-disabled').show();
    }
    
    function reloadSummaryPrice() {
        // Create and append the car spinner on submission
        // createCarSpinnerGif() is pulled from a global function
        // on main.js in the theme directory
        $('body').append(createCarSpinnerGif());

        var promo_codes = $currentPromos();
        promo_codes = $cleanPromoArray(promo_codes);

        var classCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
        var rateId = $(".aez-car-option--active input[name='rate_id']").data('rateId');
        var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
        var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
        var dob = $('#dob').val();
        var pickupDate = $('#pickup_date_comparison').val();
        var payType = $("#submit-reserve input[name='pay_total']:checked").val();

        var vehicleOptions = [];

        var cnt = 0;
        $('.vehicle_options_checkbox').each(function(i) {
            if ($(this).is(':checked')) {
                vehicleOptions[cnt] = $(this).val();

                cnt++;
                // vehicleOptions = $(this).val();
                // Do stuff with checked box
            }
        });

        var ClassCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
        var RateID = $(".aez-car-option--active input[name='rate_id']").data('rateId');
        var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
        var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');


        var formData = {
            promo_codes: promo_codes,
            action: 'advRezPromoCheck',
            advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
            vehicleOptions: vehicleOptions,
            ClassCode: ClassCode,
            RateID: RateID,
            vehicleEnhanceType: vehicleEnhanceType,
            vehicleIndex: vehicleIndex,
            dob: dob,
            pickupDate: pickupDate,
            payType: payType,
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            email: $('#email').val(),
            phone_number: $('#phone_number').val(),
            street_address_1: $('#street_address_1').val(),
            street_address_2: $('#street_address_2').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            postal_code: $('#postal_code').val()
        };                 

        var pick_up_date = $("input[name='pickup_date_comparison']").val();
        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: formData,
            dataType: 'json',
            cache: false
        })
        .done(function(data) {
            window.location.reload();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            // Remove the car spinner gif on failed post
            // Function comes from main.js
            removeCarSpinnerGif(0);

            return false;
        });
        return false;            
    }    
    
	
/*********** End code for Update Reserve page when removing or adding a promo code *********/	


    //Update old promo code
    function updateOldPromoCodes() {
        $oldPromos = $currentPromos();
        $oldPromos = $cleanPromoArray($oldPromos);
    }    
    
    var renterAgeOld = $("#submit-reserve #renter_age").val();
    
    //Handle renter age to update 
    function handleRenterAge() {
        
            disableReservePopup(); 
            
            var renterAge = $("#submit-reserve #renter_age").val();
            
            //Skip page reload begins
            var reloadFlag = 1;
            if(renterAge == renterAgeOld)
                renterAge = 0;
            else if(renterAgeOld < 25 && renterAge < 25) {
                renterAge = 0;
            }

            if(renterAge == 0)
                return false;
            //Skip page reload ends
            
            // Set up variables for the error messages
            var $cnt = 0;
            var $errObject = {};
            var $tmpObj = {};;
            removeErrMsg();
            
            // Create and append the car spinner on submission
            // createCarSpinnerGif() is pulled from a global function
            // on main.js in the theme directory
            $('body').append(createCarSpinnerGif());

            var promo_codes = $currentPromos();
            promo_codes = $cleanPromoArray(promo_codes);

            var classCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
            var rateId = $(".aez-car-option--active input[name='rate_id']").data('rateId');
            var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
            var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
            var dob = $('#dob').val();
            var pickupDate = $('#pickup_date_comparison').val();
            var payType = $("#submit-reserve input[name='pay_total']:checked").val();
            renterAgeOld = renterAge;
            var vehicleOptions = [];

            var cnt = 0;
            $('.vehicle_options_checkbox').each(function(i) {
                if ($(this).is(':checked')) {
                    vehicleOptions[cnt] = $(this).val();

                    cnt++;
                    // vehicleOptions = $(this).val();
                    // Do stuff with checked box
                }
            });

            var ClassCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
            var RateID = $(".aez-car-option--active input[name='rate_id']").data('rateId');
            var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
            var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
			var useProfileInfo = $("#use_member_profile_info");
			var useProfileAttr = $(useProfileInfo).attr('user-opt-checked');
			if(useProfileAttr == "true") {
				$(useProfileInfo).prop('checked', false);
			}
			
			var formData = {
                promo_codes: promo_codes,
                action: 'advRezPromoCheck',
                advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
                vehicleOptions: vehicleOptions,
                renterAge:renterAge,
                ClassCode: ClassCode,
                RateID: RateID,
                vehicleEnhanceType: vehicleEnhanceType,
                vehicleIndex: vehicleIndex,
                pickupDate: pickupDate,
                payType: payType,
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                email: $('#email').val(),
                phone_number: $('#phone_number').val(),
                street_address_1: $('#street_address_1').val(),
                street_address_2: $('#street_address_2').val(),
                city: $('#city').val(),
                state: $('#state').val(),
                postal_code: $('#postal_code').val(),
		use_profile_info: $(useProfileInfo).prop('checked')
            };                 
            
            var pick_up_date = $("input[name='pickup_date_comparison']").val();
            $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data: formData,
                dataType: 'json',
                cache: false
            })
            .done(function(data) {
                window.location.reload();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("error");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);

                // Remove the car spinner gif on failed post
                // Function comes from main.js
                removeCarSpinnerGif(0);

                return false;
            });
            return false;
    }
    
    /*
     *	Event Listeners
     */

    $('body').on('click', '.aez-add-btn', handleAddCodeButtonClick);
    $('body').on('click', '.aez-remove-btn', handleRemoveCodeButtonClick);

    $('body').on('click', '.aez-add-btn-total', handleAddCodeButtonTotalClick);
    $('body').on('click', '.aez-remove-btn-total', handleRemoveCodeButtonTotalClick);

    $('body').on('blur', '.aez-validate-promo-code', handleValidatePromoCode);
    $('body').on('focusin', '.aez-validate-promo-code', handleFocusPromoCodeField);
    $('body').on('click', '.aez-reserve-page-promocode', handleReservePromoCode);
    $('body').on('click', '.reserve-popup-close', popup_close_button);
    
    $('body').on('click', '.aez-validate-promo-code', updateOldPromoCodes);
    $('body').on('change', '#submit-reserve #renter_age', handleRenterAge);

 	
    $(document).ready(function() {
        
        /* On change DOB update price based on renters age */
        var dob_val = $('#dob').val();
        var dobPageLoad = dob_val;
        var dobPageLoadVal = moment(dobPageLoad, "MM-DD-YYYY");
        
        $('.aez-reservation-form #dob').on('blur', function(event) {
            disableReservePopup(); 
            var curr_val = $('#dob').val();
            var cFlag = 0;
            if(curr_val == dob_val) {
                return false;
            }

            var dobOld = moment(dob_val, "MM-DD-YYYY");

            dob_val = curr_val;

            var dobPicked = $('#dob').val();
            var dobEntered = moment(dobPicked, "MM-DD-YYYY");
            var pick_up_date = moment($("input[name='pickup_date_comparison']").val(), "YYYYMMDD");
            var ago_18_years = moment(pick_up_date).subtract(18, 'years');
            var ago_21_years = moment(pick_up_date).subtract(21, 'years');
            var ago_25_years = moment(pick_up_date).subtract(25, 'years');
            
            // Set up variables for the error messages
            var $cnt = 0;
            var $errObject = {};
            var $tmpObj = {};;
            removeErrMsg();
            
            //Avoid invalid dob by enter through keyboard instead of datepicker
            if ((dobEntered._d=='Invalid Date')&&($.trim(dobPicked) != '')) {

                handleUnder18(event);;
                cFlag = 1;
                $tmpObj['title'] = 'Invalid Date';
                $tmpObj['text'] = 'Please enter valid date';
                $errObject['err_' + $cnt++] = $tmpObj;
                displayErrorMessage($errObject);
                removeCarSpinnerGif(0);
                return false;
            }

            if (ago_21_years < dobEntered) {
                handleUnder18(event);
                cFlag = 1;
                return false;
            }

            handleOver18(event);
            
            if (ago_21_years < dobEntered && ago_21_years < dobOld) {
                return false;
            } else if (ago_21_years >= dobEntered && ago_21_years >= dobOld && ago_25_years < dobEntered && ago_25_years < dobOld) {
                return false;
            } else if (ago_25_years >= dobEntered && ago_25_years >= dobOld) {
                return false;
            }
            
            if(cFlag == 0) {
                if (ago_25_years >= dobPageLoadVal && ago_25_years  >= dobEntered) {
                    return false;
                }
                if (ago_21_years > dobPageLoadVal && ago_21_years  > dobEntered && ago_25_years < dobPageLoadVal && ago_25_years  < dobEntered) {
                    return false;
                }                
            }
            
            if($.trim(dobPageLoad) == '') {
                if (ago_25_years >= dobEntered) {
                    return false;
                }
            }       
            
            if($.trim(dobPicked) == '') {
                if ($.trim(dobPageLoad) == '' || ago_25_years >= dobPageLoadVal || ago_21_years < dobPageLoadVal) {
                    return false;
                }
            }      
            
            /*if (ago_18_years < dobEntered && ago_18_years < dobOld) {
                return false;
            } else if (ago_18_years >= dobEntered && ago_18_years >= dobOld && ago_21_years < dobEntered && ago_21_years < dobOld) {
                return false;
            } else if (ago_21_years >= dobEntered && ago_21_years >= dobOld && ago_25_years < dobEntered && ago_25_years < dobOld) {
                return false;
            } else if (ago_25_years >= dobEntered && ago_25_years >= dobOld) {
                return false;
            }*/

            // Create and append the car spinner on submission
            // createCarSpinnerGif() is pulled from a global function
            // on main.js in the theme directory
            $('body').append(createCarSpinnerGif());

            var promo_codes = $currentPromos();
            promo_codes = $cleanPromoArray(promo_codes);

            var classCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
            var rateId = $(".aez-car-option--active input[name='rate_id']").data('rateId');
            var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
            var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
            var dob = $('#dob').val();
            var pickupDate = $('#pickup_date_comparison').val();
            var payType = $("#submit-reserve input[name='pay_total']:checked").val();
            
            var vehicleOptions = [];

            var cnt = 0;
            $('.vehicle_options_checkbox').each(function(i) {
                if ($(this).is(':checked')) {
                    vehicleOptions[cnt] = $(this).val();

                    cnt++;
                    // vehicleOptions = $(this).val();
                    // Do stuff with checked box
                }
            });

            var ClassCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
            var RateID = $(".aez-car-option--active input[name='rate_id']").data('rateId');
            var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
            var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
			var useProfileInfo = $("#use_member_profile_info");
			var useProfileAttr = $(useProfileInfo).attr('user-opt-checked');
			if(useProfileAttr == "true") {
				$(useProfileInfo).prop('checked', false);
			}
			
			var formData = {
                promo_codes: promo_codes,
                action: 'advRezPromoCheck',
                advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
                vehicleOptions: vehicleOptions,
                ClassCode: ClassCode,
                RateID: RateID,
                vehicleEnhanceType: vehicleEnhanceType,
                vehicleIndex: vehicleIndex,
                dob: dob,
                pickupDate: pickupDate,
                payType: payType,
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                email: $('#email').val(),
                phone_number: $('#phone_number').val(),
                street_address_1: $('#street_address_1').val(),
                street_address_2: $('#street_address_2').val(),
                city: $('#city').val(),
                state: $('#state').val(),
                postal_code: $('#postal_code').val(),
				use_profile_info: $(useProfileInfo).prop('checked')
            };                 
            
            var pick_up_date = $("input[name='pickup_date_comparison']").val();
            $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data: formData,
                dataType: 'json',
                cache: false
            })
            .done(function(data) {
                window.location.reload();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("error");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);

                // Remove the car spinner gif on failed post
                // Function comes from main.js
                removeCarSpinnerGif(0);

                return false;
            });
            return false;
        });       
        /* On change DOB update price based on renters age */
        $oldPromos = $currentPromos();
        $oldPromos = $cleanPromoArray($oldPromos);
        
        /*var pay_total_val = $('input[name=pay_total]').val();
        if(pay_total_val != 'pay_now') {
            $("#card_name").removeAttr('required');
            $("#card_number").removeAttr('required');
            $("#card_cvc").removeAttr('required');
            $("#card_exp_year").removeAttr('required');
            $("#card_exp_month").removeAttr('required');
        }*/
    });
    
        //Page reload under age price if user login from reserve page
        var reserve_reload_price = $('[name="reserve_reload_price"]').val();
        if(reserve_reload_price == 1) {
            reloadSummaryPrice();
            //setTimeout(function(){ $('#exp_checkout_update_option').trigger('click'); }, 300);
        }     
   

})(jQuery);

    /*
 *  ADV Reserve Form Script
 */

(function($, document, window) {
    /*
     *  Variable References
     */

  $('#card_exp').bind('keyup','keydown', function(event) {
  var key = event.keyCode || event.charCode;
    if (key == 8 || key == 46) return false;
    var strokes = $(this).val().length;

    if(strokes === 2){
        var thisVal = $(this).val();
        thisVal += '/';
        $(this).val(thisVal);
    }
    if(strokes >= 3){
        var thisVal = $(this).val();
        if (thisVal.charAt(2) !='/'){
             var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
             $(this).val(txt1);
        }
    }
});


$('.optional_block').on('click', function() {
    if($(window).width() < 801) {
        // $(".optional_fields").toggle();
        $(".optional_block").toggleClass('is-active').next(".optional_fields").stop().slideToggle(300);
    }
});

    /************ expressway flow start ******************/  
    
    $(document).ready(function(){
//tooltip
        $(function () {$('[data-toggle="tooltip"]').tooltip()});

        //if you selected free benefits, when we load page need to show vehicle options price as 0.00
        $('.btn_list_benifits_active').each(function(e) 
        { 
            selected_award_type = $(this).data('selected_award_type');
            
            if(selected_award_type != ''){
                $('ul.rez_add_options li').each(function(e) 
                { 
                    if($(this).find("input.vehicle_options_checkbox_rez").val() == selected_award_type) {
                        $('#is_free_benefit_applied').val(1);
                        $(this).find("div.reserve-option-amount-modal").html('<label> USD $0.00 /day</label>');
                        $(this).find("input.vehicle_options_checkbox_rez").prop('checked', true);
                        $(this).find("div.vehicle_option_based_free_benefits div.reserve-option-desc a.expressway-options-btn").addClass('btn_list_benifits_active');
                    } 
                });
            }
            return false;
        }); 
        
        if($('#modify_options_open_flag').val() > 0){
            $('.express_extra_options .remove_option_btn').show();
            $('.express_extra_options .no_options_container').hide();
            $(this).attr('data-display','1');
        }
        

        $('.expressway-options-btn').on("click", function(e) {
            $('.express_extra_options .remove_option_btn').show();
            $('.express_extra_options .no_options_container').hide();
            $(this).attr('data-display','1');
        });
        
        
        //we can able to choose only one hand control
        $('.manage_hand_control').on('click', function() {
            $('.manage_hand_control').not(this).find('.manage_hand_control_check_box').prop('checked', false);
            $('.manage_hand_control').not(this).removeClass('exp_vehicle_option_list_popup_selected');
        });
    });

    //select vehicle options in the popup 
    $('.rez_add_options .exp_vehicle_option_list_popup').on('click',function(){
        if(!$(this).hasClass('exp_vehicle_option_list_popup_selected')){
            $('#is_free_benefit_applied').val(1);
            $(this).addClass('exp_vehicle_option_list_popup_selected');
            $(this).find('.vehicle_options_checkbox_rez').prop('checked',true);
        } else {
            $(this).removeClass('exp_vehicle_option_list_popup_selected');
            $(this).find('.vehicle_options_checkbox_rez').prop('checked',false);
            var this_chk_box = $(this).find('.vehicle_options_checkbox_rez');
            var this_parent = $(this);
            handleFreeExpressOptions(this_chk_box,this_parent);
            
//            if($(this).find('.exp_vehicle_option_exp_link_disabled')){
//                $(this).find("div.reserve-option-amount-modal").html('<label>'+$(this).find("div.reserve-option-amount-modal").data('org_amt')+'</label>');
//            }
        }
        return false;
    });
    
    function handleFreeExpressOptions(this_chk_box, this_parent){
                
        is_stackable = $(this_parent).data('is_stackable');
        is_selected_class = $(this_parent).find("a.expressway-options-btn").hasClass('btn_list_benifits_active');
        
        var clicked_value = $(this_chk_box).val();
        //console.log('clicked_value : '+clicked_value);

        if(($(this_chk_box). prop("checked") == false) && (is_stackable == 'False') && (is_selected_class == true)) {
            //change link status of OR SELECT string
           $(this_parent).find("div.reserve-option-amount-modal").html('<label>'+$(this_parent).find("div.reserve-option-amount-modal").data('org_amt')+'</label>');
           
            //$(this).parent().parent().find("a.expressway-options-btn").removeClass('exp_vehicle_option_exp_link_disabled');
            
            //if checkbox unchecked
            var promo = $(this_parent).find("a.expressway-options-btn").data('promo_code')
            var get_all_active_promo_codes = $('#expressway_promo_codes_list').val();
            
            var promosArray = get_all_active_promo_codes.split(',');
            promosArray.splice($.inArray(promo, promosArray),1);
            var temp_string = promosArray.join(",");
            
            
            $(this_parent).find("a.expressway-options-btn").removeClass( "btn_list_benifits_active" );
            
            $('#expressway_promo_codes_list').val(temp_string);
            
            $(".vehicle_option_based_free_benefits .expressway-options-btn").removeClass('exp_vehicle_option_exp_link_disabled');

            
            $(".btn_list_benifits").attr("disabled", false);
            $(".btn_list_benifits").removeClass("btn-grey");

        }
    }
    
    $('.expressway-options-btn').on("click", function(e) {
        var promo = $(this).attr('data-promo_code');
        var promos = $('#expressway_promo_codes_list').val();

        if($( this ).hasClass( "btn_list_benifits_active" )){

            //remove free benifits
            var promosArray = promos.split(',');
            promosArray.splice($.inArray(promo, promosArray),1);
            var temp_string = promosArray.join(",");
            $('#expressway_promo_codes_list').val(temp_string);
            $( this ).removeClass( "btn_list_benifits_active" );
            
            is_stackable = $( this ).data( "is_stackable" );

            selected_val = '';
            selected_val = $( this ).data( "selected_award_type" );
            if(is_stackable == 'False'){
                $('ul.rez_add_options li').each(function(e) 
                { 
                    if($(this).find("input.vehicle_options_checkbox_rez").val() == selected_val) {
                        $(this).find("div.reserve-option-amount-modal").html('<label>'+$(this).find("div.reserve-option-amount-modal").data('org_amt')+'</label>');
                        $(this).find("input.vehicle_options_checkbox_rez").prop('checked', false);
                        $(this).find("div.vehicle_option_based_free_benefits div.reserve-option-desc a.expressway-options-btn").addClass('btn_list_benifits_active');
                    } 

                    var is_stackable_vechicle_option = $(this).find(".vehicle_option_based_free_benefits .expressway-options-btn").data('is_stackable');
                    if(is_stackable_vechicle_option == 'False'){
                        $(this).find(".vehicle_option_based_free_benefits .expressway-options-btn").removeClass('exp_vehicle_option_exp_link_disabled');
                    }     
                });
                
                $('.btn_list_benifits').each(function(e){
                    $(this).attr("disabled", false);
                    $(this).removeClass("btn-grey");
                });
            }
            
        } else {
            //add free benifits

            // Richard - I commented out the ($('#is_free_benefit_applied').val() == 1) code because this was the fix for
            // Issue AED-2575. I don't think is an issue anymore, since we don't show unvalid promo code in the text
            // boxes on the reserve page anymore. Plus this was removing the abandonment promo code. Hence, I need to 
            // comment this out.
             //if(promos != ''){
                          
            //if any free benifits applied then we need to change the #is_free_benefit_applied value to 1
            if(promos.length > 0){
                $('#is_free_benefit_applied').val(1);
            } 
            
            
            if(($('#is_free_benefit_applied').val() == 1) && (promos != '')){
                concat_promos = promos+','+promo;
            } else {
                concat_promos = promo;
            }

            $('#expressway_promo_codes_list').val(concat_promos);
            $( this ).addClass( "btn_list_benifits_active" ); 
            
            is_stackable = $( this ).data( "is_stackable" );
            
            selected_val = '';
            selected_val = $( this ).data( "selected_award_type" );
            if(is_stackable != 'True') {
                $('ul.rez_add_options li').each(function(e) 
                { 
                    if($(this).find("input.vehicle_options_checkbox_rez").val() == selected_val) {
                       $(this).find("div.reserve-option-amount-modal").html('<label> USD $0.00 /day</label>');
                       $(this).find("input.vehicle_options_checkbox_rez").prop('checked', true);
                       $(this).addClass('exp_vehicle_option_list_popup_selected');
                       $('#is_free_benefit_applied').val(1);
                    }
                    
                    var is_stackable_vechicle_option = $(this).find(".vehicle_option_based_free_benefits .expressway-options-btn").data('is_stackable');
                    if(is_stackable_vechicle_option == 'False'){
                        $(this).find(".vehicle_option_based_free_benefits .expressway-options-btn").addClass('exp_vehicle_option_exp_link_disabled');
                    }
                });
            }
            
            clicked_stackable = $(this).data("is_stackable");
            
            $('.btn_list_benifits ').each(function(){
                is_stackable = $(this).data("is_stackable");
                
                if(!$( this ).hasClass( "btn_list_benifits_active" ) && is_stackable == "True" ){
                   
                } else if(clicked_stackable == "False" && !$( this ).hasClass( "btn_list_benifits_active" )){
                    $(this).addClass("btn-grey");
                    $(this).attr("disabled", true);
                    $(this).find("div.vehicle_option_based_free_benefits div.reserve-option-desc a.expressway-options-btn").addClass('btn_list_benifits_active');
                } 
            });
            $('#is_free_benefit_applied').val(1);
        }
        return false;
    });
    
    
    
    
    /************ expressway flow end ******************/

    var $rewardsLoginForm = $('#aez_rewards_login_form');
    var $reserveForm = $('#submit-reserve');
    var $paymentType = $('input[type="radio"][name="pay_total"]');
    var $submitButton = $('.aez-save-and-review');
    var $dob = $('#dob');
    var $phoneNumber = $('#phone_number');
    var $payTotalCheckboxes = $('input[name="pay_total"]');
    var $payNowCheckbox = $('#pay_now_total');
    var $payLaterCheckbox = $('#pay_later_total');
    var isPayNow = $payNowCheckbox.is(':checked');
    
    var $cancel_checkbox = $('#cancel_policy');
    var $creditCardNumber = $('#card_number');
    var $cancel_checkbox = $('#cancel_policy');
     // This is commented out for now. This handles the input scrolling on the reserve page.
    //var $inputs = $('#submit-reserve').find(':input').not('.aez-save-and-review');
    var $clearAirline = $('#clear-airline');
    var canceltxt = '';
    var first_name = document.getElementById('first_name');
    var last_name = document.getElementById('last_name');
    var $abandonment_promocode = $("#abandonment_promocode");    
    var $RateID = $('#rate_id').val();
    var $vehicleEnhanceType = $('#vehicle_enhance_type').val();
    var $vehicleIndex = $('#vehicle_index').val();

//     /****** CART ABANDONMENT ******/
    $('.pum-theme-lightbox').css('display','none');

    var show_discount_popup_flag = $('#show_discount_popup_flag').val();
    var abandonment_promocode_exists = $('#abandonment_promocode_exists').val();
    var $location_country = $("#location_country").val();
    var $ClassCode = $('#class_code').val();
    var $car_restrictions = ['ECAR', 'CCAR', 'XXAR'];
    var show_abandonment_popup = $('#show_abandonment_popup').val();

    // When Save & Review submit button is clicked, make sure the abandonment popup doesn't come up.
    // $('.aez-save-and-review').click(function (e) {
    //      $(window).off('beforeunload');
    // });

    if(show_discount_popup_flag == 1) {
        callpopupunload();
    }

    function callpopupunload() {

        var check_promo_flag = 0;
        var show_abandonment_popup_flag  = 0;

        $('.aez-validate-promo-code').each(function() {
            if($.trim($(this).val()) != '') {
                check_promo_flag = 1;
                return false;
            }
        });

        // If abandonment_promocode_exists is true then set flag to not display popup
        if (abandonment_promocode_exists == "true") {
            check_promo_flag = 1;
        }

        // If the abandonment popup is blank then don't show the popup
        if (show_abandonment_popup == "false") {
            show_abandonment_popup_flag = 1;
        }

        if(check_promo_flag == 0 && show_abandonment_popup_flag == 0 && show_discount_popup_flag == 1 && $location_country == "US" && !$car_restrictions.includes($ClassCode)) { 
            // Blue conic even only should fire once per hour.
            blueConicClient.event.subscribe('exitintent', this, function() {
                // Open up abandonment popup for when the customer tries to leave the site.
                $('.pum-theme-lightbox').css('display', 'block');
            });
        }
    }
    /****** END CART ABANDONMENT ******/

    // if(isPayNow) {
    //     $("#cancel_check").show();
    //     $("label[for='pay_now_total']").after(canceltxt);
    // }
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

    // var ph_num = document.getElementById('phone_number');
    // $("#phone_number").change(function(){
    //     if(ph_num.validity.patternMismatch){  
    //         ph_num.setCustomValidity("Phone number should contain 10 digits.");  
    //     }  
    //     else {  
    //         ph_num.setCustomValidity("");  
    //     }    
    // });

    if(typeof $dob !== 'undefined') {
        var dobPicked = $dob.val();
        var dobEntered = moment(dobPicked, "MM-DD-YYYY");
        var pick_up_date = moment($("input[name='pickup_date_comparison']").val(), "YYYYMMDD");
        var ago_25_years = moment(pick_up_date).subtract(25, 'years');
        var ago_21_years = moment(pick_up_date).subtract(21, 'years');
        if (ago_21_years < dobEntered) {
     
            $('.younger_than_21_message').show('slow');
            $('.younger_than_25_message').hide('slow');
        } else if (ago_25_years < dobEntered) {
          
            $('.younger_than_25_message').show('slow');
            $('.younger_than_21_message').hide('slow');
        } else {         
            $('.younger_than_25_message').hide('slow');
            $('.younger_than_21_message').hide('slow');    
        }   
    }

    /* 
     *  Functions
     */

     // Create remove() for IE
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }
    
    function dropSearch() {
        $(this).parent().toggleClass('is-open');
        $(this).next('.aez-form').slideToggle();
    }

    function closeForm() {
        $(this).parent().slideToggle();
        $(this).parent().parent().toggleClass('is-open');
    }

    function openSearchFormwithMenu() {
        $('.aez-find-a-car-dropdown').toggleClass('is-open');
        $('.aez-form').slideToggle();
    }

    function scrollToInput($input) {
        var y = $input.offset().top;
        var top = y - 100 + 'px';

        return $('html, body').animate({ scrollTop: top });
    }

    function calcReservePage() {
//console.log('in calcReservePage');

        window.onunload = function(){}; 

//         console.log(ADV_Rez_Ajax);
// console.log(ajaxurl);

        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'GET',
            data: {action: 'advGetEnhanceChoices'},
            dataType: 'json',
            cache: false
        })
        .done(function(data) {
//console.log('data');
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // console.log("error");
            // console.log("jqXHR:" + jqXHR);
            // console.log(jqXHR);
            // console.log("Text Status:" + textStatus);
            // console.log("errorThrown:" + errorThrown);
            return false;
        });

        return false;

    }

    if(window.location.href.indexOf("reserve") > -1) {
        $('.pull-right').css('margin-bottom','3%');
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
    $('#airline').select2().on("change", function(e) {
        $('#airline').select2("close"); //call select2
    });

    /* 
     *  Event Handlers
     */

    function handleRewardsLoginFormSubmit(evt) {
        evt.preventDefault();
    }

    function createHiddenInput(name, value) {
        return $('<input>', {
            type: 'hidden',
            name: name,
            value: value
        });
    }

    // Validate an email address, returns true if valid and false if not
    function validateEmail(email) 
    {
        // Regex to test if the email has @ . in it
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    //Check whether the emails match.
    function matchEmails(email, email2) {
         if($('#email').val() == $('#email2').val())
         {
                return true;
         }
    }


    // Validate a phone number, returns true if valid and false if not
    function validatePhoneNumber(phonenumber) {
        return true;
        // Regex for the phone number
        // var phoneregx = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;
        // return phonenumber.val().match(phoneregx);
    }
    
    
    function handleSubmitReservationClick(evt) {
        evt.preventDefault();
        $('#submit-reserve-button1').trigger('click');
    }
    
    function handlePayNowCardFields() {
        
        $('#pay_now_total_container').hide();
        $("#card_name").removeAttr('required');
        $("#card_number").removeAttr('required');
        $("#card_cvc").removeAttr('required');
        // $("#card_exp_year").removeAttr('required');
        // $("#card_exp_month").removeAttr('required');  
        $("#card_exp").removeAttr('required', true);
        $("#billing_street_address_1").removeAttr('required');
        $("#billing_postal_code").removeAttr('required');
        $("#billing_city").removeAttr('required');
        

        if($(this).val() == '-1') {
            $('#pay_now_total_container').show();
            $("#card_name").prop('required', true);
            $("#card_number").prop('required', true);
            $("#card_cvc").prop('required', true);
            // $("#card_exp_year").prop('required', true);
            // $("#card_exp_month").prop('required', true);
            $("#card_exp").prop('required', true);
            $("#billing_street_address_1").prop('required', true);
            $("#billing_postal_code").prop('required', true);
            $("#billing_city").prop('required', true);
            $('.pay_with_card_option_cancel').css('display', 'none');
        }
        else {
            $('.pay_with_card_option_cancel').css('display', 'block');
        }
    }
    
    
    
    // Validate US Zip codes
    function validateUSZip(zip) {
	   return /^\d{5}(-\d{4})?$/.test(zip);
    }

    function handleReservationFormSubmit(evt) {

        evt.preventDefault();

        removeErrMsg();

        var $rentalPolicy = $('#read_location_policy');
        var $terms = $('#terms_and_conditions');

        var $inputs = $('#submit-reserve :input');

        var $promoCodes = $('input[name="promo_codes[]"]');
        var $promotCodes = $('input[name="promot_codes[]"]');

        var $phoneNumber = $('#phone_number');

        var $email = $('#email');
        var $email2 =$('#email2');

        var $postal_code = $('#postal_code');
        
        var codes = $.map($promoCodes, function(code) {
            return $(code).val();
        });

        // We iterate over the array and, for each element, check if the first position of this element in the array 
        // is equal to the current position. Obviously, these two positions are different for duplicate elements.
        codes = codes.filter(function(item, pos) {
            return codes.indexOf(item) == pos;
        });

        var tcodes = $.map($promotCodes, function(tcode) {
            return $(tcode).val();
        });

        // We iterate over the array and, for each element, check if the first position of this element in the array 
        // is equal to the current position. Obviously, these two positions are different for duplicate elements.
        tcodes = tcodes.filter(function(item, pos) {
            return tcodes.indexOf(item) == pos;
        });

        var inputList = $.map($inputs, function(input) {
            var obj = {};

            if ($(input).is('[type="checkbox"]') || $(input).is('[type="radio"]')) {
                if ($(input).is(':checked')) {
                    obj.name = $(input).attr('name');
                    obj.value = $(input).val();
                }
            } else if ($(input).attr('name') === 'promo_codes[]') {
            } else if ($(input).attr('name') === 'promot_codes[]') {

            } else {    
                obj.name = $(input).attr('name');
                obj.value = $(input).val();
            }

            return obj;
        });

        var formData = {
//            action: 'advConfirm',
            action: 'advComplete',
            advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
            'promo_codes[]': [],
            'promot_codes[]': []
        };

        inputList.forEach(function(input) {
            return formData[input.name] = input.value;
        });

        codes.forEach(function(code) {
            formData['promo_codes[]'].push(code);
            return formData;
        });
        tcodes.forEach(function(tcode) {
            formData['promot_codes[]'].push(tcode);
            return formData;
        })

       //Set card option to skip confirm page
       formData['pay_with_card_option'] =  $('#pay_with_card_option').val();
        
        function cancellation(){
            if($('#cancel_check').is(':visible')) {
                if(!$cancel_checkbox.is(':checked')) {
                    return false;
                }
            }
            return true;
        }

       //Set card option to skip confirm page
       formData['pay_with_card_option'] =  $('#pay_with_card_option').val();
       
        //Validate Postal 
        var reserve_page_postal_code_flag = true;
       if($postal_code.val() != '' && $postal_code.length !== 0 && $postal_code.val() !== undefined) {
            reserve_page_postal_code_flag = validateUSZip($postal_code.val());
        }
  
       if ($rentalPolicy.is(':checked') && $terms.is(':checked') && cancellation() &&  reserve_page_postal_code_flag && validatePhoneNumber($phoneNumber) && validateEmail($email.val()) && matchEmails($email.val(), $email2.val())) {
          /*  var pay_with_card = $('#pay_with_card_option');

            if($(pay_with_card).length > 0 && $(pay_with_card).val() != '-1' && $('#pay_now_total').prop('checked') === true) {
                handleReservationComplete(evt);
                return false;
            } */

            
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
                var promo_codes = [];

                //Redirect to home page if session exipred.
                if (data.hasOwnProperty('content')) {
                    if (typeof data.content.redirect !== 'undefined' && data.content.redirect) {
                       window.location.href = data.content.redirect;
                       return;
                    }
                }

                if (data.hasOwnProperty('content')) {
                    if (data.content.hasOwnProperty('ageError')) {
                        var $cnt = 0;
                        var $errObject = {};
                        var $tmpObj = {};
                        $tmpObj['title'] = 'There was an error completing your reservation.';
                        $tmpObj['text'] = data.content.errorMsg;
                        $errObject['err_' + $cnt++] = $tmpObj;
                        displayErrorMessage($errObject);
                        // Remove the CarSpinner so it's not there so the user to re-submit their reservation
                        removeCarSpinnerGif(0);
                        // Remove the disable attribute so the user can re-submit their reservation
                        $('button').removeAttr("disabled");
                        return false;
                    }
                }  
    
                if (data.hasOwnProperty('content')) {
                    if (data.content.hasOwnProperty('error')) {
                        var $cnt = 0;
                        var $errObject = {};
                        var $tmpObj = {};
                        $tmpObj['title'] = 'Reservation is complete.';
                        $tmpObj['text'] = 'Your confirmation number is: ' + data.content.error + '. You should receive a confirmation email soon. <br><br>' + 
                        'If you would like to make another reservation, please <a href="/find-a-car-worldwide?error=remove">click here.</a>';
                        $errObject['err_' + $cnt++] = $tmpObj;
                        displayErrorMessage($errObject);
                        removeCarSpinnerGif(0);
                        return false;
                    }
                }
                
                if (data.hasOwnProperty('content')) {
                    if (data.content.content == 'error' && data.content.cc_card_error == 1) {
                        var $cnt = 0;
                        var $errObject = {};
                        var $tmpObj = {};
                        $tmpObj['title'] = 'Reservation Error';
                        $tmpObj['text'] = data.content.message;
                        $errObject['err_' + $cnt++] = $tmpObj;
                        displayErrorMessage($errObject);
                        // Remove the CarSpinner so it's not there so the user to re-submit their reservation
                        removeCarSpinnerGif(0);
                        // Remove the disable attribute so the user can re-submit their reservation
                        $('button').removeAttr("disabled");
                        return false;
                    }
                }
        
                
                if (data.hasOwnProperty('content')) {
                    if (data.content.content == 'error') {
                        
                        var $cnt = 0;
                        var $errObject = {};
                        var $tmpObj = {};
                        $tmpObj['title'] = 'There was an error completing your reservation.';
                        $tmpObj['text'] = 'Please check all your information to make sure it is correct. <br>' + data.content.message + '.';
                        $errObject['err_' + $cnt++] = $tmpObj;
                        displayErrorMessage($errObject);
                        // Remove the CarSpinner so it's not there so the user to re-submit their reservation
                        removeCarSpinnerGif(0);
                        // Remove the disable attribute so the user can re-submit their reservation
                        $('button').removeAttr("disabled");
                        return false;
                    }
                }
         
                
                var $form = $('<form>', {
                    action: '/complete',
                    method: 'POST',
                    enctype: 'multipart/form-data',
                });
                
                Object.keys(formData).forEach(function(key) {
                    var value = formData[key];

                    if (key === 'promo_codes[]') {
                        value.forEach(function(code) {
                            $form.append(createHiddenInput(key, code));
                        });
                    } else {
                        $form.append(createHiddenInput(key, value));
                    }
                });
                
                $form.appendTo('body');
                $form.submit();
                removeCarSpinnerGif(15000);

                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log("error");
                    console.log("jqXHR:" + jqXHR);
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);

                    // Remove the overlay if it is a failed post
                    // Function comes from main.js
                    removeCarSpinnerGif(0);

                    return false;
                });
                
        
        } else {

            var $cnt = 0;
            var $errObject = {};
            if( $payNowCheckbox.is(':checked')) {
                if (!$cancel_checkbox.is(':checked')) {
                    
                        var $tmpObj = {};
                        $tmpObj['title'] = 'Please read the Cancellation Policy';
                        $tmpObj['text'] = 'If you agree, please check box next to "I agree with Cancellation Policy".';
                        $errObject['err_' + $cnt++] = $tmpObj;
                   }
                // Postal Code is invalid
                if (reserve_page_postal_code_flag === false) {

                    var $tmpObj = {};
                    $tmpObj['title'] = 'Invalid Postal Code';
                    $tmpObj['text'] = 'Please enter a valid postal code';
                    $errObject['err_' + $cnt++] = $tmpObj;
                }
            }

            if (!$rentalPolicy.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Please read the Location Rental Policies.';
                $tmpObj['text'] = 'If you agree, please check box next to "I have read the Location Rental Policies".';
                $errObject['err_' + $cnt++] = $tmpObj;
           }

            if (!$terms.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Please review the Advantage Rent A Car' + "'" + 's Terms and Conditions.';
                $tmpObj['text'] = 'If you agree, please check box next to "I agree with Advantage Rent A Car' + "'" + 's Terms and Conditions".';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

             // Check if the phone number is legit
            if(!validatePhoneNumber($phoneNumber)) {
                
                var $tmpObj = {};
                $tmpObj['title'] = 'Phone Number';
                $tmpObj['text'] = 'The phone number you entered is not correct. Please enter a phone number.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if email is valid
            if (!validateEmail($email.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Email';
                $tmpObj['text'] = 'The email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            //check if the emails match
            if(!matchEmails($email.val(), $email2.val()))
            {
                var $tmpObj = {};
                $tmpObj['title'] = 'Email';
                $tmpObj['text'] = 'The emails you entered do not match. Please re-enter.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }
            
            displayErrorMessage($errObject);
        }

        return true;
    }


    function handlePaymentTypeSelection() {
        // var $radio = $(this);
        // console.log($radio.val());
        $('.aez-reserve-dolar-display').toggle();
        $('.taxes-fees').toggle();
        $('.extras_list').css('display','inline');
        // if ($radio.val() === 'pay_now') {
        //     $('.aez-reserve-prepaid-dolar-display').fadeIn();
        //     $('.aez-reserve-counter-dolar-display').fadeOut();
        //     // $submitButton.text('Save & Review');
        // } else if ($radio.val() === 'pay_later') {
        //     // $submitButton.text('Confirm Reservation');
        //     $('.aez-reserve-prepaid-dolar-display').fadeOut();
        //     $('.aez-reserve-counter-dolar-display').fadeIn();
        // }
    }

    function handleDateOfBirth() {
        var dobPicked = $dob.val();
        var dobEntered = moment(dobPicked, "MM-DD-YYYY");
        var pick_up_date = moment($("input[name='pickup_date_comparison']").val(), "YYYYMMDD");
        var ago_25_years = moment(pick_up_date).subtract(25, 'years');
        var ago_21_years = moment(pick_up_date).subtract(21, 'years');

        if($(window).width() > 910){
            if (ago_21_years < dobEntered) {
                $('.younger_than_21_message').show('slow');
                $('.younger_than_25_message').hide('slow');
                $('.younger_than_25_message_mobile').hide();
                $('.younger_than_21_message_mobile').hide(); 

            } else if (ago_25_years < dobEntered) {
                $('.younger_than_25_message').show('slow');
                $('.younger_than_21_message').hide('slow');
                $('.younger_than_25_message_mobile').hide();
                $('.younger_than_21_message_mobile').hide(); 
            } else {
                $('.younger_than_25_message').hide('slow');
                $('.younger_than_21_message').hide('slow');
                $('.younger_than_25_message_mobile').hide();
                $('.younger_than_21_message_mobile').hide();     
            }
        }

        else if($(window).width() < 801) {
            if (ago_21_years < dobEntered) {
                $('.younger_than_21_message_mobile').show('slow');
                $('.younger_than_25_message_mobile').hide('slow');
                $('.younger_than_25_message').hide();
                $('.younger_than_21_message').hide();   
            } else if (ago_25_years < dobEntered) {
                $('.younger_than_25_message_mobile').show('slow');
                $('.younger_than_21_message_mobile').hide('slow');
                $('.younger_than_25_message').hide();
                $('.younger_than_21_message').hide();   
            } else {
                $('.younger_than_25_message_mobile').hide('slow');
                $('.younger_than_21_message_mobile').hide('slow'); 
                $('.younger_than_25_message').hide();
                $('.younger_than_21_message').hide();   
            }
        }
    }

    handleDateOfBirth();

    var RequiredFields = (function() {
        // Required Fields For Form Module
        
        // Set the pay later fields to be required
        var PAY_LATER_FIELDS = [
            'first_name',
            'last_name',
            'phone_number',
            'email',
            'email2',
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
        var $requiredInputs = $reserveForm.find(':input').filter(filterByRequired);
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

    (function(d) { 
        if (document.addEventListener) 
        document.addEventListener('ltkAsyncListener', d); 
        else {
            e = document.documentElement; 
            e.ltkAsyncProperty = 0; 
            e.attachEvent('onpropertychange', function (e) { 
                if (e.propertyName == 'ltkAsyncProperty')
                {
                    d();
                }
            });
        }
    })

   (function () { 
             //Begin Custom Code 
        if(isPayNow) {
            var $ls_vehicleTotal = document.getElementById('ls_pay_now_total').value;
        } else {
            var $ls_vehicleTotal = document.getElementById('ls_pay_later_total').value;
        }
    
        var $ls_descp = document.getElementById('ls_descp').value;
        var $vehicle_image = document.getElementById('vehicle_image').value;
        var $rental_location = document.getElementById('rental_location').value;
        var $return_location = document.getElementById('return_location').value;
        var $pickup_date_time = document.getElementById('pickup_date_time').value;
        var $dropoff_date_time = document.getElementById('dropoff_date_time').value;
        var $count_extras_check = document.getElementById('count_extras_check').value;
        var $count_extras = document.getElementById('count_extras').value;
        var $dropoff_date_time = document.getElementById('dropoff_date_time').value;

        _ltk.SCA.AddItemWithLinks([$ls_descp], [1], [$ls_vehicleTotal], [$ls_descp], [$vehicle_image], '/reserve/'); // one line per item reserved
        var $numOptions = 0;
        if(jQuery.type($count_extras_check) !== 'undefined' || $count_extras_check !== null) {
            $numOptions = $count_extras;
        
            if($numOptions >= 1) {
                for( var $x=0; $x < $numOptions; $x++) {
                    var $ls_extra = document.getElementsByName('ls_extra')[$x].value;
                    var $ls_extraRate = document.getElementsByName('ls_extraRate')[$x].value;
                    var $extras_image = document.getElementsByName('extras_image')[$x].value;
                    _ltk.SCA.AddItemWithLinks([$ls_extra], [1], [$ls_extraRate], [$ls_extra], [$extras_image] ,'/reserve/'); // one line per item reserved one line per item reserved
                }
            }
        }

        _ltk.SCA.Meta1 = [$pickup_date_time]; 
        _ltk.SCA.Meta2 = [$dropoff_date_time]; 
        _ltk.SCA.Meta3 = [$rental_location]; 
        _ltk.SCA.Meta4 = [$return_location]; 
        _ltk.SCA.Submit(); 
    
            // End Custom Code 
    });

    function handlePayTotalCheckboxChange() {
        // Get the new value of the $payNowCheckbox
        var isPayNow = $payNowCheckbox.is(':checked');
        // Set the requiredfields based on the current value of the pay now checkbox
        RequiredFields.set(isPayNow);
        
        $('.aez-saved-card-container').hide();

        $('.aez-save-and-review').html('Complete Reservation');

        $('.aez-reservation__save-btn').html('Complete Reservation'); 
        
        if(isPayNow) {
            var $ls_vehicleTotal = document.getElementById('ls_pay_now_total').value;
        } else {
            var $ls_vehicleTotal = document.getElementById('ls_pay_later_total').value;
        }
    
        var $ls_descp = document.getElementById('ls_descp').value;
        var $vehicle_image = document.getElementById('vehicle_image').value;
        var $rental_location = document.getElementById('rental_location').value;
        var $return_location = document.getElementById('return_location').value;
        var $pickup_date_time = document.getElementById('pickup_date_time').value;
        var $dropoff_date_time = document.getElementById('dropoff_date_time').value;
        var $count_extras_check = document.getElementById('count_extras_check').value;
        var $count_extras = document.getElementById('count_extras').value;
        var $dropoff_date_time = document.getElementById('dropoff_date_time').value;

        _ltk.SCA.AddItemWithLinks([$ls_descp], [1], [$ls_vehicleTotal], [$ls_descp], [$vehicle_image], '/reserve/'); // one line per item reserved
        var $numOptions = 0;
        if(jQuery.type($count_extras_check) !== 'undefined' || $count_extras_check !== null) {
            $numOptions = $count_extras;
        
            if($numOptions >= 1) {
                for( var $x=0; $x < $numOptions; $x++) {
                    var $ls_extra = document.getElementsByName('ls_extra')[$x].value;
                    var $ls_extraRate = document.getElementsByName('ls_extraRate')[$x].value;
                    var $extras_image = document.getElementsByName('extras_image')[$x].value;
                    _ltk.SCA.AddItemWithLinks([$ls_extra], [1], [$ls_extraRate], [$ls_extra], [$extras_image] ,'/reserve/'); // one line per item reserved
                }
            }
        }
        _ltk.SCA.Meta1 = [$pickup_date_time]; 
        _ltk.SCA.Meta2 = [$dropoff_date_time]; 
        _ltk.SCA.Meta3 = [$rental_location]; 
        _ltk.SCA.Meta4 = [$return_location]; 
        _ltk.SCA.Submit();
    
        if(isPayNow) {

            $('.aez-saved-card-container').show();

            $('#pay_with_card_option').val('-1').trigger('change');
            // $("label[for='pay_now_total']").after(canceltxt);
            // $("#cancel_check").show();
        }
    }

    function handleInputFocus() {
        // Triggered when an input is focused on the reserve form
         var $input = $(this);
        scrollToInput($input);
    }

/*
    Clear the Airline drop down on the reserve page
*/
    function handleClearAirline(evt) {

        evt.preventDefault();

        // Set select2 airline container to a space
        document.getElementById("select2-airline-container").innerHTML = "&nbsp;";

        // Add the Airline place holder
        $('#airline').select2({
          placeholder: 'Airline'
        }).val('').trigger('change');

    }

    /* Method used to complete reservation using saved Credit card */
    function handleReservationComplete(evt) {

        evt.preventDefault();

        removeErrMsg();

        var $rentalPolicy = $('#read_location_policy');
        var $terms = $('#terms_and_conditions');

        var $inputs = $('#submit-reserve :input');

        var $promoCodes = $('input[name="promo_codes[]"]');
        var $promotCodes = $('input[name="promot_codes[]"]');

        var $phoneNumber = $('#phone_number');

        var $email = $('#email');
        var $email2 =$('#email2');


        var codes = $.map($promoCodes, function(code) {
            return $(code).val();
        });

        var tcodes = $.map($promotCodes, function(tcode) {
            return $(tcode).val();
        });

        var inputList = $.map($inputs, function(input) {            
            var obj = {};

            if ($(input).is('[type="checkbox"]') || $(input).is('[type="radio"]')) {
                if ($(input).is(':checked')) {
                    obj.name = $(input).attr('name');
                    obj.value = $(input).val();
                }
            } else if ($(input).attr('name') === 'promo_codes[]') {
            } else if ($(input).attr('name') === 'promot_codes[]') {

            } else {    
                obj.name = $(input).attr('name');
                obj.value = $(input).val();
            }

            return obj;
        });

        var formData = {
            action: 'advConfirm',
            advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
            'promo_codes[]': [],
            'promot_codes[]': []
        };

        inputList.forEach(function(input) {
            return formData[input.name] = input.value;
        });

        codes.forEach(function(code) {
            formData['promo_codes[]'].push(code);
            return formData;
        })
        tcodes.forEach(function(tcode) {
            formData['promot_codes[]'].push(tcode);
            return formData;
        })
       
       //Set card option to skip confirm page
       formData['pay_with_card_option'] =  $('#pay_with_card_option').val();
       
       if ($rentalPolicy.is(':checked') && $terms.is(':checked') && validateEmail($email.val()) && matchEmails($email.val(), $email2.val())) {

            //removeCarSpinnerGif();
            
            // Create and append the car spinner on submission
            // createCarSpinnerGif() is pulled from a global function
            // on main.js in the theme directory
            $('body').append(createCarSpinnerGif());
            
                var $frequentFlyerNumber = $('#frequentFlyerNumber');
                var $airline = $('#airline option:selected');

                // Validate the Frequent Flyer Number if it exists
                if ($frequentFlyerNumber.val() && $airline.text().trim() && $airline.text().trim() !== "select" && $airline.val() !== "select") {

                    $.ajax({
                        url: ADV_Rez_Ajax.ajaxurl,
                        method: 'POST',
                        data: {
                            // wp ajax action
                            action: 'validateFrequentFlyerNumber',
                            // vars
                            airline: $airline.text(),
                            frequentflyernumber: $frequentFlyerNumber.val(),
                            // send the nonce along with the request
                            validateFrequentFlyerNumber: ADV_Rez_Ajax.validateFrequentFlyerNumber
                        },
                        dataType: 'json'
                    })
                    .done(function(data) {

                        if (data.Status == "ERROR") {

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

                        } else {
                            

                            $('body').append(createCarSpinnerGif());    
                            $.ajax({
                                url: ADV_Rez_Ajax.ajaxurl,
                                method: 'POST',
                                data: formData,
                                dataType: 'json'
                            })
                            .done(function(data) {

                                //Driver Under Age 21 Error            
                                if (data.error_code == "AGE_UNDER_21_ERR") {

                                    // Build error message
                                    var $cnt = 0;
                                    var $errObject = {};
                                    var $tmpObj = {};
                                    $tmpObj['title'] = 'Driver Age Error.';
                                    $tmpObj['text'] = 'Driver under 21 may not rent a car';
                                    $errObject['err_' + $cnt++] = $tmpObj;

                                    // Remove Spinner
                                    removeCarSpinnerGif();

                                    // Display Error Message
                                    displayErrorMessage($errObject);

                                    return false;

                                }   
                                //Driver Under Age 21 Error            
                                if (data.error_code == "PROMO_CODE_ERR") {

                                    // Build error message
                                    var $cnt = 0;
                                    var $errObject = {};
                                    var $tmpObj = {};
                                    $tmpObj['title'] = 'Promo code Error.';
                                    $tmpObj['text'] = 'There is a problem with promo codes';
                                    $errObject['err_' + $cnt++] = $tmpObj;

                                    // Remove Spinner
                                    removeCarSpinnerGif();

                                    // Display Error Message
                                    displayErrorMessage($errObject);

                                    return false;

                                }      

                                if(data.content == 'success' && data.confirmNum != '') {
                                    window.location.href = 'complete/?status=success';
                                }
                                else {
                                    window.location.href = 'confirm';
                                }
                                return false;
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                removeCarSpinnerGif(0);    
                            });
                        }
                        //form_data.append ('airlines', airlines);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        //console.log("error");
                        // console.log("jqXHR:" + jqXHR);
                        // console.log(jqXHR);
                        // console.log(textStatus);
                        // console.log(errorThrown);
                        removeCarSpinnerGif(0);
                    });

                // If the Airline is blank but the Frequent Flyer Number has value then display the error message.
                // The Airline needs to be filled in if there's a Frequent Flyer Number.
                } else if ($frequentFlyerNumber.val() && $airline.text().trim() === "") {

                    // Build error message
                    var $cnt = 0;
                    var $errObject = {};
                    var $tmpObj = {};
                    $tmpObj['title'] = 'Airline was not selected.';
                    $tmpObj['text'] = 'Please select the appropriate airline in the drop down above that is associated with the '+
                                      'Frequent Flyer Number entered.';
                    $errObject['err_' + $cnt++] = $tmpObj;

                    // Remove Spinner
                    removeCarSpinnerGif();

                    // Display Error Message
                    displayErrorMessage($errObject);

                    return false;

                // If the Frequent Flyer Number is blank and the Airline has a value then display the error message.
                // The Frequent Flyer Number needs to be filled in if there's an Airline chosen.
                } else if ($frequentFlyerNumber.val() === "" && $airline.text().trim() !== "" && $airline.val() !== "select") {

                     // Build error message
                    var $cnt = 0;
                    var $errObject = {};
                    var $tmpObj = {};
                    $tmpObj['title'] = 'An Airline was selected without entering a Frequent Flyer Number.';
                    $tmpObj['text'] = 'Please enter a Frequent Flyer Number that is valid for the selected Airline.';
                    $errObject['err_' + $cnt++] = $tmpObj;

                    // Remove Spinner
                    removeCarSpinnerGif();

                    // Display Error Message
                    displayErrorMessage($errObject);

                    return false;

                } else {

                    $('body').append(createCarSpinnerGif());    
                    $.ajax({
                        url: ADV_Rez_Ajax.ajaxurl,
                        method: 'POST',
                        data: formData,
                        dataType: 'json'
                    })
                    .done(function(data) {
                        //Driver Under Age 21 Error            
                        if (data.error_code == "AGE_UNDER_21_ERR") {

                            // Build error message
                            var $cnt = 0;
                            var $errObject = {};
                            var $tmpObj = {};
                            $tmpObj['title'] = 'Driver Age Error.';
                            $tmpObj['text'] = 'Driver under 21 may not rent a car';
                            $errObject['err_' + $cnt++] = $tmpObj;

                            // Remove Spinner
                            removeCarSpinnerGif();

                            // Display Error Message
                            displayErrorMessage($errObject);

                            return false;

                        }   
                        //Driver Under Age 21 Error            
                        if (data.error_code == "PROMO_CODE_ERR") {

                            // Build error message
                            var $cnt = 0;
                            var $errObject = {};
                            var $tmpObj = {};
                            $tmpObj['title'] = 'Promo code Error.';
                            $tmpObj['text'] = 'There is a problem with promo codes';
                            $errObject['err_' + $cnt++] = $tmpObj;

                            // Remove Spinner
                            removeCarSpinnerGif();

                            // Display Error Message
                            displayErrorMessage($errObject);

                            return false;

                        }      
                        
                        if(data.content == 'success' && data.confirmNum != '') {
                            window.location.href = 'complete/?status=success';
                        }
                        else {
                            window.location.href = 'confirm';
                        }
                        return false;
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        removeCarSpinnerGif(0);    
                    });

                }
                
                return false;     
        } else {
            var $cnt = 0;
            var $errObject = {};

            if ($payNowCheckbox.is(':checked')) {
                if(!$cancel_checkbox.is(':checked')) {
                    var $tmpObj = {};
                    $tmpObj['title'] = 'Please read the Cancellation Policy';
                    $tmpObj['text'] = 'If you agree, please check box next to "I agree with Cancellation Policy".';
                    $errObject['err_' + $cnt++] = $tmpObj;
                }
            }

            if (!$rentalPolicy.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Please read the Location Rental Policies.';
                $tmpObj['text'] = 'If you agree, please check box next to "I have read the Location Rental Policies".';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            if (!$terms.is(':checked')) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Please review the Advantage Rent A Car' + "'" + 's Terms and Conditions.';
                $tmpObj['text'] = 'If you agree, please check box next to "I agree with Advantage Rent A Car' + "'" + 's Terms and Conditions".';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

             // Check if the phone number is legit
            if(!validatePhoneNumber($phoneNumber)) {
                
                var $tmpObj = {};
                $tmpObj['title'] = 'Phone Number';
                $tmpObj['text'] = 'The phone number you entered is not correct. Please enter a phone number.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            // Check if email is valid
            if (!validateEmail($email.val())) {

                var $tmpObj = {};
                $tmpObj['title'] = 'Email';
                $tmpObj['text'] = 'The email entered is not correct. Please enter a correct email address. Example: email@domain.com';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            //check if the emails match
            if(!matchEmails($email.val(), $email2.val()))
            {
                var $tmpObj = {};
                $tmpObj['title'] = 'Email';
                $tmpObj['text'] = 'The emails you entered do not match. Please re-enter.';
                $errObject['err_' + $cnt++] = $tmpObj;
            }

            displayErrorMessage($errObject);
        }

        return false;
    }

     /* Method used to add the abandonment promocode */
    function handleAbandonmentPromocode(evt) {

        evt.preventDefault();

        $('body').append(createCarSpinnerGif());

        // Get Vehicle options and pass them back to the Reserve page.
        var vehicleOptions = [];
        var cnt = 0;
        $('.vehicle_options_checkbox_rez').each(function(i) {
            if ($(this).is(':checked')) {
                vehicleOptions[cnt] = $(this).val();
                cnt++;
            }
        });

        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: {
                // wp ajax action
                action: 'advAbandonment',
                ClassCode:$ClassCode,
                RateID:$RateID,
                vehicleEnhanceType:$vehicleEnhanceType,
                vehicleIndex:$vehicleIndex,
                vehicleOptions: vehicleOptions,
                firstName: document.getElementById("first_name").value,
                lastName: document.getElementById("last_name").value,
                email: document.getElementById("email").value,
                email2: document.getElementById("email2").value,
                // airlineNumber: document.getElementById("airlineNumber").value,
                // airline: document.getElementById("airline").value,
                // frequentFlyerAirline: document.getElementById("frequentFlyerNumber").value,
                // phoneNumber: document.getElementById("phone_number").value,
                // send the nonce along with the request
                advAbandonment: ADV_Rez_Ajax.advAbandonment
            },
            dataType: 'json'
        })
        .done(function(data) {
            $(window).off('beforeunload'); 
            $('.pum-theme-lightbox').popmake('close');
            window.location = '/reserve';
            removeCarSpinnerGif(15000);
            return true;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            //console.log("error");
            // console.log("jqXHR:" + jqXHR);
            // console.log(jqXHR);
            // console.log(textStatus);
            // console.log(errorThrown);
            removeCarSpinnerGif(0);
            return false;
        });
    }
    
    

    /*
     *  Event Listeners
     */
    
    $rewardsLoginForm.on('submit', handleRewardsLoginFormSubmit);
    $reserveForm.on('submit', handleReservationFormSubmit);
    $paymentType.on('change', handlePaymentTypeSelection);
    $dob.on('change', handleDateOfBirth);
    $payTotalCheckboxes.on('change', handlePayTotalCheckboxChange);
    $clearAirline.on('click', handleClearAirline);
    $abandonment_promocode.on('click', handleAbandonmentPromocode);
    $('#pay_with_card_option').on('change', handlePayNowCardFields);
    $creditCardNumber.on('blur', handleCardEncryptAdd);
    
    
    //Encrypty Credit card to save in user profile
    function handleCardEncryptAdd() {
        var pubKey = $("#pubKey").val();
        var cNumVal = $.trim($(this).val());
        var cNum = cNumVal.replace(/-/g, "");
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        var encrypted = encrypt.encrypt(cNum); 
        $('#card_enc_value').val(encrypted);
    } 

    // This is commented out for now. This handles the input scrolling on the reserve page.
    // $inputs.on('focus', handleInputFocus);

    /*
     *  Function Invocations
     */
    
    // Set the requiredfields based on the current value of the pay now checkbox
    if (!isPayNow) {
        RequiredFields.setPayLater();
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

    $dob.mask('00/00/0000');
    // $phoneNumber.mask('(000) 000-0000');

    phoneMask($phoneNumber);

    $phoneNumber.on('blur', function(){
        phoneMask($phoneNumber);
    });

    $phoneNumber.on('focus', function(){
        $phoneNumber.mask('0000000000000000000000000000000000000000');
    });

    function phoneMask($phoneSelector) {
        $phoneSelector.mask('0000000000000000000000000000000000000000');
        if ($phoneSelector.val().length === 10) {
            $phoneSelector.mask('(000) 000-0000'); 
        }
    }

    $('#state').select2({
        placeholder: 'State or Region',
    });
    $('#country').select2({
        placeholder: 'Country',
    });
    
    $('#pay_with_card_option').select2({
        placeholder: 'Saved Cards',
    });    
    
    calcReservePage();
//  /* close modify-option popup for mobile view */    
// $(".modify_option_close").on('click', function(event) {
// 		$('.login_options #modal').modal('toggle');
// 		$(".login_options #modal").addClass("modal fade");
// });  
  
  
    handleUserProfileInfo();
        
    function handleUserProfileInfo() {
        $('#use_member_profile_info').attr('user-opt-checked', false);
        if($('#use_member_profile_info').prop('checked') == true) {
            addRenterFormInfo();
            $('#use_member_profile_info').attr('user-opt-checked', true);
        }
        else {
            removeRenterFormInfo();
        }            
    } 
        
    $('#use_member_profile_info').click(function() {
        handleUserProfileInfo();		
    });
    
    function addRenterFormInfo() {
        $('#dob').val($('#pr_d_dob').val());
        $('#first_name').val($('#pr_d_first_name').val());
        $('#last_name').val($('#pr_d_last_name').val());
        $('#phone_number').val($('#pr_d_phone').val());
        $('#email').val($('#pr_d_email').val());
        $('#email2').val($('#pr_d_email').val());
        $('#street_address_1').val($('#pr_d_address_1').val());
        $('#street_address_2').val($('#pr_d_address_2').val());
        $('#postal_code').val($('#pr_d_zip').val());
        $('#city').val($('#pr_d_city').val());
        $('#state').val($('#pr_d_state').val()).change();

        if($.trim($('#dob').val()) != '') {
            //$('#dob').prop('disabled', true);
            $('#dob').trigger('blur');
        }
        if($.trim($('#first_name').val()) != '')
            $('#first_name').prop('readonly', true);       
        if($.trim($('#last_name').val()) != '')
            $('#last_name').prop('readonly', true); 
        if($.trim($('#phone_number').val()) != '')
            $('#phone_number').prop('readonly', true);             
        if($.trim($('#email').val()) != '')
            $('#email').prop('readonly', true);             
        if($.trim($('#email2').val()) != '')
            $('#email2').prop('readonly', true);             
        if($.trim($('#street_address_1').val()) != '')
            $('#street_address_1').prop('readonly', true);             
        if($.trim($('#street_address_2').val()) != '')
            $('#street_address_2').prop('readonly', true);             
        if($.trim($('#postal_code').val()) != '')
            $('#postal_code').prop('readonly', true);             
        if($.trim($('#city').val()) != '')
            $('#city').prop('readonly', true);        
        if($.trim($('#state').val()) != '') {
            $('#state option').prop("disabled", true);
            $('#state').select2();                
        }

        handleDateOfBirth();
        //$("select#state").prop('selectedIndex', 5);
    }
        
    function removeRenterFormInfo() {
        $('#dob').prop('disabled', false);
        $('#first_name').prop('readonly', false);
        $('#last_name').prop('readonly', false);
        $('#phone_number').prop('readonly', false);
        $('#email').prop('readonly', false);
        $('#email2').prop('readonly', false);
        $('#street_address_1').prop('readonly', false);
        $('#street_address_2').prop('readonly', false);
        $('#postal_code').prop('readonly', false);
        $('#city').prop('readonly', false);
        $('#state option').prop("disabled", '');
        $('#state').select2();
    }

})(jQuery, document, window);

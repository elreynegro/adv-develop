(function($, document, window) {
    var $cars = $('.aez-car-option');
    var $radios = $('input[type="radio"][name="rate_id"]');
    var $options = $('.aez-options');
    var $free_express_code = $('.free_express_code');
    var $submitEnhance = $('#submit-enhance');
    var isFreePromoUpdated = 0;

    function list_code() {
        $payment_type = document.getElementById('payment_type').value;
        if ($payment_type == 'prepaid') {
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
        _ltk.SCA.AddItemWithLinks([$ls_descp], [1], [$ls_vehicleTotal], [$ls_descp], [$vehicle_image], '/reserve/');
        _ltk.SCA.Meta1 = [$pickup_date_time];
        _ltk.SCA.Meta2 = [$dropoff_date_time];
        _ltk.SCA.Meta3 = [$rental_location];
        _ltk.SCA.Meta4 = [$return_location];
        _ltk.SCA.Submit();
    }
    $(window).on("load", list_code);

    function setRadio(classCode) {
        $radios.each(function() {
            var radioClassCode = $(this).data('classCode');
            if (classCode === radioClassCode) $(this).prop('checked', true);
        });
    }

    function setSelected() {
        var $selected = $cars.filter(function() {
            if ($(this).data('selected')) return $(this);
        });
        return setRadio($selected.data('classCode'));
    }

    function setCheckbox($checkbox) {
        return $checkbox.attr('checked', true);
    }

    function unsetCheckbox($checkbox) {
        return $checkbox.attr('checked', false);
    }
    if (window.location.href.indexOf("enhance") > -1) {
        $('.pull-right').css('margin-bottom', '3%');
    }

    function getEnhanceChoices() {
        window.onunload = function() {};
        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'GET',
            data: {
                action: 'advGetEnhanceChoices'
            },
            dataType: 'json',
            cache: false
        }).done(function(data) {
            if (!('error' in data)) {
                $('input[name="rate_id"]').each(function() {
                    if ($(this).data('classCode') == data.ClassCode) {
                        $(this).prop("checked", true);
                        $(this).parents('.aez-car-option').addClass('aez-car-option--active');
                        $(this).parents('.aez-car-option').data('selected', 'true');
                        $(this).parents('.aez-car-option').data('selected', 'true');
                    } else {
                        $(this).prop("checked", false);
                        $(this).parents('.aez-car-option').removeClass('aez-car-option--active');
                        $(this).parents('.aez-car-option').data('selected', 'false');
                    }
                });
                $.each(data.vehicleOptions, function(key, value) {
                    selected_id = '#' + value;
                    $(selected_id).parent('.aez-options').addClass('aez-options--active');
                    $(selected_id).parent('.aez-options').find('.vehicle_options_checkbox').attr('checked', 'checked');
                });
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            return false;
        });
        return false;
    }

    function setActiveOption($option) {
        var $checkbox = $option.find('input[type="checkbox"]');
        var isSelected = $option.data('selected');
        var handle_control=$option.attr('addtional-opt-code');

        if ($checkbox.prop('checked') == true) {
            $option.data('selected', false).removeClass('aez-options--active aez-options-pre-sel');
            $option.removeAttr("data-ribbone");
            unsetCheckbox($checkbox);
        } else {
           /* handling hand control left and right */
            if(handle_control=="HCR") {  
                $option.data('selected', true).addClass('aez-options--active');
                setCheckbox($checkbox);
                $option.parent().find('.HCL').removeClass('aez-options--active aez-options-pre-sel').removeAttr("data-ribbone");
                $("#HCL").attr('checked', false);
                            
            }else if(handle_control=="HCL") {
                 $option.data('selected', true).addClass('aez-options--active');
                 setCheckbox($checkbox);
                 $option.parent().find('.HCR').removeClass('aez-options--active aez-options-pre-sel').removeAttr("data-ribbone");
                 $("#HCR").attr('checked', false);             
            }else {
                $option.data('selected', true).addClass('aez-options--active');
                setCheckbox($checkbox);
            }          
        }
    }

    function handleCarClick(evt) {
        evt.preventDefault();
        $cars.not(this).data('selected', false).removeClass('aez-car-option--active');
        $(this).data('selected', true).addClass('aez-car-option--active');
        setSelected();
    }

    function handleOptionClick(evt) {
        evt.preventDefault();
        var $option = $(this);
        var $checkbox = $option.find('input[type="checkbox"]');
        var isSelected = $option.data('selected');
        var addtional_opt_price=$option.attr('addtional-opt-price');   
        var addtional_opt_code=$(this).attr('addtional-opt-code').toLowerCase();       
        
        setActiveOption($option);

        /* enable price and text when user unselect preselected option */
        if(!$(this).hasClass('aez-options--active')) {    
                /* user unset activeoption then price into zero */
                if(addtional_opt_price =='0') {
                     $('.exp-spl-text'+addtional_opt_code).text('0.00');
                     $("button."+addtional_opt_code).removeClass('aez-btn--outline-blue-background');

                }else {
                     $('.exp-spl-text'+addtional_opt_code).text(addtional_opt_price);
                     $("button."+addtional_opt_code).removeClass('aez-btn--outline-blue-background');  
                }
               /* enable expressway text by validate stackable */ 
                var this_opt_exp = $(this);
                var opt_stackable = $(this).find("div.free_express_code").data('stackable');
                var opt_exp_selected = $(this).find("div.free_express_code").attr('expressway-selected');
                if(opt_stackable == 'False' && opt_exp_selected == 'true') {
                    $('.free_express_code').each(function( index ) {
                        var  only_valid_stackable = $(this).data('stackable');
                        if(only_valid_stackable == "False") {
                            $(this).removeClass('free-text-disable');
                        }
                    });
                }

                if(opt_exp_selected == 'true') {
                    isFreePromoUpdated = 1;
                    $(this_opt_exp).find("div.free_express_code").removeClass('free-text-disable');  
                    $(this_opt_exp).find("div.free_express_code").removeAttr("expressway-selected");
                }            

        }    
         
    }
    
    function handleExpressWay(evt) {
        var data_express_free = $(this).attr( "data-express-free").toLowerCase(); 
        $("button."+data_express_free).addClass('aez-btn--outline-blue-background');
        //$('.exp-spl-text'+data_express_free).addClass('aez-btn--outline-blue-background'); 
        
        //To stop parent click
        var opt_checked = $('#'+$(this).attr( "data-express-free")).prop('checked');
        if(opt_checked) {
            evt.stopPropagation();
        }        
        $(this).attr('expressway-selected', true);       
        $('.exp-spl-text'+data_express_free).text('0.00');
        
        var  expressway_selected=$(this).attr('data-stackable');      
        /* disable select free with  expressway text while user select it*/
        if (expressway_selected == "False") {
                    $('.free_express_code').each(function() {
                        var  only_valid_stackable=$(this).data('stackable');
                            if (only_valid_stackable == "False") {

                                 $(this).addClass('free-text-disable');
                            }
                    });
        }else {
            $(this).addClass('free-text-disable');
        }
    }


    function handleEnhanceSubmit(evt) {
        evt.preventDefault();
        removeErrMsg();
        var classCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
        var rateId = $(".aez-car-option--active input[name='rate_id']").data('rateId');
        var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
        var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');
        var vehicleOptions = [];
        var cnt = 0;
        $('.vehicle_options_checkbox').each(function(i) {
            if ($(this).is(':checked')) {
                vehicleOptions[cnt] = $(this).val();
                cnt++;
            }
        });
        var ClassCode = $(".aez-car-option--active input[name='rate_id']").data('classCode');
        var RateID = $(".aez-car-option--active input[name='rate_id']").data('rateId');
        var vehicleEnhanceType = $(".aez-car-option--active input[name='rate_id']").data('vehicleEnhanceType');
        var vehicleIndex = $(".aez-car-option--active input[name='rate_id']").data('vehicleIndex');

        //Get selected expressway promo codes
        var expressway_container = $('.free_express_code');
        
        if(expressway_container.length > 0) {
            var exp_codes_ar = [];
            $(expressway_container).each(function( index ) {
                if( $( this ).attr('expressway-selected')){
                    exp_codes_ar.push($( this ).attr('data-promo-code'));
                }
            });
            var expresswayFlowPromos = exp_codes_ar.join();
          
        }
        
        var formData = {
            action: 'advRezReserve',
            advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
            vehicleOptions: vehicleOptions,
            ClassCode: ClassCode,
            RateID: RateID,
            vehicleEnhanceType: vehicleEnhanceType,
            vehicleIndex: vehicleIndex,
            expresswayFlow:1,
            expresswayFlowPromos:expresswayFlowPromos,
            expresswayEnhance:1,
            isFreePromoUpdated: isFreePromoUpdated
        };
        $('body').append(createCarSpinnerGif());
        $.ajax({
            url: ADV_Rez_Ajax.ajaxurl,
            method: 'POST',
            data: formData,
            dataType: 'json'
        }).done(function(data) {
            window.location = '/reserve';
            removeCarSpinnerGif(15000);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            removeCarSpinnerGif(0);
            return false;
        });
        return true;
    }
    $cars.on('click', handleCarClick);
    $free_express_code.on('click', handleExpressWay);
    $options.on('click', handleOptionClick);
    $submitEnhance.on('submit', handleEnhanceSubmit);
    
    getEnhanceChoices();
    // objectFit.polyfill({
    //     selector: 'img',
    //     fittype: 'cover',
    //     disableCrossDomain: 'true'
    // });
})(jQuery, document, window);
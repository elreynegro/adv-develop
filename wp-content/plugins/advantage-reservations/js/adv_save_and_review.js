(function($) {
    var $newPromos = [];
	$(document).ready(function() {
        $(function () {$('[data-toggle="tooltip"]').tooltip()})
		var $saveAndContinueButton = $('.aez-reservation__save-btn');

		function handleSaveAndContinueClick(evt) {
	        evt.preventDefault();

	        $('.aez-reservation-flow-form')
	        	.find('input[type=submit], button[type=submit]')
	        	.trigger('click');
	    }

		$saveAndContinueButton.on('click', handleSaveAndContinueClick);
	});
   
   var inactive_promocodes = [];

        $('#edit_option_container').click(function() {
            if($(this).attr('data-display') == '0') {
                $('.express_extra_options._mobile').css('display', 'none');  
                $('.express_extra_options .remove_option_btn').show();
                $('.express_extra_options .no_options_container').hide();
                $(this).attr('data-display','1');
            } else {
                $('.express_extra_options._mobile').hide();  
                $('.express_extra_options._mobile').css('display', 'block');     
                $(this).attr('data-display','0');
                $('.vehicle_options_checkbox_rez').prop('checked', false);
                $('.option_selected_list .vehicle_options_checkbox_rez').prop('checked', true);
            }
        });

        if($(window).width() < 910){
            $('#edit_option_container_modal').click(function() {
                if($(this).attr('data-target')) {
                    $(this).removeAttr('data-target');
                }
                $("#modal").toggleClass('modal fade');
            });
            $(".modify_option_close").on('click', function(event) {
                $('#edit_option_container_modal').attr('data-target', '#modal');
                $("#modal").toggleClass("modal fade");
            });  
        }

        // When the modify option button is clicked and the modal pops up check if the abandonment promo code exists
        // so we can remove buttons that look like they are clicked when they shouldn't be
        $('#edit_option_container_modal').click(function() {
            var $abandonment_promocode_exists = $('#abandonment_promocode_exists').val();
            if ($abandonment_promocode_exists == "true") {
                // Loop through all the list elements
                $('.reserve_page_2_column_design li').each(function () {
                    if ($(this).data("promo_code")) {
                        if ($(this).find("a.exp_vehicle_option_exp_link_disabled")) {

                            // Remove classes so buttons don't show as being clicked.
                            $(this).find("a.expressway-options-btn").removeClass("btn_list_benifits_active");
                            $(this).find("a.expressway-options-btn").removeClass("exp_vehicle_option_exp_link_disabled");
                            
                            // Add the amount to the Childseat button
                            var amount =  $(this).find("div.reserve-option-amount-modal").data("org_amt");
                             $(this).find("div.reserve-option-amount-modal label").html(amount);
                        }
                    }
                });

                // Make the link "OR SELECT FREE WITH EXPRESSWAY" enabled to be clicked
                $('.free_benefit_button_parent button').each(function () {
                    $(this).removeClass("btn_list_benifits_active");
                    $(this).removeAttr("disabled");
                });
            }
         });

        $('#exp_checkout_cancel_option').click(function() {
            $('.express_extra_options .remove_option_btn').hide();
        });

        $('.vehicle_options_checkbox_rez').click(function() {
            /*$('#'+$(this).attr('id')+'_option').attr('class', '').addClass('option_close_btn');
            if($(this).prop('checked') == true) {
                $('#'+$(this).attr('id')+'_option').attr('class', '').addClass('option_select_btn');
            }*/
        });

        $(".expressway-options-btn").click(function() {
            if (!$(this).hasClass("btn_list_benifits_active")) {
                inactive_promocodes.push(this.getAttribute('data-promo_code'));
            }
            if ($(this).hasClass("btn_list_benifits_active")) {
                var index = $.inArray(this.getAttribute('data-promo_code'), inactive_promocodes);
                if (index !== -1) {
                    inactive_promocodes.splice(index, 1);
                }
            }
        });

        var $currentPromos =  function(){
            $i = 0;
            $getPromos = [];
            $('.aez-validate-promo-code').each(function(){
                $getPromos[$i] = $(this).val();
                $i = $i + 1;
            });
            return $getPromos;
        };

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

        $(".expressway_flow_apply_to_reservation").click(function(){
           
            removeErrMsg();

            // Set inactive_promocodes values
            inactive_promocodes = [] ;
            $(".expressway-options-btn").each(function() {
                if (!$(this).hasClass("btn_list_benifits_active")) {
                    if($(this).is(':visible')) {
                        inactive_promocodes.push(this.getAttribute('data-promo_code'));
                    }
                }
                if ($(this).hasClass("btn_list_benifits_active")) {
                    var index = $.inArray(this.getAttribute('data-promo_code'), inactive_promocodes);
                    if (index !== -1) {
                        inactive_promocodes.splice(index, 1);
                    }
                }
            });

            if($("#modal").data('bs.modal')){
                $("#modal").modal("hide");
            } 

            var vehicleOptions = [];
            var cnt = 0;
            $('.vehicle_options_checkbox_rez').each(function(i){
               if($(this).is(':checked'))
                {
                    vehicleOptions[cnt] = $(this).val();
                    cnt++;
                }
            });

            $newPromos = $currentPromos();
            $newPromos = $cleanPromoArray($newPromos);
            $newPromos.sort();
            var ClassCode = $(".express_extra_options_container input[name='opt_class_code']").val();
            var RateID = $(".express_extra_options_container input[name='opt_rate_id']").val();
            var vehicleEnhanceType = $(".express_extra_options_container input[name='opt_vehicle_enhance_type']").val();
            var vehicleIndex = $(".express_extra_options_container input[name='opt_vehicle_index']").val();
            var expresswayFlowPromos = $("#expressway_promo_codes_list").val();
            var payType = $("#submit-reserve input[name='pay_total']:checked").val();
            var new_promo_stack = $("#new_promo_stack").val();
            var abandonment_promocode_exists_2 = $('#abandonment_promocode_exists_2').val();

            // If abandonment promo code 2 is setnull and expresswayFlowPromos has a promo code in it then 
            // then don't display the popup after updating the Modify Options
            if (((abandonment_promocode_exists_2 == null || abandonment_promocode_exists_2 == "false") && (expresswayFlowPromos !== null && expresswayFlowPromos !== ''))) {
                blueConicClient.event.subscribe('exitintent', this, function() {
                    $('.pum-theme-lightbox').css('display', 'none');
                });
            }

            //Send only UNIQUE promocode values in expresswayFlowPromos
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }

            // Check if the new promo stack is in the expresswatFlowPromos. If it is then set the 
            // expressway_promo_codes_list to the new promo stack
            if (new_promo_stack !== undefined && expresswayFlowPromos.indexOf(new_promo_stack) != -1) {
                $('#expressway_promo_codes_list').val(new_promo_stack);

            }
            // Unique array and converting it back to a string type
            if(expresswayFlowPromos !== undefined) {
                expresswayFlowPromos = expresswayFlowPromos.split(',');
                expresswayFlowPromos = expresswayFlowPromos.filter( onlyUnique );
                expresswayFlowPromos = expresswayFlowPromos.toString();
            }

            var formData = {
                action: 'advRezReserve',
                advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
                vehicleOptions: vehicleOptions,
                ClassCode: ClassCode,
                RateID: RateID,
                payType: payType,
                vehicleEnhanceType: vehicleEnhanceType,
                vehicleIndex: vehicleIndex,
                expresswayFlow:1,
                expresswayFlowPromos:expresswayFlowPromos,
                deletePromoCode:inactive_promocodes,
                reservesummaryupdated_without_pagereload:1
            };
            
             $('body').append(createCarSpinnerGif());
             $("body").tooltip({ selector: '[data-toggle=tooltip]' });

            $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data: formData,
                dataType: 'json'
            })
            .done(function(data) {
                
                    removeErrMsg();
                    $('.aez-warning-container').hide();
                    removeCarSpinnerGif(0);
                    $('.page-template-reserve .modal-backdrop').css('display','none');
                   var resvalue = jQuery.parseJSON(data); 
                   
                    $(function () {$('[data-toggle="tooltip"]').tooltip()})             
                    //show success message for updated price 
                    $( ".showmessage" ).show( 0 ).delay( 2000 ).slideUp( 1000 );
                    $( ".modify_option_close" ).trigger( "click" );


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
                     
                    var validPromocodeArray = [];
                    $(".aez-validate-promo-code").each(function() {
                        validPromocodeArray.push($(this).val());
                    });
                    if(validPromocodeArray != ''){
                        recheckModifyOptions(validPromocodeArray);
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
        });
        
        
        function recheckModifyOptions(validPromocodeArray){
            var temp_arr = [];
            $(".expressway-options-btn").each(function() {
                var promo_code = $(this).data('promo_code').toString();
                //check the current promocode is match with entered promocode
                var index = $.inArray(promo_code, validPromocodeArray);
                var index1 = $.inArray(promo_code, temp_arr);
                var index2 = $.inArray(promo_code, validPromocodeArray);
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
                
        $('#exp_checkout_update_option').click(function() {
            removeErrMsg();
            
            var vehicleOptions = [];
            var cnt = 0;
            $('.vehicle_options_checkbox_rez').each(function(i){
               if($(this).is(':checked'))
                {
                    vehicleOptions[cnt] = $(this).val();
                    cnt++;
                }
            });
            
            var ClassCode = $(".express_extra_options input[name='opt_class_code']").val();
            var RateID = $(".express_extra_options input[name='opt_rate_id']").val();
            var vehicleEnhanceType = $(".express_extra_options input[name='opt_vehicle_enhance_type']").val();
            var vehicleIndex = $(".express_extra_options input[name='opt_vehicle_index']").val();
            var expresswayFlowPromos = $("#expressway_promo_codes_list").val();

            var formData = {
                action: 'advRezReserve',
                advConfirmNonce: ADV_Rez_Ajax.advConfirmNonce,
                vehicleOptions: vehicleOptions,
                ClassCode: ClassCode,
                RateID: RateID,
                vehicleEnhanceType: vehicleEnhanceType,
                vehicleIndex: vehicleIndex,
                expresswayFlow:1,
                expresswayFlowPromos:expresswayFlowPromos
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
                window.location = '/reserve';
                removeCarSpinnerGif(15000);

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
            
        });
               
        handleUserProfileInfo();
        
        function handleUserProfileInfo() {
            
            if($('#use_member_profile_info').prop('checked') == true) {
                addRenterFormInfo();
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
            
            if($.trim($('#dob').val()) != '')
                $('#dob').prop('disabled', true);
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
        
        $(document).ready(function() {        
            //On click pay now option
            var pay_now_container = $('#pay_now_total_container');
            var cancel_container = $('.aez-form-payonline-container');
            var pay_now_content_display = $('.pay_now_content_display');
            var $payNowCheckbox = $('#pay_now_total');
            var isPayNow = $payNowCheckbox.is(':checked');
            if(!isPayNow) {
                $("#billing_street_address_1").removeAttr('required');
                $("#billing_postal_code").removeAttr('required');
                $("#billing_city").removeAttr('required');
                $(cancel_container).hide();
                // $('.aez-form-billing-address').hide();
            }

            $('input[name=pay_total]').click(function() {
                var pay_total_val = $(this).val();
                $(pay_now_container).hide();
                $(pay_now_content_display).hide();
                $(cancel_container).hide();
                $("#billing_street_address_1").removeAttr('required');
                $("#billing_postal_code").removeAttr('required');
                $("#billing_city").removeAttr('required');
                if(pay_total_val == 'pay_now') {
                    $(cancel_container).show();
                    $(pay_now_container).show();
                    $(pay_now_content_display).show();
                    // $('.aez-form-billing-address').show();
                    $("#billing_street_address_1").attr('required');
                    $("#billing_postal_code").attr('required');
                    $("#billing_city").attr('required');
                }
            });
        });
        
        
})(jQuery);
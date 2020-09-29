(function ($, document, window) {
    
    $('#submit-refer-friends').on('click', function (e) {
        hideErrorMsgF();
    });
    
    $('#refer_friends').on('submit', function (e) {

        var emailFlag = true;
        hideErrorMsgF();

        //Email validation
        $('#refer_friends .refer_email').each(function() {
            if($.trim($(this).val()) != '') {
                var email_validate = validateEmail($(this).val());
                if(!email_validate) {
                    emailFlag = false; 
                }
            }
        });
        
        if (emailFlag) {
                    $('body').append(createCarSpinnerGif());
                    
                    var emails_val = $("#refer_friends input[name='emails[]']").map(function(){return $(this).val();}).get();
                    
                    $.ajax({url: ADV_Rez_Ajax.ajaxurl,
                            method: 'POST',
				data: {
					action: 'advReferFriends',
					emails: emails_val,
                                        ReferralId: $('#ReferralId').val()
				},
				dataType: 'json'
			}).done(function (response) {
                            if (response.status == "success") {
                                    removeCarSpinnerGif(0);
                                    $('#refer_friends').remove();
                                    $('#refer_friends_success').show();
                                    $('#ref_fail_emails').html(response.error_message);
                                    return false;
                            }      
                            else if (response.email_err == "1") {
                                    showErrorMsgF('Please enter valid email format');
                                    removeCarSpinnerGif(0);
                                    return false;
                            }
                            else if (response.status == "error") {
                                   showErrorMsgF(response.error_message);
                                    removeCarSpinnerGif(0);
                                    return false;
                            }
                    });

            } else {
                // Check emails are valid.
                if (emailFlag === false) {
                    showErrorMsgF('Please enter valid email format');
                    removeCarSpinnerGif(0);
                    return false;
                }
            }

        return false;

    });
    
    function showErrorMsgF(msg) {
        $('#refer_friends #error_container').html(msg).show();   
    }
    function hideErrorMsgF() {
        $('#refer_friends #error_container').hide();   
    }    

    function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
    }
        
}(jQuery, document, window));
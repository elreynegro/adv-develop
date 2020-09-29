(function($, document, window) {
    
var $popupSignupForm = $('#popup_adv_awards_sign_up');

 // Validate a phone number, returns true if valid and false if not
 function validatePhoneNumber(phonenumber) {
    // Regex for the phone number
    // var phoneregx = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;
    if(phonenumber !== ''){
        var phoneregx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
        return phoneregx.test(phonenumber);
    }
    return true;
}
// Validate an email address, returns true if valid and false if not
function validateEmail(email) {
    // Regex to test if the email has @ . in it
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
 // Create hidden input fields
 function createHiddenInput(name, value) {
    return $('<input>', {
        type: 'hidden',
        name: name,
        value: value
    });
}

$enroll_code = "RCPUP";
$( "#signup_menu" ).click(function()  {
    $enroll_code = "RQSPUP";
});

function handleAdvAwardSignUpFormSubmit(evt) {
    evt.preventDefault();
    removeErrMsg();
    var $rentalPolicy = $('#read_i_agree_terms');
    
    // var $email = $('#email');
    var $password = $('#password1');
    var $confirmPassword = $('#confirm_password1');

    var $email = $('#email1');

    var $phoneNumber = $('#phone_number1');

    // Check if the email and the confirm email are the same, if not set flag to false
    var $passwordFlag = true;
    if ($password.val() !== $confirmPassword.val()) {
        $passwordFlag = false;
    }

    if($("#EmailOptIn").prop('checked') == true){ $emailOptin = "true";}
    else {$emailOptin = "false";}
    if($("#SMSOptIn").prop('checked') == true){$smsOptin = "true";}
    else {$smsOptin = "false";}
                
    if ($rentalPolicy.is(':checked') && validateEmail($email.val()) && $passwordFlag && validatePhoneNumber($phoneNumber.val())) {

        // Put transition gif in place here
        // Appending it to the body
        $('body').append(createCarSpinnerGif());
        
        var getLoyaltyUrlPromise, newLoyaltyUrl;
        $ajax_URL = window.location.protocol + "//" + window.location.hostname + '/wp-admin/admin-ajax.php';

        getLoyaltyUrlPromise =
        $.post(
            $ajax_URL, {
                action: 'advGetLoyaltyUrl'
            },
            function(response) {
                return response;
            }
        );

        $.when(getLoyaltyUrlPromise)
        .done(function(data_url){

            var $form = $('<form>', {
                action: '/complete',
                method: 'POST',
                enctype: 'multipart/form-data',
            });

            $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                data: {
                    // wp ajax action
                    action: 'advCreateUserpopup',
                    first_name: document.getElementById("first_name1").value,
                    last_name: document.getElementById("last_name1").value,
                    email: document.getElementById("email1").value,
                    password: document.getElementById("password1").value,
                    // dob: document.getElementById("dob1").value,
                    phone_number: document.getElementById("phone_number1").value,
                    EmailOptIn: $emailOptin,
                    SMSOptIn: $smsOptin,
                    EnrollSource: $enroll_code,
                    // send the nonce along with the request
                    advLogoutNonce: ADV_Rez_Ajax.advLogoutNonce
                },
                dataType: 'json',
                success: displaySuccessMessage($errObject)
            })
            .done(function(response_object) {

                if (typeof response_object === 'object') {
                    var data = response_object;
                } else {
                    var data = JSON.parse(response_object);

                }

                if (response_object.status == "error")  {

                    var $cnt = 0;
                    var $errObject = {};

                    var $tmpObj = {};
                    $tmpObj['title'] = 'User cannot be created';
                    $tmpObj['text'] = data.error.errorMessage;
                    $errObject['err_' + $cnt++] = $tmpObj;

                    displayErrorMessage($errObject);

                    // Remove Spinner
                    removeCarSpinnerGif(0);

                    return false;

                } else if (response_object.Status == "OK" || response_object.hasOwnProperty('memberNumber')) {

                    removeSuccessMsg();
                    removeErrMsg();
                    var $cnt = 0;
                    var $errObject = {};
                    var $tmpObj = {};
                    $tmpObj['title'] = 'Account Created';
                    $tmpObj['text'] = 'Your account created successfully.';
                    $errObject['err_' + $cnt++] = $tmpObj;

                    // Close popup
                    $('.pum-theme-framed-border').popmake('close');

                    displaySuccessMessage($errObject);

                    removeCarSpinnerGif(0);

                    return true;

                } else if (response_object.Status == "exists") {

                    var $cnt = 0;
                    var $errObject = {};
                    var $tmpObj = {};
                    $tmpObj['title'] = 'User cannot be created';
                    $tmpObj['text'] = data.Msg;
                    $errObject['err_' + $cnt++] = $tmpObj;

                    displayErrorMessage($errObject);

                    // Remove Spinner
                    removeCarSpinnerGif(0);

                    return false;
                }
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

        });
    
    } else {

        var $cnt = 0;
        var $errObject = {};

        if (!$rentalPolicy.is(':checked')) {

            var $tmpObj = {};
            $tmpObj['title'] = 'Terms & Conditions';
            $tmpObj['text'] = 'Please read & accept Advantage Expressway terms and conditions to continue.';
            $errObject['err_' + $cnt++] = $tmpObj;
       }

        // Check if the phone number is legit
        if(!validatePhoneNumber($phoneNumber.val())) {
            
            var $tmpObj = {};
            $tmpObj['title'] = 'Invalid Phone Number';
            $tmpObj['text'] = 'The phone number you entered is not correct. Please enter a phone number.';
            $errObject['err_' + $cnt++] = $tmpObj;
        }

        // Check if the email is valid
        if (!validateEmail($email.val())) {

            var $tmpObj = {};
            $tmpObj['title'] = 'Invalid Email Address';
            $tmpObj['text'] = 'Email entered is not correct. Please enter a correct email address. Example: email@domain.com';
            $errObject['err_' + $cnt++] = $tmpObj;
        }

        // Check if the password and confirm password matches.
        if ($passwordFlag === false) {
            var $tmpObj = {};
            $tmpObj['title'] = 'Passwords do not match';
            $tmpObj['text'] = 'The password and confirm password do not match. Please enter the same password in both.';
            $errObject['err_' + $cnt++] = $tmpObj;
        }
        
        displayErrorMessage($errObject);
    }
   
    return true;

}
var eighteenYearsAgo = moment().subtract(18, 'years').toDate();
var dateOfBirth = new Pikaday({
    field: document.getElementById('dob1'),
    format: 'MM/DD/YYYY',
    defaultDate: moment('01/01/1980', 'MM/DD/YYYY').toDate(),
    maxDate: moment().subtract(18, 'years').toDate(),
    position: 'automatic',
    reposition: true,
    theme: 'triangle-theme',
    yearRange: [1900, moment(eighteenYearsAgo).format('YYYY')],
});


$popupSignupForm.on('submit', handleAdvAwardSignUpFormSubmit);

})(jQuery, document, window);
/*
 *	Survey Page Script
 */

(function($) {

    /*
     *	Variable References
    */
    var $surveyForm = $('#survey-form');
    var $remarkField = $('.remark_field');
    var services_url = '';
    var logging_url = '';

    /* 
     *  Functions
    */
    function handleSurveyFormSubmit(evt) {
        if(validateOptions()) {
            
            var sResponse = {};
            
           var qSurvey = $('.qsurvey');
            $.each(qSurvey, function( index, value ) {
                var thisId = $(value).attr('q_id');
                var qvals = {};
                
                
                if($('input[name=ans_'+thisId+'].type_1').is(':radio')) {
                    var thisVal = $('input[name=ans_'+thisId+']:checked').val();
                    qvals['qType'] = 1;
                }
                else if($('input[name=ans_'+thisId+'].type_2').is(':radio')) {
                    var thisVal = $('input[name=ans_'+thisId+']:checked').val();
                    qvals['qType'] = 2;
                }                
                else {
                    var thisVal = $('textarea[name=ans_'+thisId+'].type_3').val();
                    qvals['qType'] = 3;
                }
                
                
                qvals['qVal'] = thisVal;
                sResponse[thisId] = qvals;
            });
            
            console.log(sResponse);
            $('body').append(createCarSpinnerGif());
            
            //Submit response to API
            $.ajax({
                url: ADV_Rez_Ajax.ajaxurl,
                method: 'POST',
                datatype: 'JSON',
                data: {
                    action: 'submitSurvey',
                    survey_answers: sResponse,
                },
            }).done(function (data) {
                if(data.IsError == false) {
                    var base_url = window.location.protocol + "//" + window.location.hostname+'/';
                    window.location.href = base_url+"survey-thank-you-page";
                }
                else {
                    var $cnt = 0;
                    var $errObject = {};
                    var $tmpObj = {};
                    $tmpObj['title'] = 'Survey Submission Error';
                    $tmpObj['text'] = data.ErrorMessage.Message;
                    $errObject['err_' + $cnt++] = $tmpObj;
                    displayErrorMessage($errObject);
                }
                removeCarSpinnerGif(0);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                var $cnt = 0;
                var $errObject = {};
                var $tmpObj = {};
                $tmpObj['title'] = 'Survey Submission Error';
                $tmpObj['text'] = 'An error has occurred. please try again later.';
                $errObject['err_' + $cnt++] = $tmpObj;
                displayErrorMessage($errObject);
                removeCarSpinnerGif(0);
                return false;
            });           

        }
        return false;
    }
    
    function validateOptions() {
        
        //Validate Radio Buttons
        var fOptions = $('.survey_form_options:radio');
        var optionNames = [];
        var error = 0;
        var errMsg = "";
        $.each(fOptions, function( index, value ) {
            error = 0;
            if(!$('input[name='+$(value).attr('name')+']').is(':checked')) {
                error = 1;
                errMsg += '<li>Please answer survey questions to proceed</li>';
                return false;
            }
        });
        
        //Validate Remark field
        remarkLength = $.trim($remarkField.val()).length;
        $remarkField.css('border', '1px solid #d1d1d1');
        if(remarkLength > 500) {
            error = 1;
            errMsg += '<li>Comments should not be more than 500 characters</li>';
            $remarkField.css('border', '1px solid red');
        }
        
        if(error == 1) {
            $('#survey-form .error_message_survey').html(errMsg).show();
            return false;
        }
        else {
            $('#survey-form .error_message_survey').html('').hide();
            return true;
        }
    }
    
    function handleFeedbackKeyup() {
        var len = 0;
        var maxchar = 500;        
        len = $remarkField.val().length;

        
        var charLeft = maxchar;
        if(len > 0) {
            charLeft = maxchar -  len;
        }  
        if(len > maxchar) {
            charLeft = 0;
        }
        $( "#remainingChars" ).html( "Remaining Characters: " +( charLeft ) );
    }
    

    /*
     *  Event Listeners
     */
    $surveyForm.on('submit', handleSurveyFormSubmit);
    $('.remark_field').on('keyup', handleFeedbackKeyup);


})(jQuery);

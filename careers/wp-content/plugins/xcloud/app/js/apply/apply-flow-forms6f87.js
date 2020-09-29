'use strict';
var applyFlowModule = angular.module("com.hrlogix.ats.applyflow");
if (applyFlowModule !== undefined && applyFlowModule !== null) {

    applyFlowModule.directive('passwordConfirm', function () {
        return {
            require: 'ngModel',
            scope: {
                compare: "="
            },
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.passwordConfirm = function(modelValue) {
                    if(modelValue != 'undefined' && modelValue != null)
                        return modelValue == scope.compare;
                    else if(modelValue == 'undefined' || modelValue == null){
                        if(scope.compare != 'undefined' && scope.compare != null)
                            return false;
                        else
                            return true;
                    }
                };

                scope.$watch("compare", function() {
                    ctrl.$validate();
                });
            }
        };
    });

    applyFlowModule.directive('passwordStrength', function () {
        return {
            require: '?ngModel',
            scope: true,
            link: function (scope, elm, attrs, ctrl) {
                if (ctrl) {
                    ctrl.$validators.passwordConfirm = function (modelValue) {
                        var $ = jQuery;
                        var _force = false;                    
                        var _regex = /[$-/:-?{-~!@#%&*()"^_`\[\]]/g;
                        if(modelValue != undefined){
                            var _lowerLetters = /[a-z]+/.test(modelValue);
                            if(_lowerLetters){
                                $('#passwordLower').removeClass('passwordReqNotMet');
                            }else{
                                $('#passwordLower').addClass('passwordReqNotMet');
                            }
                            var _upperLetters = /[A-Z]+/.test(modelValue);
                            if(_upperLetters){
                                $('#passwordCapital').removeClass('passwordReqNotMet');
                            }else{
                                $('#passwordCapital').addClass('passwordReqNotMet');
                            }
                            var _numbers = /[0-9]+/.test(modelValue);
                            if(_numbers){
                                $('#passwordNumber').removeClass('passwordReqNotMet');
                            }else{
                                $('#passwordNumber').addClass('passwordReqNotMet');
                            }
                            var _symbols = _regex.test(modelValue);
                            if(_symbols){
                                $('#passwordSpecial').removeClass('passwordReqNotMet');
                            }else{
                                $('#passwordSpecial').addClass('passwordReqNotMet');
                            }

                            if((modelValue.length <= 7 || modelValue.length > 16)){                                
                                $('#passwordLength').addClass('passwordReqNotMet');
                                var _passLength =  false;
                            }
                            else{                                
                                $('#passwordLength').removeClass('passwordReqNotMet');
                                var _passLength =  true;
                            }

                            var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols, _passLength];                    
                            var _passedMatches = jQuery.grep(_flags, function (el) { return el === true; }).length;                                          

                            
                            
                            if(_passedMatches == 5){
                                _force = true;
                                $('#passowrdCheckError').hide();
                                $('#passowrdIconCheckError').hide();
                                $('#passowrdIconCheckNoError').show();
                            }else{
                                _force = false;
                                $('#passowrdCheckError').show();
                                $('#passowrdIconCheckError').show();
                                $('#passowrdIconCheckNoError').hide();
                            }
                            
                            return _force;
                        }else{

                        }
                    };
                }
            }
        };
    });    
}

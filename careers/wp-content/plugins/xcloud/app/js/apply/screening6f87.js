(function() {
	'use strict';

	var SCREENING_TEMPLATES = '/wp-content/plugins/xcloud/app/templates/';
    var SCHEMA_SCREENING_TEMPLATES = '/wp-content/plugins/xcloud/app/apply/schema/';

	angular
	.module('st.controllers.apply.site')
	.controller('screeningController', screeningController)
	.controller('radioFocusController', radioFocusController)
	.directive('screeningQuestions', screeningQuestions)
	.directive('screeningQuestion', screeningQuestion)
    .directive('schemaScreeningQuestions', schemaScreeningQuestions);


	screeningController.$inject = ['$scope', '$log'];



	function screeningController($scope, $log) {

		var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_SCREEN_QUESTION);
		
		initialize();

		$scope.getScreeningTemplateUrl = function() { 
			switch($scope.question.type) {
			case 'VRadio':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-radio-vertical.html';
			case 'HRadio':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-radio.html';                
			case 'VCheck':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-checkbox-vertical.html';
			case 'HCheck':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-checkbox.html';                
			case 'DropDown':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-dropdown.html';
			case 'TextBox':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-textbox.html';
			case 'TArea':
				return CUSTOM_FIELDS_TEMPLATES + 'screening-textarea.html';                                   
			default:
				return CUSTOM_FIELDS_TEMPLATES + 'blank.html';
			}
		};


		$scope.screeningCheckboxChanged = function(){			
			var checkedarray = $scope.question.answer;
			var noneCheckBoxKey = null;

			if(checkedarray == null){
				var returnVal = false;
			}else{
				angular.forEach($scope.question.options, function(options, optionsKey){
					if(options.answer.toLowerCase().indexOf('none') >= 0){
						if(checkedarray.hasOwnProperty(optionsKey)){
							if(checkedarray[optionsKey] == true){
								noneCheckBoxKey = optionsKey;
							}
						}
					}
				});
				
				angular.forEach(checkedarray, function(options, optionsKey){
					if(options == true){
						returnVal = true;
					}
					if(noneCheckBoxKey != null){
						if(noneCheckBoxKey != optionsKey){
							$scope.question.answer[optionsKey] = false;
						}
					}else{

					}
				});
			}
			
			return !returnVal;
		}

		function initialize() {
			logger.debug('screeningController initialize');
		}  
	}
    radioFocusController.$inject=['$scope','$log']

    function radioFocusController($scope,$log){
        $scope.showBorder=false;
        $scope.focusOnElement=function(){
            $scope.showBorder = true;
        }
        $scope.removeFocusFromElement = function(){
            $scope.showBorder=false;
        }
    }



    function screeningQuestions() {
		return {
			restrict: 'E',
			scope: {
				results: "=", 
				requisitionId: "="
			},
			replace: true,
			transclude: true,
			controller: 'screeningMainController',
			templateUrl: SCREENING_TEMPLATES + 'screening.html'
		};  
	}



	function screeningQuestion() {
		return {
			restrict: 'E',
			scope: {
				question: "="
			},
			replace: true,
			transclude: false,
			controller: 'screeningController',
			template: '<ng-include src="getScreeningTemplateUrl()"/>'
		};   
	}

    function schemaScreeningQuestions() {
        return {
            restrict   : 'E',
            scope      : {
                results      : "=?",
                requisitionId: "=?"
            },
            replace    : true,
            transclude : true,
            controller : 'schemaScreeningController',
            templateUrl: SCREENING_TEMPLATES + 'screening.html'
        };
    }

})();

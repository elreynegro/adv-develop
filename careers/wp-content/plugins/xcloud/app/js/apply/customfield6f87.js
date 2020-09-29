'use strict';

var CUSTOM_FIELDS_TEMPLATES = '/wp-content/plugins/xcloud/app/templates/';

// Define our directive
angular.module('com.hrlogix.ats.customfields', [ 'com.hrlogix.ats.global.services',
                                                 'com.hrlogix.ats.public.services' ])

    .controller('customFieldMainController', ['$scope', 'metadata', function ($scope, metadata) {
              
    initialize();

    function initialize() {
        
        $scope.customFields = [];

        if ($scope.type !== undefined && $scope.type !== null && $scope.type !== "") {
            
            metadata.getTableMetadata({table: $scope.type}).$promise.then(function(results) {
                
                $scope.customFields = normalizeObjects(results);

                for (var key in $scope.customFields) {
                    $scope.customFields[key].visualPrefs = angular.fromJson($scope.customFields[key].visualPrefs);
                }

                for (var key in $scope.ngModel) {
                    for (var innerKey in $scope.customFields) {
                        if (key === $scope.customFields[innerKey].columnName) {
                            $scope.customFields[innerKey].result = $scope.ngModel[key];
                        }
                    }
                }

                $scope.results = $scope.customFields;

            }, function(reason) {
                hasError(reason.statusText);
            });
        }

    }   

}]).controller('customFieldController', ['$scope', 'lists', function ($scope, lists) {
        
    initialize();
    
    $scope.getTemplateUrl = function() { 

        switch($scope.field.visualPrefs.type) {
            case 'radio':
                return CUSTOM_FIELDS_TEMPLATES + 'radio.html';
            case 'textarea':
                return CUSTOM_FIELDS_TEMPLATES + 'textarea.html';
            case 'text':
            case 'textbox':
                return CUSTOM_FIELDS_TEMPLATES + 'text.html';
            default:
                return CUSTOM_FIELDS_TEMPLATES + 'blank.html';
        }
    };

    function initialize() {
        if ($scope.field.visualPrefs.list !== undefined 
            && $scope.field.visualPrefs.list !== null 
            && $scope.field.visualPrefs.list !== '') {
            
            lists.getActiveListByName({ name: $scope.field.visualPrefs.list }).$promise.then(function(results) {
                $scope.field.list = normalizeObjects(results);
            }, function(reason) {           
                hasError(reason.statusText); 
            });
        }  

    }   

}]).directive('customFields', function () {
    return {
        restrict: 'E',
        scope: {
            type: "=",
            ngModel: "=",
            results: "="
        },
        replace: true,
        transclude: true,
        controller: 'customFieldMainController',
        templateUrl: CUSTOM_FIELDS_TEMPLATES + 'custom-fields.html'
    };
}).directive('customField', function() {  
    return {
        restrict: 'E',
        scope: { 
           field: '='
        },
        replace: true,
        transclude: false,
        controller: 'customFieldController',
        template: '<ng-include src="getTemplateUrl()"/>'
    };
});

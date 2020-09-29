/**
 * Created by TDadam on 11/9/2017.
 */

angular.module("com.hrlogix.ats.applyflow").controller('schemaUtilityController', ['$scope', '$rootScope', '$q', '$log', 'ModelDependencyFactory', function($scope,$rootScope,$q,$log,ModelDependencyFactory) {
    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_UTILS_GLOBAL_STATE);
    $scope.angularSchemaObserver = ModelDependencyFactory.angularSchemaObserver;
    $scope.candidateHelper = ModelDependencyFactory.candidateHelper;
}]);

(function() {
	'use strict';

	angular
	.module('st.controllers.apply.site')
	.controller('mainController', mainController);

	mainController.$inject = ['$scope', '$log', '$location', '$window', '$controller','$rootScope','authService','ModelDependencyFactory'];

     function mainController($scope, $log, $location, $window, $controller, $rootScope,authService,ModelDependencyFactory) {
         angular.extend(this, $controller('signInMenuController',  {$scope: $scope}));
    	 var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_MAIN);
    	 
	    initialize();

	    $scope.$on('authenticated', function() {
	    	logger.debug('authenticated');
	        $scope.isLoggedIn = authService.isLoggedIn;
	    });
	    
	    $scope.$on('authenticatedReload', function() {
	    	logger.debug('authenticatedReload');
	        $scope.isLoggedIn = authService.isLoggedIn;
	    });
	    
	    $scope.$on('loggedOut', function() {
	    	logger.debug('loggedOut');
	        $scope.currentUser = null;
	        $scope.isLoggedIn = false;
	        //$location.url('/login');
	    });

	    $scope.logout = $scope.logOut = function() {
	        authService.loginCancelled();
	        return true;
	    }; 
	    
	    $scope.clearLocalStorage = function() {
	        $location.search('clear', 'true');
	        return true;
	    };

	    $scope.clearSuccess = function() { 
	        clearSuccess();
	    };
            
	    function initialize() {
	    	logger.debug("Main Controller Called.");
	    	logger.debug('logged in : [' + authService.isLoggedIn + ']');
            ModelDependencyFactory.candidateHelper.configuration.loadLanguages();
            $rootScope.TEMPLATE_CONSTANTS = TEMPLATE_CONSTANTS;
	    }

	}

})();

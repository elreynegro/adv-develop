angular.module("com.hrlogix.ats.applyflow").controller('confirmationController',
    ['$scope', '$controller', '$log', '$location', '$window', 'SessionStorage', 'privateCandidate', 'ListService', 'LocalStorage', 'authService', '$rootScope', 'ApplicationState',
        function ($scope, $controller, $log, $location, $window, SessionStorage, privateCandidate, ListService, LocalStorage, authService, $rootScope, ApplicationState) {

    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_CONFIRMATION);

    angular.extend(this, $controller('baseController',  {$scope: $scope}));

    initialize();

    function initialize() {
        $scope.applyCandidate = ApplicationState.session.candidate.get();
        $scope.continueBtn = _XC_CONFIG.context.continue;
        $scope.confirmationMsg = _XC_CONFIG.context.confirmation;
        $scope.formlistUpdateFlag = true;
        $scope.isSessionLogged = false;
        $scope.firstLoad = true;
        $scope.confirmationCompleteIcon = false;
        $scope.fullname = null;
        ListService.applyFormList('initiFormList');

        $scope.esigTools = {};
        $scope.esigTools.checkSignature = function(){
            if(!$scope.applyCandidate){
                $scope.applyCandidate = ApplicationState.session.candidate.get();
            }

            $scope.fullname = jQuery.trim($scope.applyCandidate.firstName) + ' ' + jQuery.trim($scope.applyCandidate.lastName);

            if(typeof $scope.esig === 'undefined' || $scope.esig.toLowerCase() === $scope.fullname.toLowerCase()){
                $scope.confirmationForm.esig.$setValidity('matchesName', true);
            }
            else{
                $scope.confirmationForm.esig.$setValidity('matchesName', false);
            }
        };

        $("#confirmation").slideUp();

        if(authService.isLoggedIn){
            $scope.isSessionLogged = true;
            if($scope.addedCerts !== undefined && $scope.addedCerts !== null && $scope.addedCerts.length > 0){
                $scope.certsComplete = true;
                $scope.certsSkip = true;
                $scope.certCompleteIcon = true;
            }
        }
        
        // TODO: Example of redundant code
        $scope.editConfirmation = function($event){
            $event.preventDefault();
            angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                if(optionsKey === 'confirmation'){
                    $('#'+optionsKey).slideDown(function() {
                        $scope.applyCandidate = ApplicationState.session.candidate.get();
                    });
                }else{
                    $('#'+optionsKey).slideUp();
                }
            });
        };

        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            $scope.continueBtn = _XC_CONFIG.context.submit;
            jQuery('.loading-container').css('display', 'none');
        }
    }

    $scope.submitApplication = function(){

        $scope.applyCandidate = ApplicationState.session.candidate.get();
        $scope.applyCandidate.signature = $scope.fullname;

        if($scope.fullname !== null){
            // Add "signature"
            $scope.candidateServiceHandler('updateCandidate');
        }

        jQuery('.loading-container').css('display', 'block');
        if ($scope.isLastContainer === true && $scope.isLastForm === true) {
            $scope.candidateServiceHandler('lastContainerHandler');
        }

        if($scope.formlistUpdateFlag){
            ListService.applyFormList('setNext');
            $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag;
        }
        
        $scope.confirmationCompleteIcon = true;

        angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
            if(options){
                $('#'+optionsKey).slideDown();
                if(optionsKey == 'bgInfo'){
                    $rootScope.UpdateBackGroundFormFields();
                }else if(optionsKey == 'expDriver'){
                    $rootScope.UpdateExperienceDriverFormFields();
                }else if(optionsKey == 'eeoInfo'){
                    $rootScope.UpdateEeoFormFields();
                }
            }else{
                $('#'+optionsKey).slideUp();
            }
        });

        if($scope.reqIdLink){
            $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
        }

        if ($scope.isLastForm !== true) {
            jQuery('.loading-container').css('display', 'none');
        }
    }

}]);

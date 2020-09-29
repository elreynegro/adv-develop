(function() {
	'use strict';

	var SCREENING_TEMPLATES = '/wp-content/plugins/xcloud/app/templates/';

	angular
	.module('st.controllers.apply.site')
	.controller('screeningMainController', screeningMainController);

	screeningMainController.$inject = ['$scope', '$controller', '$log', '$location', '$window', 'questions', 'ListService', 'SessionStorage', 'LocalStorage', 'candidate', '$q', '$rootScope', 'authService','ApplicationState'];

	function screeningMainController($scope, $controller, $log, $location, $window, questions, ListService, SessionStorage, LocalStorage, candidate, $q, $rootScope, authService,ApplicationState) {
		var $ = jQuery;
		var logger = $log.getInstance(MODULE_NAME_CONTROLLERS_APPLY_SITE_SCREENING_QUESTIONS);

        angular.extend(this, $controller('baseController',  {$scope: $scope}));

		initialize();

		$scope.submitScreeningAnswers = function() {
            $scope.applyCandidate = ApplicationState.session.candidate.get();
            $scope.appId = SessionStorage.get('appId');
            $scope.answers = [];
            var getCurDate = new Date();
            var created = getCurDate.getTime();

            for (var key in $scope.results) {
                // in case option does not exists for question.
                var optionId = 0;

                // if checkbox, create individual submit object for each
                if (($scope.results[key].answer != null && $scope.results[key].answer != undefined && angular.isString($scope.results[key].answer) === false)) {
                    var thisObject = Object.keys($scope.results[key].answer);

                    for (var index in thisObject) {
                        $scope.answers.push({
                            'candidateId'    : $scope.applyCandidate.candidateId,
                            'applicationId'  : $scope.appId,
                            'answer'         : $scope.results[key].options[parseInt(thisObject[index])].answer,
                            'generalOptionId': $scope.results[key].options[parseInt(thisObject[index])].generalOptionId,
                            'created'        : created
                        });
                    }

                    continue;
                }

                // getting general option id
                for (var index2 in $scope.results[key].options) {
                    if ($scope.results[key].answer === $scope.results[key].options[index2].answer ||
                        $scope.results[key].options[index2].answer === 'text') {

                        optionId = $scope.results[key].options[index2].generalOptionId;

                    }
                }

                // create object to be submitted
                $scope.answers.push({
                    'candidateId'    : $scope.applyCandidate.candidateId,
                    'applicationId'  : $scope.appId,
                    'answer'         : $scope.results[key].answer,
                    'generalOptionId': optionId,
                    'created'        : created
                });
            }

            // submit answers
            $rootScope.screening_answers_submit = true;
            $rootScope.screening_answers = $scope.answers;
            $scope.screenCompleteIcon = true;

            /*for (var key2 in $scope.answers) {
                questions.addAnswer($scope.answers[key2]).$promise.then(function (results) {
                    var addedAnswer = normalizeObjects(results);
                }, function (reason) {
                    logger.error(reason);
                });
            }*/

            jQuery('.loading-container').css('display', 'block');

            /*if($scope.applyCandidate.locked === null) {
                $scope.applyCandidate.locked = 't';
                $scope.applyCandidate.password = 'password';
            }
            $scope.candidateServiceHandler('updateCandidate')
                .then(function () {*/
                    logger.debug('updateCandidate complete');

                    if ($scope.isLastContainer === true && $scope.isLastForm === true) {
                        jQuery('.loading-container').css('display', 'block');
                        $scope.candidateServiceHandler('lastContainerHandler');
                    }
                    if($scope.formlistUpdateFlag){
                        ListService.applyFormList('setNext');
                        $scope.formlistUpdateFlag = !$scope.formlistUpdateFlag
                    }
                    $scope.screenCompleteIcon = true;
                    angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                        if(options){
                            $('#'+optionsKey).slideDown(function() {
                                if (optionsKey == 'empHistory' && options === true) {
                                    $rootScope.populateWorkHistory();
                                } else if (optionsKey == 'eduHistory' && options === true) {
                                    $rootScope.populateEducation();
                                }

                                if(optionsKey == 'bgInfo'){
                                    $rootScope.UpdateBackGroundFormFields();
                                }else if(optionsKey == 'expDriver'){
                                    $rootScope.UpdateExperienceDriverFormFields();
                                }else if(optionsKey == 'eeoInfo'){
                                    $rootScope.UpdateEeoFormFields();
                                }
                            });
                        }else{
                            $('#'+optionsKey).slideUp();
                        }
                    })
            if($scope.reqIdLink){
                $scope.setApplicationStatus('update',$scope.applyFormId,$scope.applyStreamId,$scope.applyContainerId);
            }
                    if ($scope.isLastForm !== true) {
                        jQuery('.loading-container').css('display', 'none');
                        // deferred.resolve(0);
                    }
                /*})
                .catch(function (reason) {
                    logger.error(reason);
                    jQuery('.loading-container').css('display', 'none');
                });*/
        };

		function initialize() {
			$scope.screening = [];
			$scope.applyReq = SessionStorage.get('applyReq');
			ListService.applyFormList('initiFormList');
			$scope.screeningQuestions = [];
			$scope.results = $scope.screeningQuestions;
            $scope.isSessionLogged = false;
            $scope.formlistUpdateFlag = true;
            $scope.continueBtn = _XC_CONFIG.context.continue;
            $rootScope.screening_answers_submit = false;
            $rootScope.screening_answers = {};
            $scope.screenCompleteIcon = false;
            $scope.formlistUpdateFlag = true;

			if ($scope.applyReq !== null && $scope.applyReq !== undefined) {
                ApplicationState.showScreeningMessageComponent = true;
				getReqQuestions($scope.applyReq.requisitionId);
			}

            if(authService.isLoggedIn){
                $scope.isSessionLogged = true;
            }

			$("#screening").slideUp();
            
            // TODO: Example of redundant code
            $scope.editScreening = function($event){
                $event.preventDefault();
                angular.forEach(ListService.applyFormList('get'), function(options, optionsKey){
                    if(optionsKey == 'screening'){
                        $('#'+optionsKey).slideDown();
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

		function getReqQuestions(reqId) { 
			var reqQuestions = [];


			if (reqId !== null && reqId !== undefined) {
				questions.getReqQuestions({ 'requisitionId': reqId }).$promise.then(function(results) {
					reqQuestions = normalizeObjects(results);               

					for (var key in reqQuestions) {
						getGeneralQuestions(reqQuestions[key].questionGroupId, $scope.screeningQuestions);
					}

				}, function(reason) { 
					logger.error(reason);
				});   
			}
		}    

		function getGeneralQuestions(questionGroupId, screeningQuestions) { 
			questions.getGeneralQuestions({ 'questionGroupId': questionGroupId }).$promise.then(function(results) {
				var questionGroup = normalizeObjects(results);

				for (var index in questionGroup) {
                    if (questionGroup[index].active === 't') {
                        questionGroup[index].options = [];
                        questionGroup[index].answer = null;
                        getGeneralOptions(questionGroup[index].generalQuestionsId, questionGroup[index]);
                        screeningQuestions.push(questionGroup[index]);
                    }
				}

			}, function(reason) { 
				logger.error(reason);
			});
		}

		function getGeneralOptions(generalQuestionsId, questionGroup) { 
			questions.getGeneralOptions({ 'generalQuestionsId': generalQuestionsId }).$promise.then(function(results) {
				questionGroup.options = normalizeObjects(results);
			}, function(reason) { 
				logger.error(reason);
			});
		}
	}
})();




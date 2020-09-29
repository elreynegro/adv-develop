/**
 * Created by TDadam on 4/27/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('passwordUpdateService', passwordUpdateService);

    passwordUpdateService.$inject = ['$q', '$log', 'privateCandidate','privateCandidatePwd','privateCandidateToken','authService'];

    function passwordUpdateService($q, $log,privateCandidate,privateCandidatePwd,privateCandidateToken,authService)  {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            viewModel              : {
                skeleton: {
                    get: getSkeletonVM
                }
            },
            onPasswordUpdateSuccess: onPasswordUpdateSuccess,
            redirectToLoginWindow  : redirectToLoginWindow,
            validateToken          : validateToken,
            updatePassword         : updatePassword
        };
        return service;

        function getSkeletonVM(workFlow) {
            var _title;
            switch (workFlow){
                case E_WORK_FLOW.CREATE_PASSWORD:
                    _title =  TEMPLATE_CONSTANTS.TITLE.FORMS.CREATE_PASSWORD.str;
                    break;
                case E_WORK_FLOW.MODIFY_PASSWORD:
                    _title =  TEMPLATE_CONSTANTS.TITLE.FORMS.RESET_PASSWORD.str;
                    break;
            }

            return {
                isShowComponent: true,
                credentials  : {},
                configuration: {
                    header: _title
                },
                workFlow     : workFlow
            }
        }

        function validateToken(token) {
            var _result = {
                candidate    : null,
                validateToken: false
            };
            var deferred = $q.defer();
            privateCandidateToken.getCurrentCandidateByToken(token).query().$promise.then(function (result) {
                _result = {candidate: normalizeObjects(result), validToken: true};
                deferred.resolve(_result);
            }, function (reason) {
                logger.error(reason);
                _result.validateToken = false;
                deferred.resolve(_result); // caller will relay on validate token rather error (reject)
            });
            return deferred.promise;
        }
        
        function updatePassword(workFlow,password,token,candidateModel) {
            var deferred = $q.defer();
            switch (workFlow){
                case E_WORK_FLOW.CREATE_PASSWORD:
                    return updatePasswordWithTemporaryToken(token,password);
                    break;
                case E_WORK_FLOW.MODIFY_PASSWORD:
                    return updatePasswordWithUserAuthorization(candidateModel,password);
                    break;
            }
        }

        function updatePasswordWithTemporaryToken(token,password) {
            var deferred = $q.defer();
            privateCandidatePwd.resetPassword(token).query({'value': password}).$promise.then(function (result) {
                deferred.resolve(0);
            }, function (reason) {
                logger.error(reason);
                deferred.reject(0);
            });
            return deferred.promise;
        }

        function updatePasswordWithUserAuthorization(candidateModel,password) {
            var deferred = $q.defer();
            candidateModel.password = password;
            var getCurDate = new Date();
            candidateModel.updateDate = getCurDate.getTime();
            privateCandidate.updateCandidate(candidateModel).$promise.then(function (result) {
                deferred.resolve(normalizeObjects(result));
            }, function (reason) {
                logger.error(reason);
                deferred.reject(0);
            });
            return deferred.promise;
        }

        function onPasswordUpdateSuccess() {
            authService.resetCurrentSession({skipRedirection: true});
        }

        function redirectToLoginWindow(loginConfiguration) {
            authService.openSignInModal(loginConfiguration);
        }
    }
}());

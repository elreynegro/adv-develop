/**
 * Created by TDadam on 5/21/2018.
 */
(function () {
    'use strict';
    angular
        .module('st.services')
        .factory('migrationService', migrationService);

    migrationService.$inject = ['$q', '$log', 'CandidateWorkFlow', 'schemaModalService','ApplicationState','authService'];

    function migrationService($q, $log, CandidateWorkFlow, schemaModalService,ApplicationState,authService) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);

        var service = {
            GDPR: {
                migrationWindow    : {
                    open: openGDPRMigrationWindow
                },
                updateTermsAndMarketing: updateTermsAndMarketing
            }
        };
        return service;

        function openGDPRMigrationWindow() {
            //feature enabled?
            if(_XC_CONFIG.migration.GDPR.termsAndConditionsEnabled !== true){
                return;
            }

            // not logged in or first time users
            if(authService.isLoggedIn !== true || ApplicationState.localStorage.candidate.isReturningUser.get() !== true){
                return;
            }

            var _candidateId = ApplicationState.localStorage.candidate.id.get();
            CandidateWorkFlow.profile.termsAndConditions.hasOptIn(_candidateId)
                .then(function (result) {
                    if(result !== true) {
                        var _modalPopup = {
                            configuration: {
                                candidate: _candidateId,
                                style    : {
                                    windowClass: "schema-modal-popup"
                                }
                            }
                        };
                        var _template = '/wp-content/plugins/xcloud/app/components/candidate_migration/gdpr-migration-modal.html';
                        var _controller = 'GDPRMigrationController';
                        schemaModalService.open(_modalPopup.configuration, _template, _controller);
                    }
                }, function (reason) {
                    // nothing to do
                });
        }

        function updateTermsAndMarketing(viewModel) {
            var deferred = $q.defer();
            var _candidate = ApplicationState.session.candidate.get();
            if(!_candidate || angular.equals({},_candidate)){
                deferred.reject('invalid argument');
            }else {
                CandidateWorkFlow.profile.termsAndConditions.optIN()
                    .then(function (result) {
                        if (viewModel.subscribe !== true) {
                            CandidateWorkFlow.preferences.communications.subscriptions.marketing.unSubscribe(_candidate.email)
                                .then(function (result) {
                                    deferred.resolve(true);
                                })
                                .catch(function (reason) {
                                    deferred.reject(reason);
                                })
                        }else{
                            deferred.resolve(true);
                        }
                    },function (reason) {
                        deferred.reject(reason);
                    })
            }
            return deferred.promise;
        }

    }
}());

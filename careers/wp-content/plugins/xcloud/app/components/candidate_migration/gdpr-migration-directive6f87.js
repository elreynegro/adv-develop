/**
 * Created by TDadam on 5/21/2018.
 */
angular
    .module('st.candidate.activity')
    .directive('termsAndConditionsCompliance', function() {
        return {
            restrict   : 'EA',
            scope      : false,
            resolve    : {
                metaDataProvider: function () {
                    return {};
                }
            },
            controller : 'GDPRMigrationController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/candidate_migration/gdpr-migration-modal.html'
        };
    });

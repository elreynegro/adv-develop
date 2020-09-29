/**
 * Created by TDadam on 12/16/2017.
 */
angular
    .module('st.candidate.activity')
    .directive('schemaDashboardCandidateProfile', function () {
        return {
            restrict   : 'EA',
            scope      : {
                applyFlowData           : '=',
                externalJob             : '=',
                defaultValueFieldObject : '=',
                fieldParserDefinition   : '=',
                fieldDefinition         : '=',
                fieldLookUpCollection   : '=',
                fieldNameCollection     : '=',
                form                    : '=',
                glyphIcon               : '=',
                gridConfiguration       : '=',
                gridEnabled             : '=',
                hide                    : '=',
                indexOfForm             : '=',
                isFirstForm             : '=',
                isLastForm              : '=',
                mandatoryFieldCollection: '=',
                model                   : '=',
                replicate               : '=?',
                schema                  : '=',
                table                   : '=',
                tableMap                : '=',
                title                   : '=',
                viewStyle               : '='
            },
            replace    : true,
            transclude : false,
            controller : 'candidateProfileController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/dashboard_candidate_profile/candidate-profile.html'
        };
    });

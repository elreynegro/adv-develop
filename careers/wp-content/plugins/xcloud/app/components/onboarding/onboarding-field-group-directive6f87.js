/**
 * Created by TDadam on 4/8/2018.
 */
angular
    .module('st.candidate.activity')
    .directive('onBoardingFieldGroup', function() {
        return {
            restrict: 'EA',
            scope: {
                isPartialSave           : '=',
                defaultValueFieldObject : '=',
                fieldDefinition         : '=',
                fieldParserDefinition   : '=',
                fieldLookUpCollection   : '=',
                fieldNameCollection     : '=',
                headIndex               : '=', // Form Position in form Group
                parentId                : '=', // Form Id
                fieldGroupCount         : '=',
                fieldGroupId            : '=',
                form                    : '=',
                gridConfiguration       : '=',
                gridEnabled             : '=',
                hide                    : '=',
                isOfflineStorage        : '=',
                index                   : '=',
                isFirstForm             : '=',
                isLastForm              : '=',
                mandatoryFieldCollection: '=',
                model                   : '=',
                hasRetrieveMuted        : '=',
                replicate               : '=?',
                schema                  : '=',
                table                   : '=',
                tableMap                : '=',
                title                   : '=',
                viewStyle               : '='
            },
            replace: true,
            transclude: false,
            controller: 'onBoardingFieldGroupController',
            templateUrl: '/wp-content/plugins/xcloud/app/components/onboarding/onboarding-field-group.html'
        };
    });

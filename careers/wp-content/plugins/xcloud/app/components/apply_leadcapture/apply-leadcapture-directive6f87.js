/**
 * Created by TDadam on 12/16/2017.
 */
angular
    .module('st.candidate.activity')
    .directive('schemaApplyLeadCaptureForm', function() {
    return {
        restrict: 'EA',
        scope: {
            applyFlowData           : '=',
            externalJob             : '=',
            defaultValueFieldObject : '=',
            fieldDefinition         : '=',
            fieldParserDefinition   : '=',
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
        replace: true,
        transclude: false,
        controller: 'applyLeadCaptureController',
        templateUrl: '/wp-content/plugins/xcloud/app/components/apply_leadcapture/apply-leadcapture.html'
    };
});

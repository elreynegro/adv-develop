/**
 * Created by TDadam on 3/15/2018.
 */
angular
    .module('st.shared.widget')
    .directive('externalRequiredValidator', ['ModelDependencyFactory',function(ModelDependencyFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.isFileRquired = true;
                ModelDependencyFactory.angularSchemaObserver.registerExternalValidator(scope.isValid,attrs.externalRequiredValidator);
            }
        };
    }]);
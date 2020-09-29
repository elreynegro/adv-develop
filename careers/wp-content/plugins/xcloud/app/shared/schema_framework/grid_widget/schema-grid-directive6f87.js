/**
 * Created by TDadam on 12/15/2017.
 */

angular
    .module('st.shared.widget')
    .directive('schemaGrid', function () {
        return {
            restrict   : 'EA',
            scope      : {
                table          : '=',
                parentFormTitle: '='
            },
            replace    : true,
            transclude : false,
            controller : 'schemaGridController',
            templateUrl: '/wp-content/plugins/xcloud/app/shared/schema_framework/grid_widget/schema-grid.html'
        };
    });

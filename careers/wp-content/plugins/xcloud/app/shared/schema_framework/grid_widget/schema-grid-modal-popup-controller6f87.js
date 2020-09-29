/**
 * Created by Shanjock on 9/26/2018.
 */
angular
    .module('st.shared.widget')
    .controller('schemaGridModalPopupController', schemaGridModalPopupController);

schemaGridModalPopupController.$inject = ['$scope', '$log', '$timeout', 'ModelDependencyFactory', 'schemaModalService'];

function schemaGridModalPopupController($scope, $log, $timeout, ModelDependencyFactory, schemaModalService) {
    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_UTILS_GLOBAL_STATE);

    $scope.angularSchemaObserver = ModelDependencyFactory.angularSchemaObserver;

    $scope.deleteRow = function (row, event) {
        if (typeof event !== 'undefined') event.preventDefault();
        $scope.angularSchemaObserver.deleteRow($scope, row);
        closeModal();
    };

    initialize();

    function initialize() {
        $scope.MP_VM = {
            modalPopup                         : {
                close: closeModal
            },
            ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE: TEMPLATE_CONSTANTS.TITLE.BANNER.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE.str,
            HISTORY                            : TEMPLATE_CONSTANTS.TITLE.BANNER.HISTORY.str,
            ok                                 : TEMPLATE_CONSTANTS.TITLE.ACTIONS.OK.str,
            cancel                             : TEMPLATE_CONSTANTS.TITLE.ACTIONS.CANCEL.str
        };

        // Defaults
        $scope.MP_VM.subTitleCollection = {
            "educationId"    : TEMPLATE_CONSTANTS.TITLE.BANNER.SCHOOL_DETAILS.str,
            "workHistoryId" : TEMPLATE_CONSTANTS.TITLE.BANNER.JOB_DETAILS.str,
            "certificationId": TEMPLATE_CONSTANTS.TITLE.BANNER.CERTIFICATE_LICENSE_DETAILS.str
        };
    }

    function closeModal() {
        schemaModalService.close();
    }
}

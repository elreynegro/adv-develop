/**
 * Created by TDadam on 8/17/2017.
 */
angular
    .module('st.shared.widget')
    .controller('schemaGridController', schemaGridController);

schemaGridController.$inject = ['$scope', '$log', '$timeout', 'ModelDependencyFactory', 'schemaModalService'];

function schemaGridController($scope, $log, $timeout, ModelDependencyFactory, schemaModalService) {
    var $ = jQuery;
    var logger = $log.getInstance(MODULE_NAME_UTILS_GLOBAL_STATE);
    var properties = {
        isMinimumRowsDefined: false,
        isMaximumRowsDefined: false,
        minRowMessage       : '',
        maxRowMessage       : ''
    };

    $scope.parent = {};
    $scope.angularSchemaObserver = ModelDependencyFactory.angularSchemaObserver;

    // Defaults
    $scope.subTitleCollection = {
        "education"    : {"subTitle": TEMPLATE_CONSTANTS.TITLE.BANNER.SCHOOL_DETAILS.str},
        "work_history" : {"subTitle": TEMPLATE_CONSTANTS.TITLE.BANNER.JOB_DETAILS.str},
        "certification": {"subTitle": TEMPLATE_CONSTANTS.TITLE.BANNER.CERTIFICATE_LICENSE_DETAILS.str}
    };

    function constructMinRowMessage() {
        if ($scope.modelHandler.messageOnMinCount !== undefined) {
            properties.minRowMessage = $scope.modelHandler.messageOnMinCount;
        } else {
            properties.minRowMessage = 'Please provide at least ' + $scope.modelHandler.minRowCount;
            if (properties.isMaximumRowsDefined === true) {
                properties.minRowMessage += ' and no more than ' + $scope.modelHandler.maxRowCount + ' records.';
            }
        }
    }

    function constructMaxRowMessage() {
        if ($scope.modelHandler.messageOnMaxCount !== undefined) {
            properties.maxRowMessage = $scope.modelHandler.messageOnMaxCount;
        } else {
            properties.maxRowMessage = 'Maximum of ' + $scope.modelHandler.maxRowCount + ' records permitted.';
        }
    }

    function onDataSourceChange() {
        var _hasRowCapacity = $scope.hasRowCapacity();
        if (_hasRowCapacity === true && $scope.modelHandler.minRowCount === 0) {
            $scope.parent.rowAdded = $scope.modelHandler.rowCollection.length > 0;
        } else {
            $scope.parent.rowAdded = $scope.hasMinimumRowFilled();
        }
        if (_hasRowCapacity === false) {
            $scope.isShowInfo = false;
            $scope.isShowWarning = true;
            $scope.notificationMessage = properties.maxRowMessage;
        } else if ($scope.hasMinimumRowFilled() === false) {
            $scope.isShowWarning = false;
            $scope.isShowInfo = true;
            $scope.notificationMessage = properties.minRowMessage;
        } else {
            $scope.isShowWarning = false;
            $scope.isShowInfo = false;
        }
    }

    function constructReadOnlyData() {
        properties.actions = [
            "edit",
            "delete"
        ];
        properties.isMinimumRowsDefined = ($scope.modelHandler.minRowCount !== undefined && $scope.modelHandler.minRowCount > 0);
        properties.isMaximumRowsDefined = ($scope.modelHandler.maxRowCount !== undefined && $scope.modelHandler.maxRowCount > 0);
        if (properties.isMinimumRowsDefined) {
            constructMinRowMessage();
        }
        if (properties.isMaximumRowsDefined) {
            constructMaxRowMessage();
        }
        properties.dataGridColumnSize = $scope.angularSchemaObserver.formStyleHandler.grid.utility.getGridColumnSize($scope.modelHandler.columns.length, 12 - properties.actions.length);
    }

    $scope.getDataGridColumnSize = function () {
        return properties.dataGridColumnSize;
    };

    $scope.getSubTitle = function () {
        if ($scope.modelHandler.title === undefined) {
            return $scope.subTitleCollection[$scope.table].subTitle;
        } else {
            return $scope.modelHandler.title;
        }
    };

    $scope.addRow = function (rowData, table) {
        try {
            $scope.table = table;
            $scope.modelHandler.rowCollection.push(rowData);
            onDataSourceChange();
            $scope.$digest($scope.modelHandler.rowCollection);
        } catch (reason) {

        }
    };

    $scope.updateRow = function (rowData, table) {
        try {
            $scope.table = table;
            $scope.currentRowForEdit = rowData;
            for (var key in $scope.modelHandler.rowCollection) {
                if ($scope.modelHandler.rowCollection[key][$scope.modelHandler.keyField] === rowData[$scope.modelHandler.keyField]) {
                    $scope.modelHandler.rowCollection[key] = rowData;
                    break;
                }
            }
            $scope.parent.rowEditMode = false;
            $scope.$digest($scope.modelHandler.rowCollection);
        } catch (reason) {

        }
    };

    $scope.editRow = function (row) {
        $scope.parent.rowEditMode = true;
        $scope.currentRowForEdit = row;
        $scope.angularSchemaObserver.editRow($scope, row);
    };

    $scope.deleteConfirmation = function (row, event) {
        if (typeof event !== 'undefined') event.preventDefault();
        $scope.currentRowForDelete = row;

        var configuration = {
            style: {
                windowClass: "schema-modal-popup",
                size       : E_MODAL_POPUP_SIZE.NONE // none will let content decides dimensions
            },
            scope: $scope
        };

        var _template = '/wp-content/plugins/xcloud/app/shared/schema_framework/grid_widget/schema-grid-modal-popup.html';
        var _controller = 'schemaGridModalPopupController';
        schemaModalService.open(configuration, _template, _controller);

        //TODO: need to remove below commented code after 18.20 PROD release.
        /*var id = '#'.concat($scope.modelHandler.keyField);
        $(id).modal({ backdrop: 'static', keyboard: true, show: true });
        $timeout(function(){
            $('#'.concat($scope.modelHandler.keyField).concat('modelPopupOKAction')).focus();
        },250);
        $('.modal-backdrop').css('z-index', '-1 !important');*/
    };

    //TODO: need to remove below commented code after 18.20 PROD release.
    /*$scope.deleteRow = function (row, event) {
        if(typeof event !== 'undefined') event.preventDefault();
        $scope.angularSchemaObserver.deleteRow($scope,row);
    };*/

    $scope.removeRow = function (keyField) {
        delete $scope.currentRowForEdit;
        angular.forEach($scope.modelHandler.rowCollection, function (options, optionsKey) {
            if (options[$scope.modelHandler.keyField] === keyField) {
                $scope.modelHandler.rowCollection.splice(optionsKey, 1);
            }
        });
        onDataSourceChange();
        $scope.parent.rowEditMode = false;
    };

    $scope.setDataSource = function (rowData, table) {
        try {
            $scope.table = table;
            $scope.modelHandler.rowCollection = angular.copy(rowData);
            onDataSourceChange();
            $scope.$digest($scope.modelHandler.rowCollection);
        } catch (reason) {
            if (reason.message.indexOf('$digest already in progress') < 0) {
                logger.debug($scope.angularSchemaObserver.notificationEngine.Grid.dataSourceLoad);
                logger.error($scope.angularSchemaObserver.notificationEngine.Grid.dataSourceLoad);
            }
        }
    };

    $scope.cancelRowUpdate = function () {
        $scope.currentRowForEdit = {};
        $scope.parent.rowEditMode = false;
    };

    $scope.hasMinimumRowFilled = function () {
        return ($scope.modelHandler.minRowCount === 0 || $scope.modelHandler.minRowCount <= $scope.modelHandler.rowCollection.length);
    };

    $scope.hasRowCapacity = function () {
        return ($scope.modelHandler.maxRowCount === 0 || $scope.modelHandler.rowCollection.length < $scope.modelHandler.maxRowCount);
    };

    initialize();

    function initialize() {
        $scope.angularSchemaObserver.registerGrid($scope);
        $scope.modelHandler.rowCollection = [];
        if ($scope.modelHandler.labelField === undefined) {
            $scope.modelHandler.labelField = $scope.modelHandler.keyField;
        }
        constructReadOnlyData();
        $scope.isShowInfo = false;
        if (properties.isMinimumRowsDefined === true) {
            $scope.isShowInfo = ($scope.hasMinimumRowFilled() === false);
            $scope.notificationMessage = properties.minRowMessage;
        }
    }
}

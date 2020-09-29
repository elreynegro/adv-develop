/**
 * Created by TDadam on 4/5/2018.
 */
(function () {
    'use strict';

    angular
        .module('st.candidate.activity')
        .controller('onBoardingController', onBoardingController);

    onBoardingController.$inject = ['$scope', '$rootScope', '$log', '$location', 'onBoardingViewModelService'];

    function onBoardingController($scope, $rootScope, $log, $location, onBoardingViewModelService) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        $scope.vm = {
            getIconClassForStatus : getIconClassForStatus,
            getDueDate            : getDueDate,
            getTitleClassForStatus: getTitleClassForStatus,
            getStatusIcon         : getStatusIcon,
            getStatusTitle        : getStatusTitle,
            getHeading            : getHeading,
            getSubHeading         : getSubHeading,
            isFormEditable        : isFormEditable,
            isShowComponent       : true,
            onBoarding            : onBoardingViewModelService.getSkeleton(),
            preventDoubleClick    : preventDoubleClick,
            requisitionTitle      : '',
            TEMPLATE_CONSTANTS    : TEMPLATE_CONSTANTS,
            STATUS_ENUM           : {
                completed: "completed",
                pending  : "pending"
            },
            startForm             : startForm
        };

        initialize();

        function initialize() {
            onBoardingViewModelService.showProgressBar(true);
            onBoardingViewModelService.set([], onFormGroupReceiver)
        }

        function onFormGroupReceiver(viewModel) {
            $scope.vm = angular.extend($scope.vm, viewModel);
            setRequisitionTitle($scope.vm.onBoarding.requisitionMap);
            onBoardingViewModelService.showProgressBar(false);
            readQueryString();
        }

        function getHeading() {
            // in case of no configuration in wp-admin
            if (TEMPLATE_CONSTANTS.TITLE.FORMS.ON_BOARDING !== undefined) {
                return TEMPLATE_CONSTANTS.TITLE.FORMS.ON_BOARDING.str;
            } else {
                return TEMPLATE_CONSTANTS.TITLE.FORMS.ON_BOARDING;
            }
        }

        function getSubHeading() {
            // in case of no configuration in wp-admin
            if (TEMPLATE_CONSTANTS.TITLE.BANNER.ON_BOARDING_SUB_HEADER.str !== undefined) {
                return TEMPLATE_CONSTANTS.TITLE.BANNER.ON_BOARDING_SUB_HEADER.str;
            } else {
                return TEMPLATE_CONSTANTS.TITLE.BANNER.ON_BOARDING_SUB_HEADER;
            }
        }

        function getStatusTitle(form) {
            return form.status;
        }

        //if all the forms are in complete state then user wont be able to edit the form
        function isFormEditable(form) {
            //var returnValue = false;
            // var formGroups = $scope.vm.onBoarding.formGroups;
            // for(var i=0;i<formGroups.length;i++){
            //     if(formGroups[i].form.status.toLowerCase()!== $scope.vm.STATUS_ENUM.completed){
            //         return true;
            //     }
            // }
            // return false;
            var _form = _.filter($scope.vm.onBoarding.formGroups, function (_formElement) {
                return _formElement.form.status.toLowerCase() !== $scope.vm.STATUS_ENUM.completed;
            });
            if (_form.length === 0) {
                return undefined;
            } else {
                return (form.status.toLowerCase() === $scope.vm.STATUS_ENUM.completed);
            }
        }

        function getIconClassForStatus(form) {
            switch (form.status.toLowerCase()) {
                case $scope.vm.STATUS_ENUM.pending:
                    return "on-boarding-status-pending-icon";
                    break;
                case $scope.vm.STATUS_ENUM.completed:
                    return "on-boarding-status-completed-icon";
                    break;
            }
        }

        function getDueDate(form) {
            switch (form.status.toLowerCase()) {
                case $scope.vm.STATUS_ENUM.pending:
                    return TEMPLATE_CONSTANTS.TITLE.LABELS.DUE_TITLE.str + ": " + form.dueDate;
                    break;
                case $scope.vm.STATUS_ENUM.completed:
                    return form.dueDate;
                    break;
            }
        }

        function getTitleClassForStatus(form) {
            switch (form.status.toLowerCase()) {
                case $scope.vm.STATUS_ENUM.pending:
                    return "on-boarding-status-pending-title";
                    break;
                case $scope.vm.STATUS_ENUM.completed:
                    return "on-boarding-status-completed-title";
                    break;
            }
        }

        function getStatusIcon(form) {
            switch (form.status.toLowerCase()) {
                case $scope.vm.STATUS_ENUM.pending:
                    return "";
                    break;
                case $scope.vm.STATUS_ENUM.completed:
                    return "";
                    break;
            }
        }

        function setRequisitionTitle(requisition) {
            if (requisition === undefined || requisition.requisitionTitle === undefined || requisition.requisitionId === undefined) {
                $scope.vm.requisitionTitle = '';
                return;
            }
            $scope.vm.requisitionTitle = requisition.requisitionTitle + ' [' + requisition.requisitionId + ']';
        }

        function preventDoubleClick() {
            return false;
        }

        function startForm(form) {
            form.hasRetrieveMuted = (form.status.toLowerCase() === $scope.vm.STATUS_ENUM.pending);
            if (form.hasRetrieveMuted === false) {
                // prevent edit on form group completion
                if (isFormEditable(form) !== true) {
                    return;
                }
            }
            onBoardingViewModelService.openFormInModal(form, onFormModalResponse, onFormModalDismissResponse);
        }

        function onFormModalResponse(response) {
            // TODO:
            if (response && response.$value && response.$value.result) {
                var _result = response.$value.result;
                if (_result.hasSuccess !== false) {
                    angular.extend($scope.vm, onBoardingViewModelService.updateFormStatus($scope.vm.STATUS_ENUM.completed, _result.headIndex));
                }
            }
        }

        function onFormModalDismissResponse() {
            onBoardingViewModelService.showProgressBar(false);
        }

        function readQueryString() {
            // open form on basis of form id mentioned in query string
            var formId = $location.search().form;
            if (formId !== undefined && formId !== null) {
                var _formElement = _.filter($scope.vm.onBoarding.formGroups, function (_formElement) {
                    //using == operator since equal is being performed between different data types.
                    return (_formElement.form.status.toLowerCase() === $scope.vm.STATUS_ENUM.pending && _formElement.form.id == formId);
                });
                if (_formElement.length > 0) {
                    startForm(_formElement[0].form);
                }
            }
        }
    }

})(); // End  controller=======


(function() {
    angular
        .module('st.services')
        .factory('SignInModalService', SignInModalService);

    SignInModalService.$inject = ['$q', '$log', '$uibModal', '$controller'];

    function SignInModalService($q, $log, $uibModal, $controller) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var service = {
            open        : open,
            openPassword: openPassword
        };
        return service;

        function open(configuration, callback, dismissCallback) {
            var thisInstance = this;
            thisInstance.configuration = angular.merge(configuration, _XC_CONFIG.login_modal);
            thisInstance.callback = callback;
            thisInstance.dismissCallback = dismissCallback;
            var modalInstancepop = $uibModal.open({
                ariaLabelledBy : 'modal-main-title',
                templateUrl  : '/wp-content/plugins/xcloud/app/components/login/login.html',
                controller   : 'signInController',
                backdrop     : 'static',
                backdropClass: 'modal-popup-custom-backdrop',
                windowClass  : "schema-modal-popup",
                resolve      : {
                    loginConfigurations: function () {
                        thisInstance.configuration = thisInstance.configuration || {};
                        thisInstance.configuration.progressVisibility = progressVisibility;
                        return thisInstance.configuration;
                    }
                }
            });

            modalInstancepop.result.then(function (response) {
                thisInstance.response = response;
                thisInstance.callback(response);
            }, function (reason) {
                if (dismissCallback !== undefined) {
                    $log.info('Modal dismissed at: ' + new Date());
                    thisInstance.dismissCallback(reason);
                }
            });
        }

        function openPassword(configuration, callback,dismissCallback) {
            var thisInstance = this;
            thisInstance.configuration = {};
            thisInstance.callback = callback;
            thisInstance.dismissCallback = dismissCallback;
            var modalInstancepopPassword = $uibModal.open({
                ariaLabelledBy : 'modal-main-title',
                templateUrl  : '/wp-content/plugins/xcloud/app/components/login/forgot-password.html',
                controller   : 'ForgotPasswordController',
                backdrop     : 'static',
                backdropClass: 'modal-popup-custom-backdrop',
                windowClass  : "schema-modal-popup",
                resolve      : {
                    loginConfigurations: function () {
                        thisInstance.configuration = thisInstance.configuration || {};
                        thisInstance.configuration.progressVisibility = progressVisibility;
                        return thisInstance.configuration;
                    }
                }
            });

            modalInstancepopPassword.result.then(function (response) {
                thisInstance.response = response;
                thisInstance.callback(response);
            }, function (reason) {
                if (dismissCallback !== undefined) {
                    $log.info('Modal dismissed at: ' + new Date());
                    thisInstance.dismissCallback(reason);
                }
            });
        }

        function progressVisibility(isShow) {
            var _loaderElement = '.loading-container-instance';
            if (isShow) {
                jQuery(_loaderElement).css('display', 'block');
                // either of element
                _loaderElement = '#modal-Loader';
                jQuery(_loaderElement).css('display', 'block');
            } else {
                jQuery(_loaderElement).css('display', 'none');
                // either of element
                _loaderElement = '#modal-Loader';
                jQuery(_loaderElement).css('display', 'none');
            }
        }
    }
}());
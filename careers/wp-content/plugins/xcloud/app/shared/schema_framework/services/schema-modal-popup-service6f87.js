/**
 * Created by TDadam on 4/8/2018.
 */

(function () {
    angular
        .module('st.services')
        .factory('schemaModalService', schemaModalService);

    schemaModalService.$inject = ['$q', '$log', '$uibModal', '$controller'];

    function schemaModalService($q, $log, $uibModal, $controller) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var modalPopupInstance;

        var service = {
            E_REASON               : {
                CANCEL: "cancel",
                ESCAPE: "escape key press"
            },
            open                   : open,
            close                  : closeModal,
            progressVisibility     : progressVisibility,
            registerDismissCallBack: registerDismissCallBack
        };
        return service;


        function open(modalConfiguration, templateUrl, controllerName, callback, dismissCallback) {
            modalConfiguration.style = modalConfiguration.style || {};
            var thisInstance = this;

            thisInstance.modalConfiguration = modalConfiguration;
            thisInstance.callback = callback;
            thisInstance.dismissCallback = dismissCallback;
            var modalConfig = {
                ariaLabelledBy : modalConfiguration.ariaLabelledBy,
                ariaDescribedBy: modalConfiguration.ariaDescribedBy,
                templateUrl    : templateUrl,
                controller     : controllerName,
                backdrop       : 'static',
                backdropClass  : 'modal-popup-custom-backdrop',
                windowClass    : modalConfiguration.style.windowClass,
                size           : modalConfiguration.style.size,
                resolve        : {
                    metaDataProvider: function () {
                        var _provider = thisInstance.modalConfiguration;
                        if (!angular.isArray(_provider)) {
                            _provider.progressVisibility = progressVisibility;
                            _provider.closeModal = closeModal;
                        }
                        return thisInstance.modalConfiguration;
                    }
                }
            };

            if(typeof modalConfiguration.scope !== 'undefined'){
                modalConfig.scope = modalConfiguration.scope;
            }

            modalPopupInstance = $uibModal.open(modalConfig);

            modalPopupInstance.result.then(function (response) {
                thisInstance.response = response;
                if (thisInstance.callback !== undefined) {
                    thisInstance.callback(response);
                }
            }, function (reason, event) {
                if (thisInstance.dismissCallback !== undefined) {
                    $log.info('Modal dismissed at: ' + new Date());
                    thisInstance.dismissCallback(reason);
                }
            });
        }

        function registerDismissCallBack(event) {
            if (event !== undefined) {
                service.dismissCallback = event;
            }
        }

        function closeModal() {
            if (modalPopupInstance) {
                modalPopupInstance.close();
            }
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

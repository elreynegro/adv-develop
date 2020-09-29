/**
 * Created by TDadam on 5/14/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('NotificationEngine', NotificationEngine);

    NotificationEngine.$inject = ['$q', '$log', 'schemaModalService'];

    function NotificationEngine($q, $log, schemaModalService) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var service = {
            modal: {
                bootstrap: {
                    show: showBootstrapNotificationInModal
                }
            }
        };
        return service;

        function showBootstrapNotificationInModal(bootStrapAlertClass, template) {
            var configuration = {
                vm   : {
                    alertClass: bootStrapAlertClass,
                    message   : template
                },
                style: {
                    windowClass: "schema-modal-popup",
                    size       : E_MODAL_POPUP_SIZE.NONE // none will let content decides dimensions
                }
            };
            var _template = '/wp-content/plugins/xcloud/app/shared/components/notification-modal/notification-modal.html';
            var _controller = 'notificationModalController';
            schemaModalService.open(configuration, _template, _controller)
        }
    }
}());

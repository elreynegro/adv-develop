/**
 * Created by TDadam on 3/24/2018.
 */
(function() {
    'use strict';
    angular
        .module('st.services')
        .factory('HTMLHelper', HTMLHelper);

    HTMLHelper.$inject = ['$q', '$log'];

    function HTMLHelper($q, $log) {
        var logger = $log.getInstance(MODULE_NAME_SERVICES);
        var service = {
            UL_FOR    : ul_FOR,
            SCRIPT_FOR: ui_Script_for
        };
        return service;

        function ul_FOR(headerText,items) {
            var messageHtml;
            messageHtml = '<h5>' + headerText + '</h5><br><ul class="messageList">';
            for (var i = 0; i < items.length; i++) {
                messageHtml += '<li class="messageListItem"> ' + items[i] + '</li>';
            }
            messageHtml += '</ul>';
            return messageHtml;
        }

        function ui_Script_for(sourceElement,scripts) {
            var element = angular.element(sourceElement);
            if(element !== undefined && element.length && element.length > 0) {
                angular.forEach(scripts, function (script) {
                    var scriptTag = document.createElement("script");
                    scriptTag.type = script.type;
                    scriptTag.src = script.src;
                    element.append(scriptTag);
                });
            }
        }
    }

}());
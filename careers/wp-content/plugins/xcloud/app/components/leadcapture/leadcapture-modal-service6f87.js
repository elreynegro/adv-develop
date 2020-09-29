/*This Service will keep track whether the LCP was called from Modal*/
(function () {
    angular
        .module('st.services')
        .factory('leadcaptureModalService', leadcaptureModalService);

    function leadcaptureModalService() {
        var returnObj = {};
        var isCalledFromModal = false;
        var modalThankYouMessage = "";
        var isModalOpen = false;

        returnObj.setIsModalOpen = function(bool){
          isModalOpen = bool;
        };
        returnObj.getIsModalOpen = function(){
            return isModalOpen;
        };

        returnObj.setCallFromModal = function () {
            isCalledFromModal = true;
            console.log(isCalledFromModal);
        };
        returnObj.getCalledFromModal = function () {
            return isCalledFromModal;
        };
        returnObj.resetCalledFromModal = function () {
            isCalledFromModal = false;
            console.log(isCalledFromModal)
        };

        returnObj.setModalThankYouMessage = function(msg){
            modalThankYouMessage = msg;
        };
        returnObj.getModalThankYouMessage = function(){
            return modalThankYouMessage;
        };

        return returnObj;

    }
})();

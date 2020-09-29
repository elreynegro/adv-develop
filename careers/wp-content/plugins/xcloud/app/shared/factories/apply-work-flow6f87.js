/**
 * Created by TDadam on 3/1/2018.
 */
(function() {
    'use strict';
    angular
        .module('com.hrlogix.ats.global.services')
        .factory('ApplyWorkFlow', ApplyWorkFlow);

    ApplyWorkFlow.$inject = ['$location','$q','LinkedList','candidate','CandidateWorkFlow'];

    function ApplyWorkFlow($location,$q,LinkedList,candidate,CandidateWorkFlow) {
        var service = this;

        function WorkFlow() {
            this._head = null;
            this._current = null;
            this._apply = new LinkedList();
        }

        service.add = add;
        service.current = current;
        service.first = first;
        service.next = next;
        service.obtainCandidateLockState = CandidateWorkFlow.obtainLockState;
        service.releaseCandidateLockState = CandidateWorkFlow.releaseLockState;
        service.reset = reset;
        service.redirectToCurrent = redirectToCurrent;


        return service;

        function add(flow) {
            service._flow._apply.add(flow);
        }

        function first() {
            next();
        }

        function next() {
            if (service._flow === undefined) {
                return service._flow;
            }
            if (service._flow._head === null) {
                service._flow._head = service._flow._apply.head;
                service._flow._current = service._flow._head;
                return service._flow._current.data;
            }
            if (service._flow._current !== null) {
                service._flow._head = service._flow._current;
                service._flow._current = service._flow._current.next;
                if (service._flow._current !== null) {
                    return service._flow._current.data;
                } else {
                    return service._flow._current;
                }
            }
            return service._flow._current;
        }

        function reset() {
            service._flow = new WorkFlow();

            service._flow._apply.add({
                flow         : "application",
                retainSession: false,
                isOptional   : false
            });

            service._flow._apply.add({
                flow         : "application-assessment",
                url          : "/apply/assessment/",
                retainSession: true,
                isOptional   : true
            });

            service._flow._apply.add({
                flow         : "application-thank-you",
                url          : "/apply/thank-you/",
                retainSession: false,
                isOptional   : false
            });
        }

        function current() {
            if (service._flow === undefined) {
                return service._flow;
            }
            if (service._flow._current !== undefined && service._flow._current !== null) {
                return service._flow._current.data;
            } else {
                return service._flow._current;
            }
        }

        function redirectToCurrent() {
            $location.url(current().url);
        }
    }
}());

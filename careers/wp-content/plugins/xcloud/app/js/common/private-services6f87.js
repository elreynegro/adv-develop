'use strict';

/* Services */

var privateServices = angular.module('com.hrlogix.ats.private.services', ['ngResource']);

// A
privateServices.factory('privateAddress', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/address/:client/id/:addressId', {
        client   : clientName,
        addressId: '@addressId'
    }, {
        getAddressById      : {
            method         : 'GET',
            withCredentials: true
        },
        getAddressesByUserId: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/address/:client/user/:usersId',
            params         : {client: clientName, usersId: '@usersId'},
            withCredentials: true
        },
        addAddress          : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/address/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteAddress       : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/address/:client/:addressId',
            params         : {client: clientName, addressId: '@addressId'},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateApplication', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/requisition/:requisitionId', {
        client       : clientName,
        requisitionId: '@requisitionId'
    }, {
        getApplicationsByRequisitionId           : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        addApplication                           : {
            method         : 'PUT',
            isArray        : false,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getApplicationsByCandidateId             : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/candidate/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getApplication                           : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/id/:applicationId',
            params         : {client: clientName, applicationId: '@applicationId'},
            withCredentials: true
        },
        searchApplications                       : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/search',
            params         : {client: clientName},
            withCredentials: true
        },
        addApplicationStatuspById                : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/:applicationId/status/:status',
            params         : {client: clientName, applicationId: '@applicationId', status: '@status'},
            withCredentials: true
        },
        getApplicationStatusCountsByRequisitionId: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/status/counts/:requisitionId',
            params         : {client: clientName, requisitionId: '@requisitionId'},
            withCredentials: true
        },
        updateOffertemplete                      : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/application/:client/offertemplete/update/:applicationId/:approvalChainId/:offerTemplateId',
            params         : {
                client         : clientName,
                applicationId  : '@applicationId',
                approvalChainId: '@approvalChainId',
                offerTemplateId: '@offerTemplateId'
            },
            withCredentials: true
        }

    });

}]);

privateServices.factory('privateApplyFlow', ['$resource', function ($resource) {

    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystreams', {client: clientName}, {

        // Apply Streams

        getApplyStreams             : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystreams',
            params         : {client: clientName},
            withCredentials: true
        },
        getApplyStream              : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/:applyStreamId',
            params         : {client: clientName, applyStreamId: '@applyStreamId'},
            withCredentials: true
        },
        addApplyStream              : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream',
            params         : {client: clientName},
            withCredentials: true
        },
        updateApplyStream           : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApplyStream           : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/:applyStreamId',
            params         : {client: clientName, applyStreamId: '@applyStreamId'},
            withCredentials: true
        },
        getApplyStreamCfgs          : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/configs/:applyStreamId',
            params         : {client: clientName, applyStreamId: '@applyStreamId'},
            withCredentials: true
        },
        getApplyStreamCfg           : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/config/:applyStreamCfgId',
            params         : {client: clientName, applyStreamCfgId: '@applyStreamCfgId'},
            withCredentials: true
        },
        addApplyStreamCfg           : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/config',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApplyStreamCfg        : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/config/:applyStreamCfgId',
            params         : {client: clientName, applyStreamCfgId: '@applyStreamCfgId'},
            withCredentials: true
        },
        deleteApplyStreamCfgByStream: {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applystream/config/stream/:applyStreamId',
            params         : {client: clientName, applyStreamId: '@applyStreamId'},
            withCredentials: true
        },

        // Apply Containers

        getApplyContainers                : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainers/:applyStreamId',
            params         : {client: clientName, applyStreamId: '@applyStreamId'},
            withCredentials: true
        },
        getApplyContainer                 : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/:applyContainerId',
            params         : {client: clientName, applyContainerId: '@applyContainerId'},
            withCredentials: true
        },
        addApplyContainer                 : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer',
            params         : {client: clientName},
            withCredentials: true
        },
        updateApplyContainer              : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApplyContainer              : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/:applyContainerId',
            params         : {client: clientName, applyContainerId: '@applyContainerId'},
            withCredentials: true
        },
        getApplyContainerCfgs             : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/configs/:applyContainerId',
            params         : {client: clientName, applyContainerId: '@applyContainerId'},
            withCredentials: true
        },
        getApplyContainerCfg              : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/config/:applyContainerCfgId',
            params         : {client: clientName, applyContainerCfgId: '@applyContainerCfgId'},
            withCredentials: true
        },
        addApplyContainerCfg              : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/config',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApplyContainerCfg           : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/config/:applyContainerCfgId',
            params         : {client: clientName, applyContainerCfgId: '@applyContainerCfgId'},
            withCredentials: true
        },
        deleteApplyContainerCfgByStreamCfg: {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycontainer/config/streamcfg/:applyStreamCfgId',
            params         : {client: clientName, applyStreamCfgId: '@applyStreamCfgId'},
            withCredentials: true
        },

        // Apply Forms

        getAllApplyForms          : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyforms/all',
            params         : {client: clientName},
            withCredentials: true
        },
        getApplyForms             : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyforms/:applyContainerId',
            params         : {client: clientName, applyContainerId: '@applyContainerId'},
            withCredentials: true
        },
        getApplyForm              : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/:applyFormId',
            params         : {client: clientName, applyFormId: '@applyFormId'},
            withCredentials: true
        },
        addApplyForm              : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform',
            params         : {client: clientName},
            withCredentials: true
        },
        updateApplyForm           : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApplyForm           : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/:applyFormId',
            params         : {client: clientName, applyFormId: '@applyFormId'},
            withCredentials: true
        },
        getApplyFormCfgs          : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/configs/:applyFormId',
            params         : {client: clientName, applyFormId: '@applyFormId'},
            withCredentials: true
        },
        getApplyFormCfg           : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/config/:applyFormCfgId',
            params         : {client: clientName, applyFormCfgId: '@applyFormCfgId'},
            withCredentials: true
        },
        addApplyFormCfg           : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/config',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApplyFormCfg        : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/config/:applyFormCfgId',
            params         : {client: clientName, applyFormCfgId: '@applyFormCfgId'},
            withCredentials: true
        },
        deleteApplyFormCfgByStream: {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applyform/config/stream/:applyStreamId',
            params         : {client: clientName, applyStreamId: '@applyStreamId'},
            withCredentials: true
        },

        addApplyCandidate :{
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycandidate',
            params         : {client: clientName},
            withCredentials: true
        },
        updateApplyCandidate :{
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycandidate',
            params         : {client: clientName},
            withCredentials: true
        },
        getApplyCandidateRecordByCandidateId:   {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycandidates/:candidateId',
            isArray        : true,
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getApplyCandidateByCandidateIdReqId:   {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/applycandidates/:candidateId/:requisitionId',
            isArray        : true,
            params         : {client: clientName, candidateId: '@candidateId',requisitionId: '@requisitionId'},
            withCredentials: true
        },
        deleteApplyCandidateRecords:   {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/delete/:applycandidateId',
            params         : {client: clientName, applycandidateId: '@applycandidateId'},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateApprovalChain', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/all', {client: clientName}, {
        getAllApprovalChains       : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getApprovalChain           : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/id/:approvalChainId',
            params         : {client: clientName, approvalChainId: '@approvalChainId'},
            withCredentials: true
        },
        addApprovalChain           : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateApprovalChain        : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        deactivateApprovalChain    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/deactivate/:approvalChainId',
            params         : {client: clientName, approvalChainId: '@approvalChainId'},
            withCredentials: true
        },
        activateApprovalChain      : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/activate/:approvalChainId',
            params         : {client: clientName, approvalChainId: '@approvalChainId'},
            withCredentials: true
        },
        getApprovalChainDetails    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/details/:approvalChainId',
            params         : {client: clientName, approvalChainId: '@approvalChainId'},
            withCredentials: true
        },
        getApprovalChainDetail     : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/detail/id/:approvalChainDetailId',
            params         : {client: clientName, approvalChainDetailId: '@approvalChainDetailId'},
            withCredentials: true
        },
        addApprovalChainDetail     : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/detail',
            params         : {client: clientName},
            withCredentials: true
        },
        updateApprovalChainDetail  : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/detail',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteApprovalChainDetail  : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/detail/:approvalChainDetailId',
            params         : {client: clientName, approvalChainDetailId: '@approvalChainDetailId'},
            withCredentials: true
        },
        reorderApprovalChainDetails: {
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/approvalchain/:client/details/reorder',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateAuthMgmt', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/groups', {client: clientName}, {
        getGroups               : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getGroup                : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/group/:groupId',
            params         : {client: clientName, groupId: '@groupId'},
            withCredentials: true
        },
        addGroup                : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/group',
            params         : {client: clientName},
            withCredentials: true
        },
        updateGroup             : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/group',
            params         : {client: clientName},
            withCredentials: true
        },
        getGroupRoles           : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/grouproles/:groupId',
            params         : {client: clientName, groupId: '@groupId'},
            isArray        : true,
            withCredentials: true
        },
        getGroupings            : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/groupings',
            isArray        : true,
            withCredentials: true
        },
        getRoleGroupings        : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/rolegroupings',
            isArray        : true,
            withCredentials: true
        },
        addGroupRole            : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/grouproles',
            params         : {client: clientName},
            withCredentials: true
        },
        removeGroupRole         : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/grouproles/:groupRoleId',
            params         : {client: clientName, groupRoleId: '@groupRoleId'},
            withCredentials: true
        },
        getRoles                : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/roles',
            params         : {client: clientName},
            isArray        : true,
            withCredentials: true
        },
        getUserRoles            : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/userroles/:userId',
            params         : {client: clientName, userId: '@userId'},
            isArray        : true,
            withCredentials: true
        },
        addUserRole             : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/userroles',
            params         : {client: clientName},
            withCredentials: true
        },
        removeUserRole          : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/userroles/:userId/:roleId',
            params         : {client: clientName, userId: '@userId', roleId: '@roleId'},
            withCredentials: true
        },
        clearAuthenticationCache: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/authorization/management/:client/authcache/clear',
            withCredentials: true
        }
    });
}]);

// B
privateServices.factory('privateBackground', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/background/:client/orders/:candidateId', {
        client     : clientName,
        candidateId: '@candidateId'
    }, {
        getBackgroundOrders  : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getBackgroundPackages: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/background/:client/packages/all',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

// C
privateServices.factory('privateCandidate', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/id/:id', {
        client: clientName,
        id    : '@id'
    }, {
        getCandidate                               : {
            method         : 'GET',
            withCredentials: true
        },
        getCurrentCandidate                        : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/current',
            params         : {client: clientName},
            withCredentials: true
        },
        getCandidatesFromList                      : {
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/list',
            params         : {client: clientName},
            withCredentials: true
        },
        getCandidatesByRequisitionIdAndStepName    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/requisition/:requisitionId/stepname/:stepName',
            params         : {client: clientName, requisitionId: '@requisitionId', stepName: '@stepName'},
            withCredentials: true
        },
        getCandidateEducation                      : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/education/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getCandidateWorkHistory                    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/workhistory/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getCertifications                          : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/certification/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getCandidateProfessionalReferences         : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/profreference/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getCandidateAttachments                    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/attachment/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        createCandidateAssessment: {
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/:client/:candidateId/create',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        createCandidateAssessmentForRequisition: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/:client/create/:candidateId/:requisitionId',
            params         : {client: clientName, candidateId: '@candidateId', requisitionId : '@requisitionId'},
            withCredentials: true
        },
        getCandidateAssessments                    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/:client/id/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getCandidateCustomAssessments              : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/:client/id/:candidateId/custom',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        getAssessmentScores : {
            method         : 'GET',
            isArray        : false,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/:client/scores/:assessmentId',
            params         : {client: clientName, assessmentId: '@assessmentId'},
            withCredentials: true
        },
        startAssessment                            : {
            method           : 'POST',
            url              : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/assessment/:client/start/:assessmentId',
            params           : {client: clientName, assessmentId: '@assessmentId'},
            withCredentials  : true,
            transformResponse: function (data) {
                var response = [];
                var result = {};
                result.url = data;
                response.push(result);
                return response;
            }
        },
        addCandidate                               : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateCandidate                            : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        addWorkHistory                             : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/workhistory/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        addWorkHistoryList                             : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/workhistories/:client',
            isArray        : true,
            params         : {client: clientName},
            withCredentials: true
        },
        updateWorkHistory                          : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/workhistory/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteWorkHistory                          : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/workhistory/:client/:workHistoryId',
            params         : {client: clientName, workHistoryId: '@workHistoryId'},
            withCredentials: true
        },
        deleteAllCandidateWorkHistory                          : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/workhistory/all/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        addCertification                           : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/certification/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateCertification                        : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/certification/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteCertification                        : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/certification/:client/:certificationId',
            params         : {client: clientName, certificationId: '@certificationId'},
            withCredentials: true
        },
        addEducation                               : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/education/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        addEducationList                             : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/educations/:client',
            isArray        : true,
            params         : {client: clientName},
            withCredentials: true
        },
        updateEducation                            : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/education/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteEducationHistory                     : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/education/:client/:educationId',
            params         : {client: clientName, educationId: '@educationId'},
            withCredentials: true
        },
        deleteAllCandidateEducation                :{
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/education/all/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        searchCandidates                           : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/search',
            params         : {client: clientName},
            withCredentials: true
        },
        emailCandidate                             : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/email/:candidateId/template/:communicationTemplateId',
            params         : {
                client                 : clientName,
                candidateId            : '@candidateId',
                communicationTemplateId: '@communicationTemplateId'
            },
            withCredentials: true
        },
        emailCandidateByApplication                : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/email/application/:applicationId/template/:communicationTemplateId',
            params         : {
                client                 : clientName,
                applicationId          : '@applicationId',
                communicationTemplateId: '@communicationTemplateId'
            },
            withCredentials: true
        },
        getCandidateAttachmentById                 : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/attachment/:client/attachment/:attachmentId',
            params         : {client: clientName, attachmentId: '@attachmentId'},
            withCredentials: true
        },
        deleteCandidateAttachmentById              : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/attachment/:client/attachment/:attachmentId',
            params         : {client: clientName, attachmentId: '@attachmentId'},
            withCredentials: true
        },
        updateInterviewStatus                      : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/interview/:client',
            params         : {
                client: clientName
            },
            withCredentials: true
        },
        getInterviewListsByCandidateId             : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/interview/:client/candidate/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true,
            isArray        : true
        },
        getInterviewDetailsByCandidateIdInterviewId: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/interviewEvent/:client/getCandidateInterviewByID/:candidateId/:interviewId',
            params         : {client: clientName, candidateId: '@candidateId', interviewId: '@interviewId'},
            withCredentials: true
        },
        sendInterviewInviteFromCandidatePortal: {
            method: 'POST',
            url: ATS_URL + ATS_INSTANCE +'/rest/private/interview/:client/action/:action/externalCalendarId',
            params: {client: clientName, action: '@action'},
            withCredentials: true,
            isArray        : true
        },
        acceptRejectInterview: {
            method: 'PUT',
            url: ATS_URL + ATS_INSTANCE +'/rest/private/interview/:client/externalCalendarId/:externalCalendarId/candidateId/' +
            ':candidateId/action/:action',
            params: {client: clientName, externalCalendarId: '@externalCalendarId', candidateId: '@candidateId', action: '@action'},
            withCredentials: true,
            isArray        : true
        },
        addReference                               : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/profreference/:client/add',
            params         : {client: clientName},
            withCredentials: true
        },
        updateReference                            : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/profreference/:client/update',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteReference                            : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/profreference/:client/:profReferenceId/delete',
            params         : {client: clientName, profReferenceId: '@profReferenceId'},
            withCredentials: true
        },
        getCandidateReferences                     : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/profreference/:client/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        addCandidateActivity                    : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidateactivity/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getAllCandidateActivities                  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidateactivity/:client/all/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true,
            isArray        : true
        },
        updateCandidateActivity                    : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidateactivity/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getScreeningResult                     : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/screeningresults/:client/:candidateId/:applicationId',
            params         : {client: clientName, candidateId: '@candidateId', applicationId: '@applicationId'},
            headers          : {'Content-Type': 'text/plain'},
            transformResponse: function (data) {
                var result = {};
                switch(data){
                    case "450":
                        result.hasQualified = true;
                        break;
                    case "500":
                        result.hasQualified = false;
                        break;
                    case null:
                        result.hasQualified = null;
                        break;
                }
                var response = [];
                response.push(result);
                return result;
            },
            isArray        : false,
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateCandidateToken', ['$resource', function ($resource) {
    return {
        getCurrentCandidateByToken: function (token) {
            return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/id/:id', {
                client: clientName,
                id    : '@id'
            }, {
                query: {
                    method         : 'GET',
                    url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/current',
                    params         : {client: clientName},
                    headers        : {'Authorization': 'Bearer TEMP ' + token},
                    withCredentials: true
                }
            });
        }
    }
}]);

privateServices.factory('privateCandidatePwd', ['$resource', function ($resource) {
    return {
        resetPassword: function (token) {
            return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/id/:id', {
                client: clientName,
                id    : '@id'
            }, {
                query: {
                    method         : 'POST',
                    url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidate/:client/reset/',
                    headers        : {'Authorization': 'Bearer TEMP ' + token},
                    params         : {client: clientName},
                    withCredentials: true
                }
            });
        }
    }
}]);

privateServices.factory('privateCommunicationLog', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/communicationlog/:client/candidate/:candidateId', {
        client     : clientName,
        candidateId: '@candidateId'
    }, {
        getCommunicationLogByCandidateId: {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateCommunicationTemplates', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/communicationtemplate/:client/id/:communicationTemplateId', {
        client                 : clientName,
        communicationTemplateId: '@communicationTemplateId'
    }, {
        getCommunicationTemplate   : {
            method         : 'GET',
            withCredentials: true
        },
        addCommunicationTemplate   : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/communicationtemplate/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateCommunicationTemplate: {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/communicationtemplate/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getCommunicationTemplates  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/communicationtemplate/:client/active',
            params         : {client: clientName},
            withCredentials: true
        },
        getParsedOffer  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/communicationtemplate/:client/parse/offer/:offerId',
            params         : {client: clientName, offerId: '@offerId'},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateConfiguration', ['$resource', function ($resource) {
    return $resource('configuration/events/actions.json', {}, {
        getEventActionConfigurations: {
            method : 'GET',
            cache  : false,
            isArray: true
        },
        getEventPickList            : {
            method: 'GET',
            cache : false,
            url   : 'configuration/events/event_pick_list.json'
        },
        getEventTypeLabels          : {
            method: 'GET',
            cache : false,
            url   : 'configuration/events/event_step_labels.json'
        },
        getRequisitionExceptionList : {
            method: 'GET',
            cache : false,
            url   : 'configuration/events/requisition_field_exception_list.json'
        }
    });
}]);

// D
// E
privateServices.factory('privateEvents', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/events/eventtype/all', {}, {
        getAllEventTypes            : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getEventStepConfiguration   : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/eventstepconfiguration/:eventTypeId',
            params         : {eventTypeId: '@eventTypeId'},
            withCredentials: true
        },
        getEventConfigurationId     : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/eventconfiguration/:client/:eventTypeId',
            params         : {client: clientName, eventTypeId: '@eventTypeId'},
            withCredentials: true
        },
        getEventConfigurationData   : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/eventconfiguration/data/:client/:eventConfigId',
            params         : {client: clientName, eventConfigId: '@eventConfigId'},
            withCredentials: true
        },
        addEventConfigurationData   : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/eventconfiguration/:client/:eventTypeId',
            params         : {client: clientName, eventTypeId: '@eventTypeId'},
            withCredentials: true
        },
        updateEventConfigurationData: {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/eventconfiguration/data/:client/:eventConfigId',
            params         : {client: clientName, eventConfigId: '@eventConfigId'},
            withCredentials: true
        },
        getNewEvents                : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/new/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getBuiltAndCompletedEvents  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/built/complete/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getBuiltAndIncompleteEvents : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/built/incomplete/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getUnbuiltAndCompleteEvents : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/unbuilt/complete/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getEventActions             : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/actions/:client/:eventId',
            params         : {client: clientName, eventId: '@eventId'},
            withCredentials: true
        },
        getEventStatistics          : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/events/statistics/:client',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

// F
// G
// H
privateServices.factory('privateHierarchy', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client/id/:id', {
        client: clientName,
        id    : '@id'
    }, {
        getHierarchy        : {
            method         : 'GET',
            withCredentials: true
        },
        addHierarchy        : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateHierarchy     : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        removeHierarchy     : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        getHierarchyRoot    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client/root',
            params         : {client: clientName},
            withCredentials: true
        },
        getHierarchyChildren: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client/children/:parentId',
            params         : {client: clientName, parentId: '@parentId'},
            withCredentials: true
        },
        getHierarchyTree    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/hierarchy/:client/tree',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

// I
// J
// K
// L
privateServices.factory('privateLists', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/all/active', {client: clientName}, {
        getActiveListNames  : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getManagedLists     : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/managed',
            withCredentials: true
        },
        getUnmanagedLists   : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/unmanaged',
            withCredentials: true
        },
        addManagedList      : {
            method         : 'PUT',
            withCredentials: true
        },
        reorderListData     : {
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/reorder',
            withCredentials: true
        },
        getAllListDataByName: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/all/:name',
            params         : {client: clientName, name: '@name'},
            withCredentials: true
        },
        addListItem         : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client',
            withCredentials: true
        },
        updateListItem      : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client',
            withCredentials: true
        },
        activateListItem    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/activate/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        deactivateListItem  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/list/:client/deactivate/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        }
    });
}]);

// M
privateServices.factory('privateMessageBranding', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/messagebranding/:client', {client: clientName}, {
        getAllMessageBrandings   : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        addMessageBranding       : {
            method         : 'PUT',
            withCredentials: true
        },
        updateMessageBranding    : {
            method         : 'POST',
            withCredentials: true
        },
        activateMessageBranding  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/messagebranding/:client/activate/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        deactivateMessageBranding: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/messagebranding/:client/deactivate/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        getMessageBranding       : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/messagebranding/:client/id/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateMeta', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/meta/columnnames/:client/:entityName', {
        client    : clientName,
        entityName: '@entityName'
    }, {
        getColumnNames: {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateMetadata', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/metadata/:client/fields/:entityName', {
        client    : clientName,
        entityName: '@entityName'
    }, {
        getTableMetadata     : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
// New naming, above is kept for compatiblity.
        getCustomFieldNames  : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        addCustomFieldName   : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/metadata/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateCustomFieldName: {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/metadata/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getRawColumnNames    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/metadata/:client/raw/:entity/:customOnly',
            params         : {client: clientName, entity: '@entity', customOnly: '@customOnly'},
            withCredentials: true
        }
    });
}]);

// N
// O
privateServices.factory('privateOffer', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/id/:offerId', {
        client : clientName,
        offerId: '@offerId'
    }, {

// Offer Services
        getOffer                 : {
            method         : 'GET',
            withCredentials: true
        },
        getOffersByApplicationIds: {
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/applicationids',
            params         : {client: clientName},
            withCredentials: true
        },
        addOffer                 : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateOffer              : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateOfferStatusById    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/:offerId/status/:status',
            params         : {client: clientName, offerId: '@offerId', status: '@status'},
            withCredentials: true
        },

// Offer Template Services

        getOfferTemplate       : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/template/id/:offerTemplateId',
            params         : {client: clientName, offerTemplateId: '@offerTemplateId'},
            withCredentials: true
        },
        getOfferTemplates      : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/templates',
            params         : {client: clientName},
            withCredentials: true
        },
        addOfferTemplate       : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/template',
            params         : {client: clientName},
            withCredentials: true
        },
        updateOfferTemplate    : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/template',
            params         : {client: clientName},
            withCredentials: true
        },
        activateOfferTemplate  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/template/activate/:offerTemplateId',
            params         : {client: clientName, offerTemplateId: '@offerTemplateId'},
            withCredentials: true
        },
        deactivateOfferTemplate: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/template/deactivate/:offerTemplateId',
            params         : {client: clientName, offerTemplateId: '@offerTemplateId'},
            withCredentials: true
        },

// Offer Element Services

        getOfferElement   : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/element/:offerElementId',
            params         : {client: clientName, offerElementId: '@offerElementId'},
            withCredentials: true
        },
        getOfferElements  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/elements/:offerTemplateId',
            params         : {client: clientName, offerTemplateId: '@offerTemplateId'},
            withCredentials: true
        },
        addOfferElement   : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/element',
            params         : {client: clientName},
            withCredentials: true
        },
        updateOfferElement: {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/element',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteOfferElement: {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/element/:offerElementId',
            params         : {client: clientName, offerElementId: '@offerElementId'},
            withCredentials: true
        },

// Offer Approval Services

        getOfferApprovalsForUser    : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/approval/:usersId',
            params         : {client: clientName, usersId: '@usersId'},
            withCredentials: true
        },
        acceptOffer                 : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/approval/accept/:offerId/:usersId',
            params         : {client: clientName, offerId: '@offerId', usersId: '@usersId'},
            withCredentials: true
        },
        rejectOffer                 : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/approval/reject/:offerId/:usersId',
            params         : {client: clientName, offerId: '@offerId', usersId: '@usersId'},
            withCredentials: true
        },
        updateOfferApproval         : {
            method         : 'POST',
            isArray        : false,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/offerapproval/update',
            params         : {client: clientName},
            withCredentials: true
        },
        addOfferApproval            : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/offerapproval',
            params         : {client: clientName},
            withCredentials: true
        },
        getApprovalByOfferId        : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/offerapproval/offerid/:offerId',
            params         : {client: clientName, offerId: '@offerId'},
            isArray        : true,
            withCredentials: true
        },
        getApprovalByOfferApprovalId: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/offerapproval/offerapprovalid/:offerApprovalId',
            params         : {client: clientName, offerApprovalId: '@offerApprovalId'},
            isArray        : false,
            withCredentials: true
        },
        removeOfferApproval         : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/offerapproval/delete/:offerId',
            params         : {client: clientName, offerId: '@offerId'},
            withCredentials: true
        },

// Extend the offer

        extendOffer: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/offer/:client/extend/:offerId',
            params         : {client: clientName, offerId: '@offerId'},
            withCredentials: true
        }

    });
}]);

// P
privateServices.factory('privatePage', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/page/info/:client/active', {client: clientName}, {
        getPageInfo   : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getPageVersion: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/page/version/:client',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

// Q
privateServices.factory('privateQuestions', ['$resource', function ($resource) {

    // Question Groups
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/groups/active', {client: clientName}, {
        getActiveQuestionGroups: {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getAllQuestionGroups   : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/groups/all',
            params         : {client: clientName},
            withCredentials: true
        },
        addQuestionGroup       : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group',
            params         : {client: clientName},
            withCredentials: true
        },
        updateQuestionGroup    : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group',
            params         : {client: clientName},
            withCredentials: true
        },
        activateQuestionGroup  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group/activate/:questionGroupId',
            params         : {client: clientName, questionGroupId: '@questionGroupId'},
            withCredentials: true
        },
        deactivateQuestionGroup: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group/deactivate/:questionGroupId',
            params         : {client: clientName, questionGroupId: '@questionGroupId'},
            withCredentials: true
        },

        // Question Group Details
        getQuestionGroupDetails  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group/details/:questionGroupId',
            params         : {client: clientName, questionGroupId: '@questionGroupId'},
            withCredentials: true
        },
        addQuestionGroupDetail   : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group/detail/:questionGroupId/:generalQuestionsId',
            params         : {
                client            : clientName,
                questionGroupId   : '@questionGroupId',
                generalQuestionsId: '@generalQuestionsId'
            },
            withCredentials: true
        },
        deleteQuestionGroupDetail: {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/group/detail/:questionGroupId/:generalQuestionsId',
            params         : {
                client            : clientName,
                questionGroupId   : '@questionGroupId',
                generalQuestionsId: '@generalQuestionsId'
            },
            withCredentials: true
        },


        // General Questions
        getGeneralQuestions      : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/questions/:questionGroupId',
            params         : {client: clientName, questionGroupId: '@questionGroupId'},
            withCredentials: true
        },
        addGeneralQuestion       : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/question',
            params         : {client: clientName},
            withCredentials: true
        },
        updateGeneralQuestion    : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/question',
            params         : {client: clientName},
            withCredentials: true
        },
        activateGeneralQuestion  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/question/activate/:generalQuestionsId',
            params         : {client: clientName, generalQuestionsId: '@generalQuestionsId'},
            withCredentials: true
        },
        deactivateGeneralQuestion: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/question/deactivate/:generalQuestionsId',
            params         : {client: clientName, generalQuestionsId: '@generalQuestionsId'},
            withCredentials: true
        },

        // General Options
        getGeneralOptions      : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/options/:generalQuestionsId',
            params         : {client: clientName, generalQuestionsId: '@generalQuestionsId'},
            withCredentials: true
        },
        addGeneralOption       : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/option',
            params         : {client: clientName},
            withCredentials: true
        },
        updateGeneralOption    : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/option',
            params         : {client: clientName},
            withCredentials: true
        },
        activateGeneralOption  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/option/activate/:generalOptionId',
            params         : {client: clientName, generalOptionId: '@generalOptionId'},
            withCredentials: true
        },
        deactivateGeneralOption: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/general/option/deactivate/:generalOptionId',
            params         : {client: clientName, generalOptionId: '@generalOptionId'},
            withCredentials: true
        },

        // Requistion Questions
        getReqQuestions  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/requisition/:requisitionId',
            params         : {client: clientName, requisitionId: '@requisitionId'},
            withCredentials: true
        },
        addReqQuestion   : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/requisition',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteReqQuestion: {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/requisition/:requisitionId/:questionGroupId',
            params         : {client: clientName, requisitionId: '@requisitionId', questionGroupId: '@questionGroupId'},
            withCredentials: true
        },

        // Answers
        getAnswersByCandidateApplicationId: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/answers/candidate/:candidateId/application/:applicationId',
            params         : {client: clientName, candidateId: '@candidateId', applicationId: '@applicationId'},
            withCredentials: true
        },
        getAnswerById                     : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/answer/:answersId',
            params         : {client: clientName, answersId: '@answersId'},
            withCredentials: true
        },
        addAnswer                         : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/answer',
            params         : {client: clientName},
            withCredentials: true
        },
        updateAnswer                      : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/answer',
            params         : {client: clientName},
            withCredentials: true
        },
        deleteAnswer                      : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/questions/:client/answer/:answersId',
            params         : {client: clientName, answersId: '@answersId'},
            withCredentials: true
        }
    });
}]);

// R
privateServices.factory('privateReporting', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + 'reporting/rest/casandra/appcounts_all_by_year/:client', {client: clientName}, {
        getAppCountsAllByYear   : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getLast30DaysAppCounts  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + 'reporting/rest/casandra/appcounts_all_by_year_month_day/last30/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getLast24MonthsAppCounts: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + 'reporting/rest/casandra/appcounts_all_by_year_month/last24/:client',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateRequisition', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client', {client: clientName}, {
        addRequisition                : {
            method         : 'PUT',
            isArray        : false,
            withCredentials: true
        },
        updateRequisition             : {
            method         : 'POST',
            isArray        : false,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getRequisitionsFromList       : {
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/list',
            params         : {client: clientName},
            withCredentials: true
        },
        getRequisitionsByHierarchyId  : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/hierarchy/:parentId',
            params         : {client: clientName, parentId: '@parentId'},
            withCredentials: true
        },
        getRequisitionsByStatus       : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/status/:status',
            params         : {client: clientName, status: '@status'},
            isArray        : true,
            withCredentials: true
        },
        getRequisitionTemplates       : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/templates',
            params         : {client: clientName},
            isArray        : true,
            withCredentials: true
        },
        updateRequisitionHierarchyId  : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/:id/hierarchy/:hierarchyId',
            params         : {client: clientName, id: '@id', hierarchyId: '@hierarchyId'},
            withCredentials: true
        },
        getRequisitionStatus          : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqstatus/id/:reqStatusId',
            params         : {client: clientName, reqStatusId: '@reqStatusId'},
            withCredentials: true
        },
        getStatusesByRequisitionId    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqstatus/requisition/:requisitionId',
            params         : {client: clientName, requisitionId: '@requisitionId'},
            isArray        : true,
            withCredentials: true
        },
        addRequisitionStatus          : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqstatus',
            params         : {client: clientName},
            withCredentials: true
        },
        searchRequisitions            : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/search',
            params         : {client: clientName},
            withCredentials: true
        },
        addRequisitionApprover        : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqapproval',
            params         : {client: clientName},
            withCredentials: true
        },
        updateRequisitionApprover     : {
            method         : 'POST',
            isArray        : false,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqapproval/update',
            params         : {client: clientName},
            withCredentials: true
        },
        getApproverByRequisitionId    : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqapproval/requisition/:requisitionId',
            params         : {client: clientName, requisitionId: '@requisitionId'},
            isArray        : true,
            withCredentials: true
        },
        getApproverByApprovalId       : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqapproval/requisition/reqapprovalid/:reqApprovalId',
            params         : {client: clientName, reqApprovalId: '@reqApprovalId'},
            isArray        : true,
            withCredentials: true
        },
        removeApprover                : {
            method         : 'DELETE',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqapproval/:requisitionId',
            params         : {client: clientName, requisitionId: '@requisitionId'},
            withCredentials: true
        },
        getRequisitionApprovalsForUser: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/requisition/:client/reqapproval/:usersId',
            params         : {client: clientName, usersId: '@usersId'},
            isArray        : true,
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateRequisitionRepository', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/requisitionrepository/:client/requisition/:requisitionId', {
        client       : clientName,
        requisitionId: '@requisitionId'
    }, {
        getRequisitionRepositoryByReqId: {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        }
    });
}]);

// S
privateServices.factory('privateShare', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/share/site/:client', {client: clientName}, {
        getSite       : {
            method         : 'GET',
            withCredentials: true
        },
        getPostalCodes: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/share/postalcode/:postalcode',
            params         : {postalcode: '@postalcode'},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateStep', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/step/counts/:client/requisition/:requisitionId', {
        client       : clientName,
        requisitionId: '@requisitionId'
    }, {
        getStepCountsByRequisitionId                : {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getApplicationStepsById                     : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/step/list/:client/:applicationId',
            isArray        : true,
            params         : {client: clientName, applicationId: '@applicationId'},
            withCredentials: true
        },
        // This doesn't exist on the Step endpoint???
        getApplicationStepsByIdAndStateByHoursInPast: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/step/list/:client/:applicationId/:hoursOld',
            isArray        : true,
            params         : {client: clientName, applicationId: '@applicationId', hoursOld: '@hoursOld'},
            withCredentials: true
        },
        getStepCountsByRequisitionIdAndAge          : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/step/counts/:client/requisition/age/:requisitionId/:hoursOld',
            isArray        : true,
            params         : {client: clientName, requisitionId: '@requisitionId', hoursOld: '@hoursOld'},
            withCredentials: true
        },
        addApplicationStepById                      : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/step/:client/:applicationId/:usersId/step/:stepValue',
            params         : {
                client       : clientName,
                applicationId: '@applicationId',
                usersId      : '@usersId',
                stepValue    : '@stepValue'
            },
            withCredentials: true
        }
    });
}]);

// T
privateServices.factory('privateTransactionLog', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/transactionlog/:client/candidate/:candidateId/:usersId', {
        client     : clientName,
        candidateId: '@candidateId',
        usersId    : '@usersId'
    }, {
        addTransactionLogByCandidateId: {
            method         : 'POST',
            withCredentials: true
        },
        getEntriesByCandidateId       : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/transactionlog/:client/candidate/:candidateId',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        } ,
        addEntryByCandidateId         :{
            method         : 'POST',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/transactionlog/:client/candidate/:candidateId/:usersId',
            params         : {client: clientName, candidateId: '@candidateId', usersId: '@usersId'},
            withCredentials: true
        }
    });
}]);

// U
privateServices.factory('privateUser', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/id/:id', {client: clientName, id: '@id'}, {
        getUser                 : {
            method         : 'GET',
            withCredentials: true
        },
        addUser                 : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateUser              : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        activateUser            : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/activate/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        deactivateUser          : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/deactivate/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        getCurrentUser          : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/current',
            params         : {client: clientName},
            withCredentials: true
        },
        getUsersByHierarchyId   : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/hierarchy/:parentId',
            params         : {client: clientName, parentId: '@parentId'},
            isArray        : true,
            withCredentials: true
        },
        updateUserHierarchyId   : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/:id/hierarchy/:hierarchyId',
            params         : {client: clientName, id: '@id', hierarchyId: '@hierarchyId'},
            withCredentials: true
        },
        updateUserPrefs         : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/userprefs/:id',
            params         : {client: clientName, id: '@id'},
            withCredentials: true
        },
        getAllActiveUsersMinimal: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/all/minimal',
            params         : {client: clientName},
            isArray        : true,
            withCredentials: true
        },
        emailUserByCandidate    : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/email/:usersId/candidate/:candidateId/template/:communicationTemplateId',
            params         : {
                client                 : clientName,
                usersId                : '@usersId',
                candidateId            : '@candidateId',
                communicationTemplateId: '@communicationTemplateId'
            },
            withCredentials: true
        },
        emailUserByApplication  : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/user/:client/email/:usersId/application/:applicationId/template/:communicationTemplateId',
            params         : {
                client                 : clientName,
                usersId                : '@usersId',
                applicationId          : '@applicationId',
                communicationTemplateId: '@communicationTemplateId'
            },
            withCredentials: true
        }
    });
}]);

// V
privateServices.factory('privateVendor', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client/id/:vendorId', {
        client  : clientName,
        vendorId: '@vendorId'
    }, {
        getVendorById        : {
            method         : 'GET',
            withCredentials: true
        },
        getVendors           : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client/all',
            withCredentials: true
        },
        addVendor            : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateVendor         : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getAllVendorsUsers   : {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client/user/all/:usersId',
            params         : {client: clientName, usersId: '@usersId'},
            withCredentials: true
        },
        getActiveVendorsUsers: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client/user/:usersId',
            params         : {client: clientName, usersId: '@usersId'},
            withCredentials: true
        },
        addVendorUser        : {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client/user',
            params         : {client: clientName},
            withCredentials: true
        },
        updateVendorUser     : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/vendor/:client/user',
            params         : {client: clientName},
            withCredentials: true
        }

    });
}]);

privateServices.factory('privateViewGroup', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/viewgroup/:client/all', {client: clientName}, {
        getAllViewGroups: {
            method         : 'GET',
            isArray        : true,
            withCredentials: true
        },
        getViewGroupById: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/viewgroup/:client/id/:viewGroupId',
            params         : {client: clientName, viewGroupId: '@viewGroupId'},
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateFolder', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/folder/:client/candidates/include', {client: clientName}, {
        includeCandidates: {
            method         : 'POST',
            isArray        : true,
            withCredentials: true
        }
    });
}]);

privateServices.factory('privateCandidateOptIn', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/candidateOptin/:client/candidateOptinId/:candidateOptinId/candidateId/:candidateId', {client: clientName}, {
        isExists: {
            method         : 'GET',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        },
        consent : {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/private/candidateOptin/:client/addOptinDetails',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

//onboarding methods
privateServices.factory('privateOnboarding', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/private/applyflow/:client/onboarding/formgroup/metadata/:candidateId', {client: clientName}, {
        getOnboardingFormJSON: {
            method         : 'GET',
            params         : {client: clientName, candidateId: '@candidateId'},
            withCredentials: true
        }
    })

}]);
// W
// X
// Y
// Z

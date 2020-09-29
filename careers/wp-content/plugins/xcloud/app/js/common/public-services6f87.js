'use strict';

/* Services */

var publicServices = angular.module('com.hrlogix.ats.public.services', ['ngResource']);

publicServices.factory('applyflow', ['$resource', function($resource) {

    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applystreams', { client: clientName }, {

        // Apply Streams

        getApplyStreams: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applystreams',
            params: { client: clientName },
            withCredentials: true
        },
        getApplyStreamCfgs: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applystream/configs/:applyStreamId',
            params: { client: clientName, applyStreamId: '@applyStreamId' },
            withCredentials: true
        },

        // Apply Containers

        getApplyContainers: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applycontainers/:applyStreamId',
            params: { client: clientName, applyStreamId: '@applyStreamId' },
            withCredentials: true
        },
        getApplyContainerCfgs: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applycontainer/configs/:applyStreamCfgId',
            params: { client: clientName, applyStreamCfgId: '@applyStreamCfgId' },
            withCredentials: true
        },

        // Apply Forms

        getApplyForms: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applyforms/:applyStreamCfgId',
            params: { client: clientName, applyStreamCfgId: '@applyStreamCfgId' },
            withCredentials: true
        },
        getApplyFormCfgs: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/applyflow/:client/applyform/configs/:applyFormId',
            params: { client: clientName, applyFormId: '@applyFormId' },
            withCredentials: true
        }
    });
}]);

publicServices.factory('candidateSubscription', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/candidatesubscription/:client/subscriptions', { client: clientName}, {
        getList: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidatesubscription/:client/subscriptions' ,
            params: { client: clientName},
            withCredentials: true
        },

        modify: {
            method: 'POST',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidatesubscription/:client/modifysubscription' ,
            params: { client: clientName},
            withCredentials: true
        },
        getSubscription: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidatesubscription/:client/subscriptions/candidateId/:candidateId',
            params         : {candidateId: '@candidateId'},
            withCredentials: true
        }

    });
}]);

publicServices.factory('candidate', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/id/:candidateId', { client: clientName }, {
    	nameSearchCandidates: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/private/esservice/:client/name',
            withCredentials: true
        },
        keywordSearch: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/private/esservice/:client/keyword',
            withCredentials: true
        },
        getCandidate: {
            method: 'GET',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/id/:candidateId',
            params: { client: clientName, candidateId: '@candidateId' },
            withCredentials: true
        },
        addCandidate: {
            method: 'PUT',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client',
            params: { client: clientName },
            withCredentials: true
        },
        updateCandidate: {
            method: 'POST',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client',
            params: { client: clientName },
            withCredentials: true
        },
        candidateExists: {
            method: 'GET',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/exists?username=:username',
            params: { client: clientName, username: '@username' },
            withCredentials: true
        },
        getCandidateActivationByEmail: {
            method: 'GET',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/active/email/:username',
            params: { client: clientName, username: '@username' },
            withCredentials: true
        },
        emailCandidate: {
            method: 'GET',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/email/template/:type/:name?username=:username',
            params: { client: clientName, type: '@type', name: '@name', username: '@username' },
            withCredentials: true
        },
        addCandidateToSocialChannel: {
            method         : 'PUT',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/socialchannelconfig/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        updateCandidateInSocialChannel: {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/socialchannelconfig/:client',
            params         : {client: clientName},
            withCredentials: true
        },
        getSocialChannel: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/socialchannel/:socialChannelName',
            params         : {client: clientName, socialChannelName: '@socialChannelName'},
            withCredentials: true
        },
        gigyaNotifyRegistration: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/gigya/registration/:client/candidateid/:candidateId/social/:socialChannelId/type/:apiKeyType',
            params         : {client: clientName, candidateId: '@candidateId', socialChannelId: '@socialChannelId',apiKeyType : '@apiKeyType'},
            withCredentials: true
        },
        getSocialChannelByEmailAndSocialProvider: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/socialchannelconfig/:userEmail/:socialChannelName',
            params         : {client: clientName, userEmail: '@userEmail',socialChannelName: '@socialChannelName'},
            withCredentials: true
        },
        getCandidateByEmail: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/id/email/:emailId',
            params: { client: clientName, emailId: '@emailId' },
            withCredentials: true
        },
        getSocialChannelByEmail: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/socialchannelconfig/:userEmail',
            params         : {client: clientName, userEmail: '@userEmail'},
            withCredentials: true
        },
        getSocialUserInfo: {
            method         : 'POST',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/gigya/userinfo/:client/type/:apiKeyType',
            params         : {client: clientName, apiKeyType : GIGYA_SOCIAL_SETTINGS.gigyashortcode},
            withCredentials: true
        },
        getPostalCodesData: {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/share/postalcode/:postalcode',
            params         : {postalcode: '@postalcode'},
            isArray        : true,
            withCredentials: true
        },
        getLanguages: {
            method         : 'GET',
            isArray        : true,
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/languages',
            params         : {client: clientName},
            withCredentials: true
        }
    });
}]);

publicServices.factory('jobsearch', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/jobsearch/open/:client/internal/:internal', { client: clientName, internal: '@internal' }, {
        searchAllOpenJobs: {
            method: 'GET',
            isArray: true,
            withCredentials: true
        },
        searchOpenJobs: {
            method: 'POST',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/jobsearch/open/:client',
            params: { client: clientName },
            isArray: true,
            withCredentials: true
        },
        getJobCountsByField: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/jobsearch/jobcount/:client/:field/internal/:internal',
            params: { client: clientName, field: '@field', internal: '@internal' },
            withCredentials: true
        }
    });
}]);

publicServices.factory('lists', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/list/:client/name/:name', { client: clientName, name: '@name' }, {
        getActiveListByName: {
            method: 'GET',
            isArray: true,
            withCredentials: true
        }
    });
}]);

publicServices.factory('metadata', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/metadata/:client/name/:table', { client: clientName, table: '@table' }, {
        getTableMetadata: {
            method: 'GET',
            isArray: true,
            withCredentials: true
        },
        getCustomFieldMetaData:{
            url: ATS_URL + ATS_INSTANCE + '/rest/public/metadata/:client/fieldmanagement/metadata/:requisitionId',
            method: 'GET',
            withCredentials: true,
            params: { client: clientName, requisitionId: '@requisitionId'}
        },
        getStreamCustomFieldMetaData:{
            url: ATS_URL + ATS_INSTANCE + '/rest/public/metadata/:client/fieldmanagement/metadata/streamid/:streamId',
            method: 'GET',
            withCredentials: true,
            params: { client: clientName, streamId: '@streamId'}
        }
    });
}]);

publicServices.factory('questions', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/groups/active', { client: clientName }, {
        getReqQuestions: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/requisition/:requisitionId',
            params: { client: clientName, requisitionId: '@requisitionId' },
            withCredentials: true
        },
        getActiveQuestionGroups: {
            method: 'GET',
            isArray: true,
            withCredentials: true
        },
        getAllQuestionGroups: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/groups/all',
            params: { client: clientName },
            withCredentials: true
        },
        getQuestionGroupDetails: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/group/details/:questionGroupId',
            params: { client: clientName, questionGroupId: '@questionGroupId' },
            withCredentials: true
        },
        getGeneralQuestions: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/general/questions/:questionGroupId',
            params: { client: clientName, questionGroupId: '@questionGroupId' },
            withCredentials: true
        },
        getGeneralOptions: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/general/options/:generalQuestionsId',
            params: { client: clientName, generalQuestionsId: '@generalQuestionsId' },
            withCredentials: true
        },
        getAnswersByCandidateApplicationId: {
            method: 'GET',
            isArray: true,
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/answers/candidate/:candidateId/application/:applicationId',
            params: { client: clientName, candidateId: '@candidateId', applicationId: '@applicationId' },
            withCredentials: true
        },
        getAnswerById: {
            method: 'GET',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/answer/:answersId',
            params: { client: clientName, answersId: '@answersId' },
            withCredentials: true
        },
        addAnswer: {
            method: 'PUT',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/answer',
            params: { client: clientName },
            withCredentials: true
        },
        updateAnswer: {
            method: 'POST',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/answer',
            params: { client: clientName },
            withCredentials: true
        },
        deleteAnswer: {
            method: 'DELETE',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/questions/:client/answer/:answersId',
            params: { client: clientName, answersId: '@answersId' },
            withCredentials: true
        }

    });
}]);

publicServices.factory('requisition', ['$resource', function($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/requisition/:client/id/:id', { client: clientName, id: '@id' }, {
        getRequisition: {
            method: 'GET',
            withCredentials: true
        },
        searchRequisitions: {
        	method: 'POST',
        	url: ATS_URL + ATS_INSTANCE + '/rest/public/requisition/:client/search',
        	params: { client: clientName },
        	withCredentials: true
        }
    });
}]);

publicServices.factory('jobsapi', ['$resource', function($resource) {
    // TODO: get configured jobs api url
    return $resource(cws_opts && cws_opts.api ? cws_opts.api + 'job/' : 'https://jobsapi3i-internal.findly.com/api/job/', { callback: 'JSON_CALLBACK' }, {
        getJob: {
            method: 'JSONP',
            params: { jobId: '@jobId', '_': Math.random() } // non-caching param temporary
        },
        getReqs: {
            method: 'JSONP',
            params: { organization: JOBSAPI_ORG }
        }
    });
}]);

publicServices.factory('publicFolder', ['$resource', function ($resource) {
    return $resource(ATS_URL + ATS_INSTANCE + '/rest/public/folder/:client/type/:type/requisition/:requisitionId', {client: clientName, type: '@type', requisitionId: '@requisitionId'}, {
        getFolderByRequisitionAndType: {
            method: 'GET',
            isArray: true,
            withCredentials: true
        },
        addCandidateToFolder         :{
            method: 'POST',
            url: ATS_URL + ATS_INSTANCE + '/rest/public/folder/:client/move/candidates/folders/',
            params: {client: clientName},
            withCredentials: true
        },
        addCandidateToFolderByEmail  : {
            method         : 'GET',
            url            : ATS_URL + ATS_INSTANCE + '/rest/public/candidate/:client/addCandidate/:folderId/:email',
            params         : {client: clientName, folderId: '@folderId', email: '@email'},
            withCredentials: true
        }
    });
}]);


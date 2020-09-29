(function() {
    'use strict';

    angular
        .module('analytics.omni.tagging')
        .factory('omniTaggingFactory',['md5',function omniTaggingFactory(md5) {
            var omniTaggingConfiguration={
                ATS_Join: {
                    se_ca: "lcp",
                    se_ac: "profile_join",
                    se_pr: 0,/*candidate ID*/
                    aid: "",
                    se_la: 0,
                    uid: ""
                },
                ATS_apply: {
                    se_ca: "conversion",
                    se_ac: "app_complete",
                    se_la: 0, /*requisition ID*/
                    se_pr: 0, /*candidate ID*/
                    aid: "",
                    uid: ""
                },
                ATS_partial_apply: {
                    se_ca: "lcp",
                    se_ac: "profile_join",
                    se_la: 0,/*requisition ID*/
                    se_pr: 0,/*candidate ID*/
                    aid: "",
                    uid: ""
                },
                MICROSITE_campaign: {
                    se_ca: "microsite",
                    se_ac: "campaign_complete",
                    se_la: 0, /*microsite ID*/
                    se_pr: 0, /*candidate ID*/
                    aid: "clientID",
                    uid: "" /*email address of the candidate */
                }
            };
            var omniTagginPopulateParams = function(aid,candidateId,requisitionId,email){
                var hashedOutEmail = md5.createHash(email || '');
                for (var prop in omniTaggingConfiguration){
                    if(omniTaggingConfiguration.hasOwnProperty(prop)){

                        omniTaggingConfiguration[prop].aid = aid;
                        omniTaggingConfiguration[prop].se_pr = candidateId;
                        omniTaggingConfiguration[prop].se_la = requisitionId;
                        omniTaggingConfiguration[prop].uid = hashedOutEmail;

                    }
                }
            }
            var omniTaggingCreateTag = function(flow){
                var taggingSrc = "https://d.hodes.com/i?tv=pixel_tracker&p=web&e=se&aid=";  //symphonytalent&p=web&e=se&se_ca=LCP&se_ac=profile_join&se_pr=6c16e721d6d562b5de5289a10a3ee43e"
                switch(flow) {
                    case "ATS_Join":
                        taggingSrc += omniTaggingConfiguration.ATS_Join.aid;
                        taggingSrc = taggingSrc + "&se_ca=" + omniTaggingConfiguration.ATS_Join.se_ca;
                        taggingSrc = taggingSrc + "&se_ac=" + omniTaggingConfiguration.ATS_Join.se_ac;
                        taggingSrc = taggingSrc + "&se_pr=" + omniTaggingConfiguration.ATS_Join.se_pr;
                        taggingSrc = taggingSrc + "&uid=" + omniTaggingConfiguration.ATS_Join.uid;

                        break;
                    case "ATS_apply":
                        taggingSrc += omniTaggingConfiguration.ATS_apply.aid;
                        taggingSrc = taggingSrc + "&se_ca=" + omniTaggingConfiguration.ATS_apply.se_ca;
                        taggingSrc = taggingSrc + "&se_ac=" + omniTaggingConfiguration.ATS_apply.se_ac;
                        taggingSrc = taggingSrc + "&se_la=" + omniTaggingConfiguration.ATS_apply.se_la;
                        taggingSrc = taggingSrc + "&se_pr=" + omniTaggingConfiguration.ATS_apply.se_pr;
                        taggingSrc = taggingSrc + "&uid=" + omniTaggingConfiguration.ATS_apply.uid;
                        break;
                    case "ATS_partial_apply":
                        taggingSrc += omniTaggingConfiguration.ATS_partial_apply.aid;
                        taggingSrc = taggingSrc + "&se_ca=" + omniTaggingConfiguration.ATS_partial_apply.se_ca;
                        taggingSrc = taggingSrc + "&se_ac=" + omniTaggingConfiguration.ATS_partial_apply.se_ac;
                        taggingSrc = taggingSrc + "&se_la=" + omniTaggingConfiguration.ATS_partial_apply.se_la;
                        taggingSrc = taggingSrc + "&se_pr=" + omniTaggingConfiguration.ATS_partial_apply.se_pr;
                        taggingSrc = taggingSrc + "&uid=" + omniTaggingConfiguration.ATS_partial_apply.uid;
                        break;
                    case "MICROSITE_campaign":
                        taggingSrc += omniTaggingConfiguration.MICROSITE_campaign.aid;
                        taggingSrc = taggingSrc + "&se_ca=" + omniTaggingConfiguration.MICROSITE_campaign.se_ca;
                        taggingSrc = taggingSrc + "&se_ac=" + omniTaggingConfiguration.MICROSITE_campaign.se_ac;
                        taggingSrc = taggingSrc + "&se_la=" + omniTaggingConfiguration.MICROSITE_campaign.se_la;
                        taggingSrc = taggingSrc + "&se_pr=" + omniTaggingConfiguration.MICROSITE_campaign.se_pr;
                        taggingSrc = taggingSrc + "&uid=" + omniTaggingConfiguration.MICROSITE_campaign.uid;
                        break;
                }
                return taggingSrc
            };

            var omniTaggingObject={
                omniTaggingCreateTag: omniTaggingCreateTag,
                omniTagginPopulateParams: omniTagginPopulateParams
            };
            return omniTaggingObject;
        }])

})();

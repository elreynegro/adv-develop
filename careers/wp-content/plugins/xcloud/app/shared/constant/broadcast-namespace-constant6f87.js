/**
 * Created by TDadam on 12/21/2017.
 */
var BROAD_CAST_NAMESPACE = {};

initializeNamespace();

function initializeNamespace() {
    BROAD_CAST_NAMESPACE.SCHEMA_FORM_VALIDATE = 'schemaFormValidate';
    BROAD_CAST_NAMESPACE.CURRENT_CANDIDATE_FETCHED = 'CurrentCandidateDetailsFetched';
    BROAD_CAST_NAMESPACE.UPDATE_CANDIDATE_SCOPE = 'UpdateCandidateScope';
    BROAD_CAST_NAMESPACE.GET_CANDIDATE_ACTIVITY = 'getCandidateActivityViewModel';
    BROAD_CAST_NAMESPACE.CANDIDATE_ACTIVITY_VM_REFRESH = 'refreshCandidateActivityViewModel';
    BROAD_CAST_NAMESPACE.SCHEMA_UI_SELECT_NGMODEL_PROPAGATION = 'schema.ui.multi.select.ngModelPropagation';
    BROAD_CAST_NAMESPACE.DASHBOARD_ATTACHMENT_VM_REFRESH = 'refreshDashboardAttachmentViewModalService';
}

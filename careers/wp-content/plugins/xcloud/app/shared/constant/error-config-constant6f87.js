/**
 * Created by TDadam on 12/21/2017.
 */
var ERROR_CONFIGURATION = {};

initializeErrorCodes();
initializeErrorPrefix();
initializeErrorDescription();

function initializeErrorCodes() {
    ERROR_CONFIGURATION.CODES = {
        VALIDATION: {
            EMAIL_EXISTENCE: '9001',
            ZIP_LOOKUP     : '9002'
        }
    };
}

function initializeErrorPrefix() {
    ERROR_CONFIGURATION.PREFIX = {
        VALIDATION : {
            SCHEMA_ERROR         : 'schemaForm.error.'
        }
    };
    ERROR_CONFIGURATION.PREFIX.VALIDATION.UNAME_EMAIL_EXISTENCE = ERROR_CONFIGURATION.PREFIX.VALIDATION.SCHEMA_ERROR + TEMPLATE_CONSTANTS.ELEMENT_ID.UNAME
}

function initializeErrorDescription() {
    /*ERROR_CONFIGURATION.DESCRIPTION = {
        VALIDATION : {
            RESUME: {
                INVALID_CONTENT          : XCLOUD.i18n("Attachment content type is invalid", TEMPLATE_CONSTANTS.FIELD_TYPES.VALIDATION),
                IN_COMPATIBLE_FILE_FORMAT: XCLOUD.i18n("Unsupported file format", TEMPLATE_CONSTANTS.FIELD_TYPES.VALIDATION),
                FILE_SIZE_EXCEED         : XCLOUD.i18n("Exceeded file size", TEMPLATE_CONSTANTS.FIELD_TYPES.VALIDATION)
            },
            FORMS : {
                INCOMPLETE : XCLOUD.i18n("Please complete following forms to continue", TEMPLATE_CONSTANTS.FIELD_TYPES.VALIDATION)
            }
        }
    }*/
}
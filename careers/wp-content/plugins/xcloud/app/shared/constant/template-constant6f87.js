/**
 * Created by TDadam on 12/17/2017.
 */
// Wrapping this in a self-calling function so that functions/variables in here aren't global
var TEMPLATE_CONSTANTS = (function () {
    function TEMPLATE_STRING(str, context) {
        this.str = str;
        this.context = context;
    }

    // This prototype will make "TEMPLATE_CONSTANTS.TITLE.ACTIONS.CLOSE" return a string rather than [object Object]
    TEMPLATE_STRING.prototype.toString = function () {
        return this.str;
    };

    var _FIELD_TYPES = {
        BUTTON    : "buttons",
        DASHBOARD : "dashboard",
        LABELS    : "labels",
        TITLES    : "titles",
        TEXT      : "text",
        VALIDATION: "validation"
    };
    var _PREFIX = {
        SCHEMA_HELP_BLOCK          : 'SchemaStatus',
        ON_BOARDING_FORM_COMPLETION: "onBoardingFormCompletion"
    };
    var _TITLE = {
        ACTIONS           : {
            ACTION           : new TEMPLATE_STRING("Action", _FIELD_TYPES.TEXT),
            CANCEL           : new TEMPLATE_STRING("Cancel", _FIELD_TYPES.BUTTON),
            CLOSE            : new TEMPLATE_STRING("Close", _FIELD_TYPES.BUTTON),
            CLICK_HERE       : new TEMPLATE_STRING("click here.", _FIELD_TYPES.BUTTON),
            CREATE_ONE       : new TEMPLATE_STRING("Create one", _FIELD_TYPES.BUTTON),
            CONTINUE         : new TEMPLATE_STRING("Continue", _FIELD_TYPES.BUTTON),
            SUBMIT           : new TEMPLATE_STRING("Submit", _FIELD_TYPES.BUTTON),
            DELETE           : new TEMPLATE_STRING("Delete", _FIELD_TYPES.TEXT),
            DELETE_ACCOUNT   : new TEMPLATE_STRING("Delete Account", _FIELD_TYPES.BUTTON),
            EDIT             : new TEMPLATE_STRING("Edit", _FIELD_TYPES.BUTTON),
            NO               : new TEMPLATE_STRING("No", _FIELD_TYPES.BUTTON),
            OK               : new TEMPLATE_STRING("OK", _FIELD_TYPES.BUTTON),
            REMOVE_ATTACHMENT: new TEMPLATE_STRING("Remove Attachment", _FIELD_TYPES.TEXT),
            REMOVE_ACTIVITY  : new TEMPLATE_STRING("Remove Activity", _FIELD_TYPES.TEXT),
            RETURN_TO_HOME   : new TEMPLATE_STRING(" Return to Homepage", _FIELD_TYPES.BUTTON),
            SAVE             : new TEMPLATE_STRING("SAVE", _FIELD_TYPES.BUTTON),
            SKIP             : new TEMPLATE_STRING("SKIP", _FIELD_TYPES.BUTTON),
            SIGN_IN          : new TEMPLATE_STRING("Sign In", _FIELD_TYPES.BUTTON),
            TRY_AGAIN        : new TEMPLATE_STRING("Try again", _FIELD_TYPES.BUTTON),
            VIEW_APPLICATIONS: new TEMPLATE_STRING("View Applications", _FIELD_TYPES.BUTTON),
            YES_DELETE       : new TEMPLATE_STRING("Yes, Delete", _FIELD_TYPES.BUTTON),
            START            : new TEMPLATE_STRING("Start", _FIELD_TYPES.BUTTON),
            SUBMIT           : new TEMPLATE_STRING("Submit", _FIELD_TYPES.BUTTON),
            YES              : new TEMPLATE_STRING("Yes", _FIELD_TYPES.BUTTON),
            UPLOAD_FILE      : new TEMPLATE_STRING("Upload File", _FIELD_TYPES.BUTTON),
            DISMISS          : new TEMPLATE_STRING("Dismiss", _FIELD_TYPES.BUTTON),
            LOGIN            : new TEMPLATE_STRING("Login", _FIELD_TYPES.BUTTON),
        },
        FORMS             : {
            BACKGROUND_INFO   : new TEMPLATE_STRING("Background Information", _FIELD_TYPES.TEXT),
            CONFIRMATION      : new TEMPLATE_STRING("Confirmation", _FIELD_TYPES.TEXT),
            CANDIDATE_INFO    : new TEMPLATE_STRING("Candidate Information", _FIELD_TYPES.TEXT),
            CERTIFICATIONS    : new TEMPLATE_STRING("Certifications", _FIELD_TYPES.TEXT),
            CREATE_PASSWORD   : new TEMPLATE_STRING("CREATE PASSWORD", _FIELD_TYPES.TEXT),
            EEO_INFO          : new TEMPLATE_STRING("EEO Information", _FIELD_TYPES.TEXT),
            EDUCATION_HISTORY : new TEMPLATE_STRING("Education History", _FIELD_TYPES.TEXT),
            EMPLOYMENT_HISTORY: new TEMPLATE_STRING("Employment History", _FIELD_TYPES.TEXT),
            FORGOT_PASSWORD   : new TEMPLATE_STRING("Forgot Password", _FIELD_TYPES.TEXT),
            ON_BOARDING       : new TEMPLATE_STRING("Onboarding", _FIELD_TYPES.TEXT),
            PROFILE_DOWNLOAD  : new TEMPLATE_STRING("Profile Download", _FIELD_TYPES.TEXT),
            RESET_PASSWORD    : new TEMPLATE_STRING("Reset Password", _FIELD_TYPES.TEXT),
            SCREENING         : new TEMPLATE_STRING("Screening", _FIELD_TYPES.TEXT)
        },
        LABELS            : {
            CONFIRMATION                  : new TEMPLATE_STRING("Do you want to close this form?", _FIELD_TYPES.TITLES),
            DELETE_YOUR_ACCOUNT           : new TEMPLATE_STRING("Delete Your Account?", _FIELD_TYPES.TITLES),
            DUE_TITLE                     : new TEMPLATE_STRING("Due by", _FIELD_TYPES.TITLES),
            DO_NOT_HAVE_PROFILE           : new TEMPLATE_STRING("Don't have a talent profile?", _FIELD_TYPES.TITLES),
            FIELDS_ACCESSIBILITY          : {
                DATE_FIELD_YYYY_MM_DD: new TEMPLATE_STRING("Please enter date in YYYY-DD-MM Format", _FIELD_TYPES.TEXT)
            },
            OR                            : new TEMPLATE_STRING("OR", _FIELD_TYPES.TITLES),
            PROGRESS_SAVE                 : new TEMPLATE_STRING("Your progress will not be saved.", _FIELD_TYPES.TITLES),
            IMPORTANT                     : new TEMPLATE_STRING("IMPORTANT !", _FIELD_TYPES.TITLES),
            FINAL_SAVE_ALERT              : new TEMPLATE_STRING("This is your last form. If you submit it now, you will not be able to edit it or any of your previous forms.", _FIELD_TYPES.TITLES),
            OF                            : new TEMPLATE_STRING("of", _FIELD_TYPES.TITLES),
            PAGE                          : new TEMPLATE_STRING("Page", _FIELD_TYPES.TITLES),
            SAVING                        : new TEMPLATE_STRING("Saving", _FIELD_TYPES.TITLES),
            PASSWORD                      : new TEMPLATE_STRING("Password", _FIELD_TYPES.LABELS),
            USER_NAME_EMAIL               : new TEMPLATE_STRING("User Name/Email", _FIELD_TYPES.LABELS),
            EMAIL_ADDRESS                 : new TEMPLATE_STRING("Email address", _FIELD_TYPES.LABELS),
            ALLOW_RESUME_DASHBOARD        : new TEMPLATE_STRING("Should we automatically update your profile using this resume?", _FIELD_TYPES.LABELS),
            YES_PARSE                     : new TEMPLATE_STRING("Yes", _FIELD_TYPES.TITLES),
            NO_PARSE                      : new TEMPLATE_STRING("No", _FIELD_TYPES.TITLES),
            DELETE_ATTACHMENT_CONFIRMATION: new TEMPLATE_STRING("Are you sure you want to delete this attachment?", _FIELD_TYPES.TITLES),
            PREFERRED_JOB_TITLE           : new TEMPLATE_STRING("Preferred Job Title", _FIELD_TYPES.LABELS),
            ENTER_JOB_TITLE               : new TEMPLATE_STRING("Enter Job Title(s)", _FIELD_TYPES.LABELS),
            PREFERRED_LOCATIONS           : new TEMPLATE_STRING("Preferred Locations", _FIELD_TYPES.LABELS),
            ENTER_PREFERRED_LOCATIONS     : new TEMPLATE_STRING("Enter Location(s)", _FIELD_TYPES.LABELS),
            AREA_OF_INTEREST              : new TEMPLATE_STRING("Area of Interest", _FIELD_TYPES.LABELS),
            ENTER_AREA_OF_INTEREST        : new TEMPLATE_STRING("Enter Area(s) of Interest", _FIELD_TYPES.LABELS)
        },
        BANNER            : {
            AND                                   : new TEMPLATE_STRING("and", _FIELD_TYPES.TEXT),
            PREFERENCE_NOTIFICATION_TEXT          : new TEMPLATE_STRING("Please provide Job Title, Area of Interest and Location preferences to enhance our automated job matching.", _FIELD_TYPES.TEXT),
            PREFERENCE_NOTIFICATION_TEXT_2        : new TEMPLATE_STRING("Type your preference and Hit Enter to record entries.", _FIELD_TYPES.TEXT),
            APPLY_ASSESSMENT_HEADER               : new TEMPLATE_STRING("You need to complete the following assessments as part of your application. You can also find these assessments in the To-Do section of your profile.", _FIELD_TYPES.TEXT),
            DOWNLOADING                           : new TEMPLATE_STRING("Downloading", _FIELD_TYPES.TEXT),
            DOWNLOAD_INSTRUCTION_CSV              : new TEMPLATE_STRING("If your profile does not start downloading within 10 seconds,", _FIELD_TYPES.TEXT),
            DOWNLOAD_INSTRUCTION_CSV_FILE_TYPE    : new TEMPLATE_STRING("profiles are downloaded as CSV files.", _FIELD_TYPES.TEXT),
            DELETE_ACCOUNT_INFORMATION            : new TEMPLATE_STRING("If you proceed, your account with all your saved information will be erased. This action cannot be undone.", _FIELD_TYPES.TEXT),
            DELETE_ACCOUNT_CAPTCHA                : new TEMPLATE_STRING("Type the word DELETE in upper case to confirm.", _FIELD_TYPES.TEXT),
            DELETE_ACCOUNT_CONFIRMATION_TEXT      : new TEMPLATE_STRING("Your account has been deleted. Click OK to continue.", _FIELD_TYPES.TEXT),
            NEW_USER_APPLY_THANK_YOU_MESSAGE      : new TEMPLATE_STRING("Welcome to Candidate Experience. Thank you for your application! Please check your email for an activation link to see the status of your application.", _FIELD_TYPES.TEXT),
            ON_BOARDING_SUB_HEADER                : new TEMPLATE_STRING("PLEASE NOTE: After starting a form, you must complete it. You will not be able to save your progress or come back to finish it. All incomplete form data will be deleted.", _FIELD_TYPES.TEXT),
            RETURNING_USER_APPLY_THANK_YOU_MESSAGE: new TEMPLATE_STRING("Your application was received. A recruiter will contact you if your qualifications and experience align with an open position", _FIELD_TYPES.TEXT),
            RESET_PASSWORD_NON_COMPLIANCE         : new TEMPLATE_STRING("Sorry, we need a password created to show that you are a human.", _FIELD_TYPES.TEXT),
            GDPR_NON_COMPLIANCE                   : new TEMPLATE_STRING("in accordance with our Privacy Policy we need you to accept this terms to allow us to maintain your profile.", _FIELD_TYPES.TEXT),
            SIGNATURE_PLACEHOLDER                 : new TEMPLATE_STRING("Please type your full name here as per your Profile", _FIELD_TYPES.TEXT),
            TERMS_POLICY_LEFT_TITLE_START         : new TEMPLATE_STRING("Yes, I agree to the", _FIELD_TYPES.TEXT),
            AND                                   : new TEMPLATE_STRING("and", _FIELD_TYPES.TEXT),
            SUBSCRIPTION_TITLE_START              : new TEMPLATE_STRING("I would like to be contacted by", _FIELD_TYPES.TEXT),
            SUBSCRIPTION_TITLE_END                : new TEMPLATE_STRING("and know I can unsubscribe at any time.", _FIELD_TYPES.TEXT),
            TERMS_OF_USE                          : new TEMPLATE_STRING("Terms of Use", _FIELD_TYPES.TEXT),
            PRIVACY_POLICY                        : new TEMPLATE_STRING("Privacy Policy", _FIELD_TYPES.TEXT),
            REQUIRED_FIELD                        : new TEMPLATE_STRING("* = Required Fields", _FIELD_TYPES.TEXT),
            SCHOOL_DETAILS                        : new TEMPLATE_STRING("School Details", _FIELD_TYPES.TEXT),
            JOB_DETAILS                           : new TEMPLATE_STRING("Job Details", _FIELD_TYPES.TEXT),
            CERTIFICATE_LICENSE_DETAILS           : new TEMPLATE_STRING("Certificate / License Details", _FIELD_TYPES.TEXT),
            ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE   : new TEMPLATE_STRING("Are you sure you want to delete the:", _FIELD_TYPES.TEXT),
            HISTORY                               : new TEMPLATE_STRING("history?", _FIELD_TYPES.TEXT),
            PASSWORD_RESET_HAS_BEEN_SUCCESSFUL    : new TEMPLATE_STRING("Password reset has been successful.", _FIELD_TYPES.TEXT)
        },
        CANDIDATE_ACTIVITY: {
            PREFERENCE_ALERT_TEXT : new TEMPLATE_STRING("Keep your Profile Preferences current to enhance automated job matching.", _FIELD_TYPES.TEXT),
            PREFERENCE_LINK_TEXT  : new TEMPLATE_STRING("Manage Preferences", _FIELD_TYPES.TEXT),
            NO_RECENT_ACTIVITY    : new TEMPLATE_STRING("There are no recent activity to show.", _FIELD_TYPES.TEXT),
            NO_ACTIVITY_FOR_FILTER: new TEMPLATE_STRING("No activities for this filter.", _FIELD_TYPES.TEXT),
            NO_RECENT_NOTIFICATION: new TEMPLATE_STRING("There are no recent notification to show.", _FIELD_TYPES.TEXT),
            GO_TO                 : new TEMPLATE_STRING("go to", _FIELD_TYPES.TEXT),
            MY_PROFILE            : new TEMPLATE_STRING("My Profile", _FIELD_TYPES.TEXT),
            SHOW_ACCOUNT_LINK     : window.location.pathname.indexOf('/profile/') === -1,
            RECENT                : new TEMPLATE_STRING("recent", _FIELD_TYPES.DASHBOARD),
            RECENT_ACTIVITY       : new TEMPLATE_STRING("recent activity", _FIELD_TYPES.DASHBOARD),
            ACTION                : new TEMPLATE_STRING("action", _FIELD_TYPES.DASHBOARD),
            REMINDER              : new TEMPLATE_STRING("reminder", _FIELD_TYPES.DASHBOARD),
            SUMMARY               : new TEMPLATE_STRING("summary", _FIELD_TYPES.DASHBOARD),
            NOTIFICATION          : new TEMPLATE_STRING("notification", _FIELD_TYPES.DASHBOARD),
            STATUS                : new TEMPLATE_STRING("Status", _FIELD_TYPES.DASHBOARD),
            SUGGESTION            : new TEMPLATE_STRING("suggestion", _FIELD_TYPES.DASHBOARD),
        },
        HEADER            : {
            GDPR_MIGRATION           : new TEMPLATE_STRING("We Have Updated our Terms of Use and Privacy Policy", _FIELD_TYPES.TEXT),
            REVIEW_AND_COMPLETE      : new TEMPLATE_STRING("Please review and complete", _FIELD_TYPES.TEXT),
            THANK_YOU_ACKNOWLEDGEMENT: new TEMPLATE_STRING("Thank You for Your Acknowledgement.", _FIELD_TYPES.TEXT)
        }
    };
    var _VALIDATION = {
        PREVENT_LOGIN            : new TEMPLATE_STRING("Please complete your application to login.", _FIELD_TYPES.VALIDATION),
        GDPR_UPDATE_FAILURE      : new TEMPLATE_STRING("Something went wrong! Failed to update preferences.", _FIELD_TYPES.VALIDATION),
        INCOMPLETE               : new TEMPLATE_STRING("Please complete following forms to continue", _FIELD_TYPES.VALIDATION),
        INVALID_CONTENT          : new TEMPLATE_STRING("Attachment content type is invalid", _FIELD_TYPES.VALIDATION),
        IN_COMPATIBLE_FILE_FORMAT: new TEMPLATE_STRING("Unsupported file format", _FIELD_TYPES.VALIDATION),
        FILE_SIZE_EXCEED         : new TEMPLATE_STRING("Exceeded file size", _FIELD_TYPES.VALIDATION),
        DELETE_MISMATCH          : new TEMPLATE_STRING("Entered keyword does not match the word \"DELETE\" in upper case.", _FIELD_TYPES.VALIDATION)
    };

    if (_XC_CONFIG.context.applyThankYouMessageForNewUser && _XC_CONFIG.context.applyThankYouMessageForNewUser.length > 0) {
        _TITLE.BANNER.NEW_USER_APPLY_THANK_YOU_MESSAGE = _XC_CONFIG.context.applyThankYouMessageForNewUser;
    }

    if (_XC_CONFIG.context.applyThankYouMessageForReturningUser && _XC_CONFIG.context.applyThankYouMessageForReturningUser.length > 0) {
        _TITLE.BANNER.RETURNING_USER_APPLY_THANK_YOU_MESSAGE = _XC_CONFIG.context.applyThankYouMessageForReturningUser;
    }

    if (_XC_CONFIG.context.applyAssessmentHeader && _XC_CONFIG.context.applyAssessmentHeader.length > 0) {
        _TITLE.BANNER.APPLY_ASSESSMENT_HEADER = _XC_CONFIG.context.applyAssessmentHeader;
    }

    // This is the object the browser will see
    return {
        FIELD_TYPES: _FIELD_TYPES,
        PREFIX     : _PREFIX,
        TITLE      : _TITLE,
        VALIDATION : _VALIDATION,
        RUNTIME    : {}
    };
})();
window.TEMPLATE_CONSTANTS = TEMPLATE_CONSTANTS;

initializeReadOnlyProperties();
initializeElementConstant();

function initializeReadOnlyProperties() {

    // Org name should never need to be translated
    //_XC_CONFIG.org_name = XCLOUD.i18n(_XC_CONFIG.org_name, TEMPLATE_CONSTANTS.FIELD_TYPES.TEXT);

    for (var titles in TEMPLATE_CONSTANTS.TITLE) {
        for (var section in TEMPLATE_CONSTANTS.TITLE[titles]) {
            TEMPLATE_CONSTANTS.TITLE[titles][section].str = XCLOUD.i18n(TEMPLATE_CONSTANTS.TITLE[titles][section].str, TEMPLATE_CONSTANTS.TITLE[titles][section].context);
        }
    }
    for (var validations in TEMPLATE_CONSTANTS.VALIDATION) {
        TEMPLATE_CONSTANTS.VALIDATION[validations].str = XCLOUD.i18n(TEMPLATE_CONSTANTS.VALIDATION[validations].str, TEMPLATE_CONSTANTS.VALIDATION[validations].context);
    }

    if (_XC_CONFIG.login_modal.header === '') {
        _XC_CONFIG.login_modal.header = TEMPLATE_CONSTANTS.TITLE.ACTIONS.SIGN_IN.str;
    }

    if (_XC_CONFIG.login_modal.signInCaption === '') {
        _XC_CONFIG.login_modal.signInCaption = TEMPLATE_CONSTANTS.TITLE.ACTIONS.SIGN_IN.str;
    }

    if (_XC_CONFIG.login_modal.separator === '') {
        _XC_CONFIG.login_modal.separator = TEMPLATE_CONSTANTS.TITLE.LABELS.OR.str;
    }

    _XC_CONFIG.login_modal.passwordInModal = (_XC_CONFIG.login_modal.disabled === false);

    _XC_CONFIG.login_modal.header = XCLOUD.i18n(_XC_CONFIG.login_modal.header, TEMPLATE_CONSTANTS.FIELD_TYPES.TITLES);
    _XC_CONFIG.login_modal.signInCaption = XCLOUD.i18n(_XC_CONFIG.login_modal.signInCaption, TEMPLATE_CONSTANTS.FIELD_TYPES.BUTTON);
    _XC_CONFIG.login_modal.subHeader = XCLOUD.i18n(_XC_CONFIG.login_modal.subHeader, TEMPLATE_CONSTANTS.FIELD_TYPES.TITLES);
    if (_XC_CONFIG.context.onBoarding) {
        if (_XC_CONFIG.context.onBoarding.subHeader && _XC_CONFIG.context.onBoarding.subHeader.length > 0) {
            TEMPLATE_CONSTANTS.TITLE.BANNER.ON_BOARDING_SUB_HEADER = _XC_CONFIG.context.onBoarding.subHeader;
        }
        if (_XC_CONFIG.context.onBoarding.header && _XC_CONFIG.context.onBoarding.header.length > 0) {
            TEMPLATE_CONSTANTS.TITLE.BANNER.ON_BOARDING_HEADER = _XC_CONFIG.context.onBoarding.header;
        }
    }
}

function initializeElementConstant() {
    TEMPLATE_CONSTANTS.ELEMENT_ID = {
        UNAME              : 'uname',
        UNAME_LOGIN_LINK_ID: 'unameLoginLink'
    };

    TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_POLICY_TITLE = TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_POLICY_LEFT_TITLE_START.str;
    TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_POLICY_TITLE += " <u><a  href =" + _XC_CONFIG.copyright.TandC_url + " target=\"_blank\">" + TEMPLATE_CONSTANTS.TITLE.BANNER.TERMS_OF_USE.str + " </a> </u>" + TEMPLATE_CONSTANTS.TITLE.BANNER.AND.str + " <u><a href =" + _XC_CONFIG.copyright.privacyPolicyUrl + " target=\"_blank\">" + TEMPLATE_CONSTANTS.TITLE.BANNER.PRIVACY_POLICY.str + "</a></u>";

    TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE = TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE_START.str;
    TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE += " <b>" + _XC_CONFIG.org_name + "</b> ";
    TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE += TEMPLATE_CONSTANTS.TITLE.BANNER.SUBSCRIPTION_TITLE_END.str;

    if (typeof(XCLOUD) !== 'undefined') {
        if (typeof(XCLOUD.apply_filter) === 'function') {
            // Apply filter
            TEMPLATE_CONSTANTS = XCLOUD.apply_filter('xcc_template_constant', TEMPLATE_CONSTANTS, _XC_CONFIG);

            /*Add filter can be used in wordpress script as below
            XCLOUD.add_filter('xcc_template_constant', function (tpl_const, xcc_config) { // code goes here.... });*/
        }
    }
}

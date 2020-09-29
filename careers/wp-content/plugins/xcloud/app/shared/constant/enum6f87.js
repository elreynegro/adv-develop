/**
 * Created by TDadam on 4/27/2018.
 */
var E_MODAL_POPUP_SIZE = {
    LARGE: 'lg',
    NONE : '',
    SMALL: 'sm'
};

var E_COMMUNICATION_TYPE = {
    MARKETING: "marketing",
    SYSTEM   : "system"
};

var EBOOLEAN_TYPE = {
    TRUE : 't',
    FALSE: 'f'
};

var E_WORK_FLOW = {
    APPLY          : 3,
    APPLY_LCP      : 4,
    ALERT_LCP      : 6,
    CREATE_PASSWORD: 0,
    DASHBOARD      : 2,
    JOIN_LCP       : 5,
    MODIFY_PASSWORD: 1,
    MICROSITE_LCP  : 7,
    NONE           : -1
};
var ANGULAR_SCHEMA_FORMATTER = {
    LOOK_UP: {
        DEFAULT  : {
            LABEL_FIELD: "name",
            SOURCE     : "titleMap",
            VALUE_FIELD: "value"
        },
        DROP_DOWN: {
            LABEL_FIELD: "name",
            SOURCE     : "titleMap",
            VALUE_FIELD: "value"
        },
        TYPES    : {
            SELECT         : "select",
            UI_MULTI_SELECT: "uimultiselect",
            UI_SELECT      : "uiuiselect"
        },
        UI_SELECT: {
            LABEL_FIELD: "label",
            SOURCE     : "items",
            VALUE_FIELD: "value"
        }
    }
};


var E_BOOTSTRAP_ALERT = {
  CLASS : {
      DANGER : "alert alert-danger",
      INFO   : "alert alert-info",
      SUCCESS: "alert alert-success",
      WARNING: "alert alert-warning"
  }
};

var E_TEMPLATE_FLAG_TYPE = {
    PROFILE       : 'profile',
    RESET_PASSWORD: 'reset'
};

/**
 * Created by TDadam on 12/21/2017.
 */
var STORAGE_KEY = {};
var STORAGE_TYPE_ENUM = {
    IN_MEMORY: 0,
    LOCAL    : 1,
    SESSION  : 2
};

initializeStorageKey();

function initializeStorageKey() {
    STORAGE_KEY.SCHEMA_LOGIN_REDIRECT = 'schemaLoginRedirect'
}

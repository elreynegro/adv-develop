/**
 * Created by TDadam on 12/17/2017.
 */

/**
 *@name Parser Helper
 * @type {{isStringEmpty: Parser.isStringEmpty}}
 */
var PARSER_HELPER = {
    /**
     *
     * @param object
     * @returns {boolean} returns true in case string is empty
     */
    isStringEmpty : function (object) {
        return (object === undefined || object === null || object.length === 0);
    }
};
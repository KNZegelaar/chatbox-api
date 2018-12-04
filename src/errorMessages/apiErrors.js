const apiError = require("./apiError.js");

module.exports = class apiErrors {
    /**
     * Similar to 403 Forbidden,
     * but specifically for use when authentication is required and has failed or has not yet been provided.
     * The response must include a X-Access-Token header field containing a challenge applicable to the requested resource.
     * @returns {Error} Not authorized 401.
     */
    static notAuthorised(){
        return new apiError("Not authorised", 401);
    }

    /**
     * Indicates that the request could not be processed because of conflict in the request
     * @returns {apiErrors} Conflict 409.
     */
    static conflict() {
        return new apiError("Conflict", 409);
    }

    /**
     * The server cannot or will not process the request due to an apparent client apiErrors
     * e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).
     * @returns {apiErrors} Bad Request 400.
     */
    static badRequest() {
        return new apiError("Bad Request", 400);
    }

    /**
     * A generic apiErrors message,
     * given when an unexpected condition was encountered and no more specific message is suitable.
     * @returns {apiErrors}
     */
    static internalServerError() {
        return new apiError("Internal Server Error", 500);
    }

    /**
     * The requested resource could not be found but may be available in the future.
     * Subsequent requests by the client are permissible.
     * @returns {apiErrors} Not Found, 404
     */
    static notFound() {
        return new apiError("Not Found", 404);
    }

    /**
     * The 520 apiErrors is used as a "catch-all response for when the origin server returns something unexpected",
     * listing connection resets, large headers, and empty or invalid responses as common triggers.
     * @returns {apiErrors} Unknown apiErrors, 520
     */
    static unknownError() {
        return new apiError("Unknown Error", 520);
    }

    /**
     * Unofficial HTTP Response.
     * This response is self reclaimed.
     * @returns {apiErrors} User Exists, 420
     */
    static userExists() {
        return new apiError("User Exists", 420);
    }


    static get wrongRequestBodyProperties(){
        return new apiError("One or more properties in the request body are missing or are invalid.", 412);
    }

    static notFound(objectName){
        return new apiError(`Not found. (${objectName} does not exist)`, 404);
    }

    static other(message, code = 500){
        return new apiError(message, code);
    }
}
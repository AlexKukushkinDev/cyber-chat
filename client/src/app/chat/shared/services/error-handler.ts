import { throwError } from 'rxjs';

/**
 * Check if str is JSON
 * @param {string} rawString
 */
function isStringifiedJSON(rawString) {
    try {
        JSON.parse(rawString);
    } catch (e) {
        return false;
    }
    
    return true;
}
export function errorHandler(rawError) {
    let error = null;

    let defaultError = { 
        message: 'Internal Server Error'
    };

    if (rawError && rawError.message == "Timeout has occurred") {
        error =  {
            message: `TMS Server not responding.<br>Please contact your System Administrator.`
        }
        return throwError(error);
    }

    if (!rawError || (rawError && !rawError._body && !rawError.error)) {
        return throwError(defaultError);   
    }

    if (rawError && rawError._body) {
        error = isStringifiedJSON(rawError._body) ? rawError.json() : defaultError;
        if (rawError.status) {
            error.status = rawError.status;
        }
    }

    if (rawError && rawError.error && (typeof rawError.error === 'string' || rawError.error instanceof String)) {
        error = rawError.error;

        if (error.includes("Upload File contains no data")) {
            error = {
                message : "Upload File contains no data"
            }
        }
    } else if (rawError && rawError.statusText == "Unknown Error") {
        error = {
            message : "Authentication Failed"
        }
    } else if (rawError && rawError.error && rawError.error.message) {
        error = rawError.error;
    }

    return throwError(error);
}


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//handle email or username duplicates
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue);
    return {
        field,
        errorType: "duplication",
        message: `${field} already exist.`,
        status: 409 //conflicts
    };
};
//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err) => {
    let errors = Object.values(err.errors).map((el) => el.message);
    let fields = Object.values(err.errors).map((el) => el.path);
    if (errors.length > 1) {
        const formattedErrors = errors.join(' ');
        return { messages: formattedErrors, field: fields, status: 403, errorType: "validation", message: `Missing! ${fields}` }; // Validation error
    }
    else {
        return { messages: errors, field: fields, status: 403, errorType: "validation", message: `Missing! ${fields}` }; // Validation error
    }
};
const MongoDBErrorController = (err) => {
    try {
        if (err.name === 'ValidationError')
            return err = handleValidationError(err);
        if (err.code && err.code == 11000)
            return err = handleDuplicateKeyError(err);
    }
    catch (err) {
        return {
            field: "unknown",
            message: "Oops, Error controller unable to detect error",
            status: 500
        };
    }
};
exports.default = MongoDBErrorController;
//# sourceMappingURL=MongoDBErrorController.js.map
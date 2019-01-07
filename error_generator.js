//Boilerplate for the url based errors
var generateErrorObj = (error) => {
    return {
        status: "ERROR",
        errorMessage: error
    };
}

module.exports = {
    generateErrorObj
}
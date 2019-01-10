const axios = require('axios');

const error_generator = require('../error_generator');

const defaulMessage = "This is a boring number.";

var plusEncodeText = (someTextWithSpaces) => {
    return someTextWithSpaces.split(" ").join('+');
}

var getNumberFacts = (req, res) => {
    axios.get(`http://numbersapi.com/${req.query.data}/?json&default=${defaulMessage}`)//${plusEncodeText(req.query.data)})
    .then((response) => {
        res.send(response.data);
    })
    .catch((errorMessage) => {
        console.log(errorMessage.message);
        res.send(error_generator.generateErrorObj(`Only numeric values allowed.`))
    })
}

module.exports = {
    getNumberFacts
}
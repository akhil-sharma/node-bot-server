const axios           =                 require('axios');
const error_generator =                 require('../error_generator');

var getJoke = (req, res) => {
    axios.get(`https://official-joke-api.appspot.com/random_joke`)
    .then((response) => {
        console.log(response.data);
        res.send({
            setup: response.data.setup,
            punchline: response.data.punchline
        });
    })
    .catch((errorMessage) => {
        console.log(errorMessage.message);
        res.send(error_generator.generateErrorObj(`${errorMessage.message}`));
    })
}

module.exports = {
    getJoke
}
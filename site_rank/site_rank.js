const axios = require('axios');

//Conditional require for compatibility with Heroku
var webfinery_api_key;
if (!(webfinery_api_key = process.env.webfinery_api_key)) {
    webfinery_api_key = require('../api_keys').webfinery_api_key;
}

const error_generator = require('../error_generator');

var getSiteRank = (req, res) => {
    
    axios.get(`https://api.webfinery.com/ranks?domain=${req.query.data}&key=${webfinery_api_key}`)
    .then((response) => {
        if(response.data.rank !== -1){
            console.log(response.data);
            res.send(response.data);
            //console.log("Invalid domain");
        }else{
            throw new Error('Unable to find the domain.')
        }
        
    })
    .catch((errorMessage) => {
        console.log(errorMessage.message);
        res.send(error_generator.generateErrorObj(errorMessage.message));
    })
}

module.exports = {
    getSiteRank
}
const axios = require('axios');

//Conditional require for compatibility with Heroku
var geocode_api_key;
if (!(geocode_api_key = process.env.geocode_api_key)) {
    geocode_api_key = require('../api_keys').geocode_api_key;
}

var dark_sky_api_key;
if (!(dark_sky_api_key = process.env.dark_sky_api_key)) {
    dark_sky_api_key = require('../api_keys').dark_sky_api_key;
}

const error_generator = require('../error_generator');

var getWeatherData = (req, res) => {
    let encodedAddress = encodeURIComponent(req.query.data);
    var formattedAddress = "";

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${geocode_api_key}`)
    .then((response) => {
        if(response.data.status === 'ZERO_RESULTS'){
            throw new Error('Unable to find the address.');
        }
        var latitude = response.data.results[0].geometry.location.lat;
        var longitude = response.data.results[0].geometry.location.lng;
        var weatherURL = `https://api.darksky.net/forecast/${dark_sky_api_key}/${latitude},${longitude}?units=si`;
        formattedAddress = response.data.results[0].formatted_address;
        console.log(formattedAddress);
        return axios.get(weatherURL);
    }).then((response)=>{
        var temperature = response.data.currently.temperature;
        var apparentTemperature= response.data.currently.apparentTemperature;
        var summary = response.data.currently.summary;
        console.log(`It's currently ${temperature}°C. Although, it feels like ${apparentTemperature}°C. ${summary}.`);
        
        res.send({
            status: "SUCCESS",
            data:[
                {temperature,
                apparentTemperature,
                summary,
                formattedAddress
            }
            ]
        });
    })
    .catch((errorMessage)=>{
        if(errorMessage.code === 'ENOTFOUND'){
            console.log('Unable to connect to API servers.');
            res.send(error_generator.generateErrorObj("Unable to connect to API servers."));
        }else{
            console.log(errorMessage.message);
            res.send(error_generator.generateErrorObj(errorMessage.message));
        }
    });
}

module.exports = {
    getWeatherData
}
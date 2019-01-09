const axios = require('axios');

//Conditional require for compatibility with Heroku
var movies_api_key;
if (!(movies_api_key = process.env.movies_api_key)) {
    movies_api_key = require('../api_keys').movies_api_key;
}

var odmb_key;
if (!(odmb_key = process.env.odmb_key)) {
    odmb_key = require('../api_keys').odmb_key;
}

const error_generator = require('../error_generator');

var plusEncodeText = (someTextWithSpaces) => {
    return someTextWithSpaces.split(" ").join('+');
}

function retrieveMovieIDArray(moviesArray){
    let tempArray = [];
    for (let index in moviesArray){
        tempArray.push(moviesArray[index].imdb_id_long);
    }
    return tempArray;
}


var getMovieRecommendations = (req, res) => {

    let encodedText = plusEncodeText(req.query.data);
    var movieDetailList;
    let movies = [];
    let promises = [];

    axios.get(`https://api.whatismymovie.com/1.0/?api_key=${movies_api_key}&text=${encodedText}`)
    .then((response) => {
        if (response.data.length === 0){
            throw new Error("Unable to find relevant movies.");
        }
        console.log("RESPONSE:", response.data);
        let movieIDList = response.data;
        //Iterate through the array to retrieve the idmb id. long
        let odmbInputArray = retrieveMovieIDArray(movieIDList);
        console.log("INPUT ARRAY", odmbInputArray);

        for (index in odmbInputArray){
            currentMovieID = odmbInputArray[index];
            promises.push(axios.get(`http://www.omdbapi.com/?apikey=${odmb_key}&i=${currentMovieID}`));
        }
        return axios.all(promises);
    })
    .then(axios.spread((...args) => {
        //console.log(args.data);
        for (let index in args){
            console.log(args[index].data);//console.log(arguments[index].data);
            movies.push({
                title:  args[index].data.Title,
                year:   args[index].data.Year,
                genere: args[index].data.Genere,
                plot:   args[index].data.Plot,
                poster: args[index].data.Poster,
                rating: args[index].data.imdbRating
            });
        }
        console.log(movies);
        res.send(movies);
    }))
    .catch((errorMessage)=>{
        console.log(`ERROR in Movies: ${errorMessage.message}`);
        res.send(error_generator.generateErrorObj(`ERROR in Movies: ${errorMessage.message}`));
    });
}

// var getMovieRecommendations = (req, res) => {

//     let encodedText = plusEncodeText(req.query.data);
//     var movieDetailList;

//     axios.get(`https://api.whatismymovie.com/1.0/?api_key=${movies_api_key}&text=${encodedText}`)
//     .then((response) => {
//         if (response.data.length === 0){
//             throw new Error("Unable to find relevant movies.");
//         }
//         console.log("RESPONSE:", response.data);
//         let movieIDList = response.data;
//         //Iterate through the array to retrieve the idmb id. long
//         let odmbInputArray = retrieveMovieIDArray(movieIDList);
//         console.log("INPUT ARRAY", odmbInputArray);
//         getMovieDetailList(odmbInputArray, (movieDetails) => {
//             movieDetailList = movieDetails;
//             console.log("movieDetailList:", movieDetailList)
//             if (movieDetailList){
//                 res.send(movieDetailList);
//             }else{
//                 throw new Error("Unable to find relevant movie details.");
//             }
//         });
//     })
//     .catch((errorMessage)=>{
//         console.log(`ERROR in Movies: ${errorMessage.message}`);
//         res.send(error_generator.generateErrorObj(`ERROR in Movies: ${errorMessage.message}`));
//     });
// }

// function getMovieDetailList(movieIDList, callback){
//     let movies = [];
//     let promises = [];
//     for (index in movieIDList){
//         currentMovieID = movieIDList[index];
//         promises.push(axios.get(`http://www.omdbapi.com/?apikey=${odmb_key}&i=${currentMovieID}`));
//     }

//     axios.all(promises)
//     .then(axios.spread((arguments)=>{
//         for (let index in arguments){
//             console.log(arguments.data);//console.log(arguments[index].data);
//             movies.push({
//                 title:  arguments.data.Title,
//                 year:   arguments.data.Year,
//                 genere: arguments.data.Genere,
//                 plot:   arguments.data.Plot,
//                 poster: arguments.data.Poster,
//                 rating: arguments.data.imdbRating
//             });
//         }
//         callback(movies);        
//     }))
//     .catch((errorMessage) => {
//         console.log(`Error in getMovieDetails: ${errorMessage.message}`);
//     });
// }

module.exports = {
    getMovieRecommendations
}
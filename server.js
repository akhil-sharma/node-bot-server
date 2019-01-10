const express         =                 require('express');
const fs              =                 require('fs');

const weather         =                 require('./weather/weather');
const movies          =                 require('./movies/movies');
const number_facts    =                 require('./number_facts/number_facts');
const site_rank       =                 require('./site_rank/site_rank');

const error_generator =                 require('./error_generator');

//Making sure it works on Heroku as well as the local machine
const port = process.env.PORT || 3000;

var app = express();

//Middleware for logging incoming requests
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url} ${req.query.data}\n`;
    fs.appendFileSync('server.log', log);
    next();
});

//Handle the incoming requests
app.get('/', (req, res)=>{
    res.send(error_generator.generateErrorObj("Invalid Request"));
});

//Handle the weather related requests
app.get('/weather', (req, res) => {
    if (data = req.query.data){
        weather.getWeatherData(req, res);
    }else{
        res.send(error_generator.generateErrorObj("Missing parameter: data"));
    }
});

//Handle the movies related requests
app.get('/movies', (req, res) => {
    if (data = req.query.data){
        movies.getMovieRecommendations(req, res);
    }else{
        res.send(error_generator.generateErrorObj("Missing parameter: data"))
    }
});

//Handling number fact related queries
app.get('/numbers', (req, res) => {
    if (data = req.query.data){
       number_facts.getNumberFacts(req, res);
    }else{
        res.send(error_generator.generateErrorObj("Missing parameter: data"))
    }
});

//Handling site rank related queries
app.get('/rank', (req, res) => {
    if (data = req.query.data){
       console.log(data);
       site_rank.getSiteRank(req, res);
    }else{
        res.send(error_generator.generateErrorObj("Missing parameter: data"))
    }
});

//Handle the stocks related requests
app.get('/stocks', (req, res) => {
    if (data = req.query.data){
        console.log(`Site under maintainance.`);
    }else{
        res.send(error_generator.generateErrorObj("Missing parameter: data"))
    }
});

//Start listening on the designated port
app.listen(port, ()=>{
    console.log(`Server is now set up on port ${port}`);
});


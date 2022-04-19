import { coinFlip, coinFlips, countFlips, flipACoin } from "./modules/coin.mjs"
// Require Express.js
const express = require('express');
const app = express();

// Start an app server
const server = app.listen(5000, () => {
    console.log('App listening on port %PORT%' .replace('%PORT%' ,5000));
    
});
// Default response for any other request 

app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    //res.send('Hello World')
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage);
})

app.get('/app/flip/', (req, res) => {
    var flip = coinFlip();
    res.status(200).json({ "flip" : flip})
});

app.get('/app/flips/:number', (req, res) => {
    var flips = coinFlips(req.params.number);
    var stats = countFlips(flips);
    res.status(200).json({"raw" : flips, "summary" : stats});
});

app.get('/app/flip/call/heads', (req, res) => {
    const head = flipACoin('heads');
    res.status(200).json(head);
});

app.get('/app/flip/call/tails', (req, res) => {
    const tail = flipACoin('tails');
    res.status(200).json(tail);
});

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND');
});

app.listen(5000, () => console.log("Can we make this work..."))
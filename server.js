// Require Express.js
const express = require('express');
const app = express();

const arg = require('minimist')(process.argv.slice(2))
arg[port]
const PORT_ = args.port || 5000

// Start an app server
const server = app.listen(PORT_, () => {
    console.log('App listening on port %PORT%' .replace('%PORT%' ,PORT_));
    
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
    res.json({ "flip" : flip})
});

app.get('/app/flips/:number', (req, res) => {
    var flips = coinFlips(req.params.number);
    var stats = countFlips(flips);
    res.json({"raw" : flips, "summary" : stats});
});

app.get('/app/flip/call/heads', (req, res) => {
    const head = flipACoin('heads');
    res.json(head);
});

app.get('/app/flip/call/tails', (req, res) => {
    const tail = flipACoin('tails');
    res.json(tail);
});

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND ENDPOINT');
    res.type("text/plain")
});

//app.listen(5000, () => console.log("Can we make this work..."))

function coinFlip() {
  var num = Math.floor(Math.random()*100);
  if (num % 2 == 0) {
    return "heads"
  } 
  else {
    return "tails"
  }
}
  
function coinFlips(flips) {
  const results = new Array();
  for (let i=0; i < flips; i++) {
    results[i] = coinFlip();
  }
  return results;
}

function countFlips(array) {
  var heads = 0;
  var tails = 0;
  for (let i=0; i < array.length; i++) {
    if (array[i] == "heads") {
      heads += 1;
    }
    if (array[i] == "tails") {
      tails += 1;
    }
  }
  return {"heads": heads, "tails": tails};
}

function flipACoin(call) {
  var results = coinFlip();
  if (results == call) {
    return {call: call, flip: results, result: "win"};
  }
  else {
    return {call: call, flip: results, result: "lose"};
  }
}
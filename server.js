// Define app using express
var express = require("express")
var app = express()
// Require database SCRIPT file
const db = require("./database.js")
// Require md5 MODULE
//var md5 = require("md5")
// Make Express use its own built-in body parser for both urlencoded and JSON body data.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Server port
var HTTP_PORT = 5000 
// Start server
const server = app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new/user", (req, res, next) => {
    let data = {
        user: req.body.username,
        pass: req.body.password
    }
    const stmt = db.prepare('INSERT INTO userinfo (username, password) VALUES (?, ?)')
    const info = stmt.run(data.user, data.pass)
    res.status(200).json(info)
});
// READ a list of users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {	
    try {
        const stmt = db.prepare('SELECT * FROM userinfo').all()
        res.status(200).json(stmt)
    } catch {
        console.error(e)
    }
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM userinfo WHERE id = ?').get(req.params.id);
        res.status(200).json(stmt)
    } catch (e) {
        console.error(e)
    }

});

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
    let data = {
        user: req.body.username,
        pass: req.body.password
    }
    const stmt = db.prepare('UPDATE userinfo SET username = COALESCE(?,username), password = COALESCE(?,password) WHERE id = ?')
    const info = stmt.run(data.user, data.pass, req.params.id)
    res.status(200).json(info)
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
    const stmt = db.prepare('DELETE FROM userinfo WHERE id = ?')
    const info = stmt.run(req.params.id)
    res.status(200).json(info)
});
// Default response for any other request
app.use(function(req, res){
	res.json({"message":"Endpoint not found. (404)"});
    res.status(404);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server stopped')
    })
})
// Default response for any other request 
// This ensures that things do not fail silently but will throw errors instead.
"use strict";
// Require better-sqlite.
const Database = require('better-sqlite3');

// Connect to a database or create one if it doesn't exist yet.
const db = new Database('user.db');

// Is the database initialized or do we need to initialize it?
const stmt = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='userinfo';`
    );
// Define row using `get()` from better-sqlite3
let row = stmt.get();
// Check if there is a table. If row is undefined then no table exists.
if (row === undefined) {
// Echo information about what you are doing to the console.
    console.log('Your database appears to be empty. I will initialize it now.');
// Set a const that will contain your SQL commands to initialize the database.
    const sqlInit = `
        CREATE TABLE userinfo ( id INTEGER PRIMARY KEY, username TEXT, password TEXT );
        INSERT INTO userinfo (username, password) VALUES ('user1','supersecurepassword'),('test','anotherpassword');
    `;
// Execute SQL commands that we just wrote above.
    db.exec(sqlInit);
// Echo information about what we just did to the console.
    console.log('Your database has been initialized with a new table and two entries containing a username and password.');
} else {
// Since the database already exists, echo that to the console.
    console.log('Database exists.')
}
// Export all of the above as a module so that we can use it elsewhere.
module.exports = db
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
const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require("body-parser");
const axios = require('axios');
const dotenv = require('dotenv')

require("dotenv").config({ path: path.resolve(__dirname, '.env') });

dotenv.config();
const backend = process.env.BACKEND;
const portal_port = process.env.PORTAL_PORT;
const frontend = process.env.FRONTEND;
const portal = process.env.PORTAL;
const web_port = process.env.WEB_PORT;

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Serve static assets
app.use("/site/assets", express.static(path.resolve(__dirname, "portal", "assets")));
app.use("/pages", express.static(path.resolve(__dirname, "portal", "pages")));
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "portal", "index.html"));
});

app.post('/api', function(request, res) {
    // Log incoming headers and body for debugging
    console.log('Request Headers:', request.headers);
    
    // Adjust referer based on action
    request.body.referer = (request.body.method === 'auth_login') ? portal : portal;

    // Prepare headers for the backend request
    let headers = {
        'Content-Type': "application/json; charset=utf-8" // Ensure proper content type
    };

    // If not a login request, include CSRF token and User ID in the headers - remove for now as we dont need csrf token and user ID
    // if (request.body.method !== 'auth_login') {
    //     headers['X-CSRF-Token'] = request.headers['x-csrf-token']; // Include CSRF token
    //     headers['X-User-ID'] = request.headers['x-user-id']; // Include User ID
    // }

    axios.post(backend, '', {
        headers: headers,
        params: request.body
    })
    .then(response => {
        console.dir(response.data);
        if (typeof response.data.data === 'string') {
            response.data.data = JSON.parse(response.data.data) ?? null;
        }
        res.send(response.data); // Send data to the client
    })
    .catch(err => {
        console.log(err);
        res.send({ err }); // Send error
    });
});

function prepareRequest(data){

  console.dir(data);
  var requestData = [];
  requestData['action'] = data.action;
  requestData['param'] = data;

  return requestData;

}

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`backend:${backend}`);
});
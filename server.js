/*********************************************************************************
 * BTI425 – Assignment 2 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including 3rd-party web sites) or distributed to other students. 
 * 
 * Name: Michael Dzura Student ID: 033566100 Date: 03/14/2020
 * 
 * Online (Heroku) URL: https://bti425-a2-web-api.herokuapp.com
 * ********************************************************************************/


/**********************************************************************************
 * Web service setup - Packages for handling data and requests.                   *
 **********************************************************************************/

const express = require("express");
const cors = require("cors");
const path = require("path");                             // 'path' is for dirctories.
const bodyParser = require('body-parser');
const app = express();                                    // Links Express for Node Server.
const HTTP_PORT = process.env.PORT || 8080;               // Sets the http port to 8080.


const manager = require("./manager.js");                  // MongoDB Data model and API request handling.


app.use(bodyParser.json());                               // Add support for incoming JSON entities.
app.use(cors());                                          // Add support for CORS.


app.use(bodyParser.urlencoded({extended: true}));
/*************************************************************************************/



/****************************************************************************
 * Here are the resources that are available for users of this              *
 * web API. Type '/api' to display functions.                               *
 * **************************************************************************/
app.get("/api", function(req, res) {
  const links = [];
  links.push({ "rel": "collection", "href": "/api/terms/english", "methods": "GET" });
  links.push({ "rel": "collection", "href": "/api/terms/english/:name", "methods": "GET,POST" });
  links.push({ "rel": "collection", "href": "/api/terms/english/id/:id", "methods": "GET,POST" });
  links.push({ "rel": "collection", "href": "/api/terms/other", "methods": "GET,PUT,DELETE" });
  //links.push({ "rel": "collection", "href": "/api/vehicles", "methods": "GET,PUT,DELETE" });
  const linkObject = { 
    "links": links, 
    "apiVersion": "1.0",
    "apiAuthor": "Michael Dzura", 
    "apiName": "Wep API for Assignment #2",
    "apiDescription": "Dictionary Data for Technical Terms"
  };
  res.json(linkObject);
});
/****************************************************************************/

/**************************************************************
 * These functions Setup 'routes' to listen on url path       *
 * If a directory is called, corresponding request handlers   *
 * are summond.                                               *
 * ************************************************************/
app.get("/", (req, res) => {                                      // Deliver the app's home page to browser clients
  res.sendFile(path.join(__dirname, "/index.html"));
  
});

// ******************* Get all ****************************//
app.get("/api/terms/english", function (req, res) {
  // Call the manager method
  manager.termsEnglishGetAll()
         .then(function (data) {
           //console.log("Data", data);
           res.json(data);
         })
         .catch(function (error) {
          res.status(500).json({ "message": error });
         })
});
/************************************************************/

/********************** Get By Name *************************/
app.get("/api/terms/english/:text", function(req, res) {
  manager.termsEnglishGetName(req.params.text)
         .then(function (data) {
          res.json(data);
  })
  .catch(function() {
    res.status(404).json({ "message": "Resource not found" });
  })
});
/************************************************************/

// ******************* Get one by id **********************//
app.get("/api/term/english/details/:id", function (req, res) {
  manager.termsEnglishGetByID(req.params.id)                         // Call the manager method
         .then(function (data) {
          res.json(data);
  })
  .catch(function() {
    res.status(404).json({ "message": "Resource not found" });
  })
});
/************************************************************/

// ********************** Add new **************************//
app.post("/api/term/english/add", function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  console.log("POSTING data");
  
  manager.termEnglishAdd(req.body)                                  // Call the manager method
         .then(function(data) {
           console.log(data);
           res.status(201).json(data);
         })
         .catch(function(error) {
            res.status(500).json({ "message": error });
         })
});
/*************************************************************/

// ***************** Edit existing **************************//
app.put("/api/term/english/edit/:id", function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


  console.log("By ID: " + req.body.id);

  if (req.body.id != req.body.id) {
    res.status(404).json({ "message": "Resource not found" });
  }
  else {
    
    manager.termEnglishEdit(req.params)                               // Call the manager method
    .then(function(data) {
      res.json(data);
    })
    .catch(function(error) {
       res.status(500).json({ "message": error });
    })
  }
});
/*************************************************************/

// **************** Delete item ****************************//
app.delete("/api/term/english/delete/:id", function (req, res) {
  
  manager.termEnglishDelete(req.params.id)                        // Call the manager method
         .then(function(data) {
           res.json(data);
         })
         .catch(function(error) {
            res.status(500).json({ "message": error });
         })
});

/************************************************************/

// *** Resource not found (this should be at the end) ******//
app.use(function (req, res) {
  res.status(404).send("Resource not found");
});
/************************************************************/


// ****** Tell the app to start listening for requests *****/
app.listen(HTTP_PORT, function() { 
  console.log("Hello, World! Express is ready to handle HTTP requests on port " + HTTP_PORT);
  manager.initialize();
});
/************************************************************/


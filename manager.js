/******************************************************************************
 * This module interfaces with MongoDB and performs the respected CRUD        *
 * operations: CREATE, READ, UPDATE, DELETE. Mongoose is used as the          *
 * middleware interface between NodeJS and MongoDB.                           *
 ******************************************************************************/ 

const mongoose = require("mongoose");                                                 // Linking Mongoose module.
autoIncrement = require('mongoose-auto-increment');                                   // Auto-Increment ID
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const termEnglishSchema = require("./msc-termEnglish.js");                                // Assigning Mongoose Schema to variable.
const termNonEnglishSchema = require("./msc-termNonEnglsh");   
const definitionSchema = require("./msc-definition");   




/******************************************************************************
 * Initializes Connection to Database                                         *
 ******************************************************************************/
let Dictionary;                                                                        // Collection Properties
module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        //let db = mongoose.createConnection("mongodb://dbuser:1234@cluster1-shard-00-00-6v28c.mongodb.net:27017,cluster1-shard-00-01-6v28c.mongodb.net:27017,cluster1-shard-00-02-6v28c.mongodb.net:27017/test?ssl=true&replicaSet=cluster1-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

        let db = mongoose.createConnection("mongodb://192.168.0.21:27017");
        //autoIncrement.initialize(db);

        db.on('error', function (err) {
            reject(console.log(err.message));                                        // If connection error, Reject the promise with the provided error.
        });
        db.once('open', function () {
            //vehicleSchema.plugin(autoIncrement.plugin, 'vehicles');
            Dictionary = db.model("db-a2", termEnglishSchema, "englishterms");                 // Create a dictionary model from schema above.
            
            console.log(Dictionary);
            resolve(console.log("Database Connected"));
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives list of all vehicles from the Database                           *
 ******************************************************************************/
module.exports.termsEnglishGetAll = function() {
    console.log("Getting All English Terms...");
    return new Promise(function(resolve, reject) {
        Dictionary.find()
          //.limit(10)
          //.lean()
          //.sort({wordEnglish: 'asc'})
          .exec(function (error, items) {
            if (error) {
              // Query error
              return reject(console.log(error.message));
            }
            // Found, a collection will be returned 
            console.log(items);
            return resolve(items);
          });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives individual vehicle by VIN from the Database                       *
 ******************************************************************************/
module.exports.termsEnglishGetByID = function (id) {
    console.log("Getting English Term By ID...");
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Dictionary.findOne({"_id": id}, function(error, data) {
            if (error) {
                // Find/match is not found
                return reject(error.message);
            }
            // Check for an item
            if (data) {
                // Found, one object will be returned
                return resolve(data);
            } else {
                return reject('Not found');
            }
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives individual vehicle by ID from the Database                       *
 ******************************************************************************/
module.exports.termsEnglishGetName = function (text) {
    console.log("Getting English Term By Name...");
    return new Promise(function (resolve, reject) {

        text = decodeURIComponent(text);

        // Find one specific document
        Dictionary.find({ wordEnglish: { $regex: text, $options: "i"}}, function(error, data) {
            if (error) {
                // Find/match is not found
                return reject(error.message);
            }
            // Check for an item
            if (data) {
                // Found, one object will be returned
                console.log(data);
                return resolve(data);
            } else {
                return reject('Not found');
            }
        });
    });
};
/*******************************************************************************/
/******************************************************************************
 * Add Vehicle to the Database                                                *
 ******************************************************************************/
module.exports.termEnglishAdd = function (newItem) {
    console.log("Adding English Term to Collection...");
    console.log(newItem);
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Dictionary.create(newItem, function (error, item) {
            if (error) {
              // Cannot add item
              return reject(console.log(error.message));
            }
            //Added object will be returned
            return resolve(item);
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Edit existing vehicle from the Database                                    *
 ******************************************************************************/
module.exports.termEnglishEdit = function (changes) {
    console.log("Editing English Term in Collection...");
    console.log("Changes: " + changes);

    return new Promise(function (resolve, reject) {
        // Find one specific document
        Dictionary.findByIdAndUpdate(changes.id, 
            {
                id: changes.id,
                make: changes.make,
                model: changes.model,
                colour: changes.colour,
                year: changes.year,
                vin: changes.vin,
                msrp: changes.msrp,
                photo: changes.photo,
                description: changes.description,
                purchaseDate: changes.purchaseDate,
                purchaserName: changes.purchaserName,
                purchaserEmail: changes.purchaserEmail,
                pricePaid: changes.pricePaid
            }, function (error, item) {
            if (error) {
              // Cannot edit item
              return reject(console.log(error.message));
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject(console.log("Not Found!"));
            }
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Delete vehicle from the Database                                           *
 ******************************************************************************/
module.exports.termEnglishDelete = function (itemId) {
    console.log("Deleting English Term By ID...");
    console.log(itemId);
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Dictionary.deleteOne({"_id": itemId}, function (error) {
            if (error) {
              // Cannot delete item
              console.log(error.message);
              return reject(error.message);
            }
            // Return success, but don't leak info
            return resolve();
        });
    });
};
/*******************************************************************************/

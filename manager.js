/******************************************************************************
 * This module interfaces with MongoDB and performs the respected CRUD        *
 * operations: CREATE, READ, UPDATE, DELETE. Mongoose is used as the          *
 * middleware interface between NodeJS and MongoDB.                           *
 ******************************************************************************/ 

const mongoose = require("mongoose");                                                                  // Linking Mongoose module.
//autoIncrement = require('mongoose-auto-increment');                                                    // Auto-Increment ID
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const termEnglishSchema = require("./msc-termEnglish.js");                                             // Assigning Mongoose Schema to variable.
const termNonEnglishSchema = require("./msc-termNonEnglsh");   
const definitionSchema = require("./msc-definition");   




/******************************************************************************
 * Initializes Connection to Database                                         *
 ******************************************************************************/
let Dictionary;                                                                                        // Collection Properties
module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection("mongodb://dbuser:1234@cluster1-shard-00-00-6v28c.mongodb.net:27017,cluster1-shard-00-01-6v28c.mongodb.net:27017,cluster1-shard-00-02-6v28c.mongodb.net:27017/db-a2?ssl=true&replicaSet=cluster1-shard-0&authSource=admin&retryWrites=true&w=majority", { connectTimeoutMS: 5000, useUnifiedTopology: true });
        //.catch(err => {console.log(err)});

        //let db = mongoose.createConnection("mongodb://192.168.0.18:27017/db-a2");
        //autoIncrement.initialize(db);

        db.on('error', function (err) {
            reject(console.log(err.message));                                                         // If connection error, Reject the promise with the provided error.
        });
        db.once('open', function () {
            //vehicleSchema.plugin(autoIncrement.plugin, 'vehicles');
            Dictionary = db.model("englishterms", termEnglishSchema, "englishterms");                 // Create a dictionary model from schema above.
            
            console.log(Dictionary);
            resolve(console.log("Database Connected"));
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives list of all vehicles from the Database                           *
 ******************************************************************************/
module.exports.termsEnglishGetAll = async function() {
    console.log("Getting All English Terms...");
    return await new Promise(function(resolve, reject) {
        Dictionary.find()
          //.limit(10)
          //.lean()
          .sort({wordEnglish: 'asc'})
          .exec(function (error, items) {
            if (error) {
              // Query error
              return reject(console.log(error.message));
            }
            // Found, a collection will be returned 
            //console.log(items);
            return resolve(items);
          });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives individual English Term by ID from the Database                  *
 ******************************************************************************/
module.exports.termsEnglishGetByID = async function (id) {
    console.log("Getting English Term By ID...");
    return await new Promise(function (resolve, reject) {
        // Find one specific document
        Dictionary.findOne({"_id": id}, function(error, data) {
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
 * Retreives individual English Term by Name from the Database                *
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
 * Add English Term to the Database                                           *
 ******************************************************************************/
module.exports.termEnglishAdd = async function (newItem) {
    console.log("Adding English Term to Collection...");
    //console.log(newItem);
    return await new Promise(function (resolve, reject) {

        //var newTerm = new Dictionary(newItem);
        // Find one specific document

        Dictionary.create(newItem, function (error, item) {
            if (error) {
                console.log("Database:", error.message);
                return reject(error.message);
            }
            return resolve(item);
        })
        
    });
};
/*******************************************************************************/

/******************************************************************************
 * Edit and add to an existing English Term from the Database                 *
 ******************************************************************************/
module.exports.termEnglishAddDef = async function (itemID, newItem) {
    //console.log("Adding New Definition in " + changes.wordEnglish);
    //console.log("Changes: " + changes.id + ", " + changes.wordEnglish);

    //return new Promise(function (resolve, reject) {

    let newDef = await Dictionary.findById(itemID);
    console.log("Body:", newItem);
       // console.log("MongoDB:", newDef);
    if (newDef) {
        console.log("Hello World");
        newDef.definitions.push(newItem);
        console.log("Result:", newDef.definitions);
        await newDef.save();
        return newDef;
    } else {
        throw "Not Found";
        //return reject("Not Found");
    }
    //});
};
/*******************************************************************************/

/******************************************************************************
 * Increase the 'Like' counter for a efinition                                *
 ******************************************************************************/
module.exports.likeDefinition = async function (itemID, newItem) {
    //console.log("Adding New Definition in " + changes.wordEnglish);
    //console.log("Changes: " + changes.id + ", " + changes.wordEnglish);

    if (itemID !== newItem) {
        throw "Not Found";
    }


    let like = await Dictionary.findOne({"definitions._id": itemID});
    //console.log("Body:", newItem);
       // console.log("MongoDB:", newDef);
    if (like) {
        //console.log("Hello World");
        let def = like.definitions.id(itemID);
        def.likes++;
        //console.log("Result:", newDef.definitions);
        await like.save();
        return like;
    } else {
        throw "Not Found";
        //return reject("Not Found");
    }
    //});
};
/*******************************************************************************/

/******************************************************************************
 * Edit existing English Term from the Database                               *
 ******************************************************************************/
module.exports.termEnglishEdit = function (changes) {
    console.log("Editing English Term in Collection...");
    console.log("Changes: " + changes.id + ", " + changes.wordEnglish);

    return new Promise(function (resolve, reject) {
        // Find one specific document
        Dictionary.findByIdAndUpdate(changes.id, 
            {
                wordEnglish: changes.wordEnglish,
                wordNonEnglish: changes.wordNonEnglish,
                wordExpanded: changes.wordExpanded,
                languageCode: changes.languageCode,
                image: changes.images,
                imageType: changes.imageType,
                audio: changes.audio,
                audioType: changes.audioType,
                linkAuthoritative: changes.linkAuthoritative,
                linkWikipedia: changes.linkWikipedia,
                linkYouTube: changes.linkYouTube,
                authorName: changes.authorName,
                dateCreated: changes.dateCreated,
                dateRevised: changes.dateRevised,
                fieldOfStudy: changes.fieldOfStudy,
                helpYes: changes.helpYes,
                helpNo: changes.helpNo,
                definitions: [{
                    authorName: changes.definitions.authorName,
                    dateCreated: changes.definitions.dateCreated,
                    definition: changes.definitions.definition,
                    quality: changes.definitions.quality,
                    like: changes.definitions.like
                }]
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
 * Delete English Term from the Database                                      *
 ******************************************************************************/
module.exports.termEnglishDelete = async function (itemId) {
    console.log("Deleting English Term By ID...");
    console.log(itemId);
    return await new Promise(function (resolve, reject) {
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

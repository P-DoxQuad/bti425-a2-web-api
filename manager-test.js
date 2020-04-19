
// ################################################################################
// TODO to do items

// delete all data (to restart)
// load (reload) sample data

// maybe in the msc-term-english.js schema, i don't need the "termsOther" field



// ################################################################################
// Data service operations setup

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Load the schemas...

// Data entities; the standard format is:
const termEnglishSchema = require('./msc-termEnglish');
const termNonEnglishSchema = require("./msc-termNonEnglsh");   
const definitionSchema = require("./msc-definition");   



// ################################################################################
// Define the functions that can be called by server.js

module.exports = function () {

  // Collection properties, which get their values upon connecting to the database
  let Dictionary;

  return {

    // ############################################################
    // Connect to the database

    initialize: function () {
      return new Promise(function (resolve, reject) {

        // Create connection to the database
        console.log('Attempting to connect to the database...');

        // The following works for localhost...
        // Replace the database name with your own value
       let db = mongoose.createConnection("mongodb://dbuser:1234@cluster1-shard-00-00-6v28c.mongodb.net:27017,cluster1-shard-00-01-6v28c.mongodb.net:27017,cluster1-shard-00-02-6v28c.mongodb.net:27017/db-a2?ssl=true&replicaSet=cluster1-shard-0&authSource=admin&retryWrites=true&w=majority", { connectTimeoutMS: 5000, useUnifiedTopology: true });

        db.on('error', (error) => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        db.once('open', () => {
          console.log('Connection to the database was successful');
          Dictionary = db.model("englishterms", termEnglishSchema, "englishterms");
          resolve();
        });
      });
    },



    // ############################################################
    // Business requests

    termsEnglishGetAll: function () {
      return new Promise((resolve, reject) => {

        Dictionary.find()
          .sort({ wordEnglish: 'asc' })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    termsEnglishGetByID: function (id) {
      return new Promise(function (resolve, reject) {

        // Find one specific document
        Dictionary.findById(id)
          .exec((error, item) => {
            if (error) {
              // Find/match is not found
              return reject(error.message);
            }
            // Check for an item
            if (item) {
              // Found, one object will be returned
              return resolve(item);
            } else {
              return reject('Not found');
            }
          });
      })
    },

    // This will need a document that includes an embedded subdocument
    termEnglishAdd: function (newItem) {
      return new Promise(function (resolve, reject) {

        Dictionary.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      })
    },

    // This will need a document that looks like this...
    // { name: 'Engineering', leader: 'Gardiner De Roos', headCount: 36 }
    /*businessAddDepartmentEdit: async function (itemId, newItem) {

      // Attempt to locate the existing document
      let business = await Business.findById(itemId);

      if (business) {
        // Add the new subdocument and save
        business.departments.push(newItem);
        await business.save();
        return business;
      }
      else {
        // Uh oh, "throw" an error
        throw "Not found";
      }
    }*/

    // Command - change the "slogan" to upper case
    // This will need an identifier parameter, and an entity body that looks like this...
    // { "_id": "abc123etc." }
    /*businessSloganUpperCase: async function (itemId, newItem) {

      // Early exit, confirm that the parameter and entity body match
      if (itemId !== newItem._id) {
        // Uh oh, "throw" an error
        throw "Not found";
      }

      // Attempt to locate the existing document
      let business = await Business.findById(itemId);

      if (business) {
        // Do the task
        business.slogan = business.slogan.toUpperCase();
        await business.save();
        // Send the entire document back to the requestor
        return business;
      }
      else {
        // Uh oh, "throw" an error
        throw "Not found";
      }
    },*/

    // Command - increment a department "headCount"
    // This will need an identifier parameter, and an entity body that looks like this...
    // { "_id": "abc123etc." }
    termEnglishEdit: async function (id, newItem) {

      // Early exit, confirm that the parameter and entity body match
      if (id !== newItem._id) {
        // Uh oh, "throw" an error
        throw "Not found";
      }

      // Attempt to locate the existing document that has the desired department
      let dictionary = await Business.findOne({ "definitions._id": id });

      if (dictionary) {
        // Attempt to locate the department
        let def = dictionary.definitions.id(itemId);
        // Increment and save
        //dep.headCount++;
        def.definition.itemId.definition;
        await dictionary.save();
        // Send the entire document back to the requestor
        return dictionary;
      }
      else {
        // Uh oh, "throw" an error
        throw "Not found";
      }
    }

    // Other "edit" tasks can be coded in a way that's similar to the method above
    // Attempt to fetch the document, make changes, save

    // The "delete" task works as you have seen in the past in other code examples

  } // return statement that encloses all the function members

} // module.exports


// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definition Schema

var definitionSchema = new Schema({
  authorName: String,
  dateCreated: String,
  definition: String,
  quality: Number,
  likes: Number
});

// Make schema available to the application
module.exports = definitionSchema;

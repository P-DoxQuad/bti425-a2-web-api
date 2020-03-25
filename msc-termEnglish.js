
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var definitionScheme = require('./msc-definition.js');

// English Term Schema

var termEnglishSchema = new Schema({
  wordEnglish: String,
  wordNonEnglish: String,
  wordExpanded: String,
  languageCode: Number,
  image: String,
  imageType: String,
  audio: String,
  audioType: String,
  linkAuthoritative: String,
  linkWikipedia: String,
  linkYouTube: String,
  authorName: String,
  dateCreated: Date,
  dateRevised: Date,
  fieldOfStudy: String,
  helpYes: Number,
  helpNo: Number,
  definition: [definitionScheme]
});

// Make schema available to the application
module.exports = termEnglishSchema;

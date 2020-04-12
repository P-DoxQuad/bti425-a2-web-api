
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var definitionScheme = require("./msc-definition.js");

// English Term Schema
var termEnglishSchema = new Schema({
  wordEnglish: String,
  wordNonEnglish: String,
  wordExpanded: String,
  languageCode: String,
  image: String,
  imageType: String,
  audio: String,
  audioType: String,
  linkAuthoritative: String,
  linkWikipedia: String,
  linkYouTube: String,
  authorName: String,
  dateCreated: String,
  dateRevised: String,
  fieldOfStudy: String,
  helpYes: Number,
  helpNo: Number,
  definitions: [definitionScheme]
}, {
versionKey: true
}
);

// Make schema available to the application
module.exports = termEnglishSchema;

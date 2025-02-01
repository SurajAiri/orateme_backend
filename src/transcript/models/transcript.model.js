const mongoose = require('mongoose');

/*
words: [ {word, start, end, confidence} ],
paragraphs: [
    {
        sentences: 
        [ {text, start, end}], start, end, confidence
         }
    ]
*/

const sentenceSchema = new mongoose.Schema({
    text: String,
    start: Number,
    end: Number
});

const wordSchema = new mongoose.Schema({
    word: String,
    start: Number,
    end: Number,
    confidence: Number
});

const paragraphSchema = new mongoose.Schema({
    sentences: [sentenceSchema],
    start: Number,
    end: Number,
    confidence: Number
});

const transcriptSchema = new mongoose.Schema({
    words: [wordSchema],
    paragraphs: [paragraphSchema],
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Transcript', transcriptSchema);
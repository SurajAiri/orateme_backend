import mongoose from 'mongoose';

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
    end: Number,
    _id:false
});

const wordSchema = new mongoose.Schema({
    word: String,
    start: Number,
    end: Number,
    confidence: Number,
    _id:false
});

const paragraphSchema = new mongoose.Schema({
    sentences: [sentenceSchema],
    start: Number,
    end: Number,
    num_words: Number,
    _id:false
});

const transcriptSchema = new mongoose.Schema({
    words: [wordSchema],
    paragraphs: [paragraphSchema],
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transcript', transcriptSchema);
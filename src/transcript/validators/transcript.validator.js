const Joi = require('joi');

class TranscriptValidator {
    constructor() {
        this.wordValidator = Joi.object({
            word: Joi.string().required(),
            start: Joi.number().required(),
            end: Joi.number().required(),
            confidence: Joi.number().required()
        });

        this.sentenceValidator = Joi.object({
            text: Joi.string().required(),
            start: Joi.number().required(),
            end: Joi.number().required()
        });

        this.paragraphValidator = Joi.object({
            sentences: Joi.array().items(this.sentenceValidator).required(),
            start: Joi.number().required(),
            end: Joi.number().required(),
            num_words: Joi.number()
        });

        this.createTranscript = Joi.object({
            // words: Joi.array().items(this.wordValidator).required(),
            paragraphs: Joi.array().items(this.paragraphValidator).required()
        });

        this.updateTranscript = Joi.object({
            // words: Joi.array().items(this.wordValidator),
            paragraphs: Joi.array().items(this.paragraphValidator)
        }).min(1);
    }
}

module.exports = new TranscriptValidator();
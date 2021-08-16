const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        comments: Joi.array()
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        author: Joi.string().required(),
        text: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})
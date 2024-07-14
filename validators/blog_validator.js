const Joi = require('joi');

const BlogSchema= Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Title must not be empty.",
            'string.max': 'Title is too Long',
            'string.min': 'Title is too short',
            'any.required': "Title is required."
        }),
    description: Joi.string()
        .trim()
        .max(400)
        .messages({
            'string.base': "Invalid input.",
            'string.max': 'Description is too Long'
        }),
    // author: Joi.string()
    //     .messages({
    //         'string.base': "Invalid input."
    //     }),
    state: Joi.valid('draft', 'published')
        .messages({
            'any.only': "Invalid State",
            'any.required': "State is required."
        }),
    // read_count: Joi.number()
    //     .integer()
    //     .positive()
    //     .messages({
    //         'number.base': "Invalid input.",
    //         'number.positive': "An error occurred."
    //     }),
    // reading_time: Joi.number()
    //     .integer()
    //     .positive()
    //     .messages({
    //         'number.base': "Invalid input.",
    //         'number.positive': "Reading time can not be negative."
    //     }),
    tags: Joi.array()
        .items(
            Joi.string()
            .pattern(/^\S*$/)
        )
        .unique()
        .messages({
            'array.base': "Invalid input.",
            'array.unique': "Duplicate tags not allowed.",
            'string.base': "Invalid tags.",
            'string.pattern.base': "Tag must not have space.",
        }),
    body: Joi.string()
        .trim()
        .min(100)
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Body must not be empty.",
            'string.min': 'Body is too short.',
            'any.required': "Body is required."
        })
    // ,timestamp: Joi.date()
    //     .timestamp()
    //     .messages({
    //         'date.base': "Invalid input.",
    //         'date.format': "Invalid date format."
    //     })
})


async function BlogValidationMW(req, res, next) {
    const userPayLoad = req.body

    try {
        await BlogSchema.validateAsync(userPayLoad)
        next()
    } catch (error) {
        next({
            status: 400,
            success: false,
            message: error.details[0].message
        })
    }
}




module.exports = {
    BlogValidationMW
}
const Joi = require('joi');

const AddUserSchema= Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.email': "Invalid email.",
            'string.empty': "Email must not be empty.",
            'any.required': "Email is required."
    }),
    first_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]{3,30}$'))
        .trim()
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Firstname must not be empty.",
            'string.pattern.base': "Firstname must only contain letters, space or special character not allowed.",
            'any.required': "Firstname is required."
        }),
    last_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]{3,30}$'))
        .trim()
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Lastname must not be empty.",
            'string.pattern.base': "Lastname must only contain letters, space or special character not allowed.",
            'any.required': "Lastname is required."
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Password must not be empty.",
            'any.required': "Password is required."
        }),
    repeat_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only' : "Password not match"
          })
}).with('password', 'repeat_password');


const UpdateUserSchema= Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
        .messages({
            'string.base': "Invalid input.",
            'string.email': "Invalid email.",
            'string.empty': "Email must not be empty."
    }),
    first_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]{3,30}$'))
        .trim()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Firstname must not be empty.",
            'string.pattern.base': "Firstname must only contain letters, space or special character not allowed."
        }),
    last_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]{3,30}$'))
        .trim()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Lastname must not be empty.",
            'string.pattern.base': "Lastname must only contain letters, space or special character not allowed."
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Password must not be empty.",
            'any.required': "Password is required."
        }),
    // token: Joi.string()
    //     .valid(Joi.ref('password'))
    //     .required()
    //     .messages({
    //         'any.only' : "Password not match"
    //       })
})

const Login= Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ng'] } })
        .messages({
            'string.base': "Invalid input.",
            'string.email': "Invalid email.",
            'string.empty': "Email must not be empty."
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.base': "Invalid input.",
            'string.empty': "Password must not be empty.",
            'any.required': "Password is required."
        }),
})

async function AddUserValidationMW(req, res, next) {
    const userPayLoad = req.body

    try {
        await AddUserSchema.validateAsync(userPayLoad)
        next()
    } catch (error) {
        next({
            status: 400,
            success: false,
            message: error.details[0].message
        })
    }
}

async function UpdateUserValidationMW(req, res, next) {
    const userPayLoad = req.body

    try {
        await UpdateUserSchema.validateAsync(userPayLoad)
        next()
    } catch (error) {
        next({
            status: 400,
            success: false,
            message: error.details[0].message
        })
    }
}

async function LoginValidationMW(req, res, next) {
    const userPayLoad = req.body

    try {
        await Login.validateAsync(userPayLoad)
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
    AddUserValidationMW,
    UpdateUserValidationMW,
    LoginValidationMW
}
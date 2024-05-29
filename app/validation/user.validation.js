const joi = require('joi');

const signupValidation = (req, res, next) => {
    const userSchema = joi.object({
        name: joi.string().alphanum().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
        mobile: joi.string().pattern(new RegExp('^\\d{7,15}$')).required(),
        role_id: joi.string().required(),
    });

    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    } else {
        return next();
    }
};

const newPasswordValidation = (req, res, next) => {
    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
    });

    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    } else {
        return next();
    }
};

module.exports = {
    signupValidation, 
    newPasswordValidation
};
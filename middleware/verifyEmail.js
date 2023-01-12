const validator = require("email-validator");

// Verify if correct email schema is used by users 
module.exports = (req, res, next) => {
    const{email} = req.body;

    if(validator.validate(email)) {
        next()
    } else {
        return res
        .status(400)
        .json({ error : `L'email ${email} est invalide`})
    }
};
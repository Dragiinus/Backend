const schemaPassword = require('../models/Password');

// Verify if correct password schema is used by users
module.exports = (req, res, next) => {
  if (!schemaPassword.validate(req.body.password)) {
    res
      .status(400)
      .json({
        message:
          'Le mot de passe doit contenir au moins une majuscule, une minuscule, 2 chiffres. Ne doit pas avoir d\'espace et la longueur doit être comprise entre 8 et 100 caractères.',
      });
  } else {
    next();
  }
};
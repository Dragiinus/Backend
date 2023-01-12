const jwt = require('jsonwebtoken');
require('dotenv').config();

// Check user authentication
// Extract token from entering request
// Apply verify function to decode token
// Extract userId from token then add it to request Object to allow use by routes
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
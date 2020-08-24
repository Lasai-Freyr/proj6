const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM TOKEN_SECRET');
    const userId = decodedToken.userId;
    
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    console.log("error ici");
    //console.log(userId);
    //console.log(decodedToken.userId);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
const passwordSchema = require('../constraints/Password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        console.log('mot de passe trop simple');
        res.status(401).json({error: 'mot de passe trop simple !' });
    } else {
        next();
    }
};
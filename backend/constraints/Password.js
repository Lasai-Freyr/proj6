const passWordValidator = require('password-validator');

const passwordSchema = new passWordValidator();

passwordSchema
.is().min(6)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.is().not().oneOf(["Passw0rd", 'Password123', "Mot2passe", "Azerty1", "Azerty123", "Motdepasse1","Azertyuiop123"]);

module.exports = passwordSchema;
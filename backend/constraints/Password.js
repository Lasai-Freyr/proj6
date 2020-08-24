const passWordValidator = require('password-validator');

const passwordSchema = new passWordValidator();

passwordSchema
.is().min(6)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.is().not().oneOf(["Passw0rd", 'Password123', '123456']);

module.exports = passwordSchema;
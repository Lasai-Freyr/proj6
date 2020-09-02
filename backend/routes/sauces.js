const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');
const likeCtrl = require('../controllers/like');

router.get('/', saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);  
router.delete('/:id',auth, saucesCtrl.deleteSauce);
router.post('/',  multer, auth, saucesCtrl.createSauce);

router.post('/:id/like', auth, likeCtrl.Likes);


module.exports = router;
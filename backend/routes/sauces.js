const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/',  saucesCtrl.getAllSauces);
router.get('/:id',   saucesCtrl.getOneSauce);
router.put('/:id',  multer, saucesCtrl.modifySauce);  
router.delete('/:id',  saucesCtrl.deleteSauce);
router.post('/',  multer,  saucesCtrl.createSauce);
router.post('/:id/like', saucesCtrl.Likes);
router.post('/:id/like', saucesCtrl.Dislikes);

module.exports = router;
const express = require('express');
const router = express.Router();

const likeCtrl = require('../controllers/like');

router.post('/:id/like', likeCtrl.Likes);

module.exports = router;
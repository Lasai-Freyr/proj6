const Sauce = require('../models/Sauce');
const User = require('../models/User');
const fs = require('fs');

exports.Likes = ( req, res, next) =>  {
  
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const userId = req.body.userId;
    const userWantsToLike = (req.body.like == 1);
    const userWantsToDislike = (req.body.like == -1);
    const userWantsToCancel = ( req.body.like == 0);
    const userCanLike = (!sauce.usersLiked.includes(userId));
    const userCanDislike = (!sauce.usersDisliked.includes(userId));
    const notTheFirstVote = (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId));

    if (userWantsToLike && userCanLike)  {sauce.usersLiked.push(userId)};
    if (userWantsToDislike && userCanDislike) {sauce.usersDisliked.push(userId)};

    if (userWantsToCancel && notTheFirstVote)  {
      if  (sauce.usersLiked.includes(userId)) {
        let index = sauce.usersLiked.indexOf(userId);
        sauce.usersLiked.splice(index, 1);
      } else {
        let index = sauce.usersDisliked.indexOf(userId);
        sauce.usersDisliked.splice(index, 1);
      }
    }
    sauce.likes = sauce.usersLiked.length;
    sauce.dislikes = sauce.usersDisliked.length;
    const updateSauce = sauce;
    updateSauce.save();
    return updateSauce;
  })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error}));
}
const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = ( req, res, next) => {
  Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json( {error}));
};

exports.Likes = ( req, res, next) =>  {
   // Check if id was passed provided in request body
   if (!req.body.id) {
    res.json({ success: false, message: 'No id was provided.' }); // Return error message
  } else {
    // Search the database with id
    Sauce.findOne({ _id: req.body.id }, (err, sauce) => {
      // Check if error was encountered
      if (err) {
        res.json({ success: false, message: 'Invalid sauce id' }); // Return error message
      } else {
        // Check if id matched the id of a blog post in the database
        if (!blog) {
          res.json({ success: false, message: 'That sauce was not found.' }); // Return error message
        } else {
          // Get data from user that is signed in
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if id of user in session was found in the database
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
              } else {
                // Check if user who liked post is the same user that originally created the blog post
                if (user.userId === sauce.userId) {
                  res.json({ success: false, messagse: 'Cannot like your own sauce.' }); // Return error message
                } else {
                  // Check if the user who liked the post has already liked the blog post before
                  if (sauce.usersLiked.includes(user.userId)) {
                    res.json({ success: false, message: 'You already liked this sauce.' }); // Return error message
                  } else {
                    // Check if user who liked post has previously disliked a post
                    if (sauce.usersDisliked.includes(user.userId)) {
                      blog.dislikes--; // Reduce the total number of dislikes
                      const arrayIndex = sauce.usersDisliked.indexOf(user.userId); // Get the index of the username in the array for removal
                      sauce.usersDisliked.splice(arrayIndex, 1); // Remove user from array
                      sauce.likes++; // Increment likes
                      sauce.usersLiked.push(user.userId); // Add username to the array of likedBy array
                      // Save blog post data
                      sauce.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'Sauce liked!' }); // Return success message
                        }
                      });
                    } else {
                      sauce.likes++; // Incriment likes
                      sauce.usersLiked.push(user.userId); // Add liker's username into array of likedBy
                      // Save blog post
                      sauce.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'Blog liked!' }); // Return success message
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
};

exports.Dislikes = ( req, res, next) => {
  // Check if id was provided inside the request body
  if (!req.body.id) {
    res.json({ success: false, message: 'No id was provided.' }); // Return error message
  } else {
    // Search database for blog post using the id
    Sauce.findOne({ _id: req.body.id }, (err, blog) => {
      // Check if error was found
      if (err) {
        res.json({ success: false, message: 'Invalid sauce id' }); // Return error message
      } else {
        // Check if blog post with the id was found in the database
        if (!sauce) {
          res.json({ success: false, message: 'That sauce was not found.' }); // Return error message
        } else {
          // Get data of user who is logged in
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if user was found in the database
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
              } else {
                // Check if user who disliekd post is the same person who originated the blog post
                if (user.userId === sauce.userId) {
                  res.json({ success: false, messagse: 'Cannot dislike your own sauce.' }); // Return error message
                } else {
                  // Check if user who disliked post has already disliked it before
                  if (sauce.usersDisliked.includes(user.userId)) {
                    res.json({ success: false, message: 'You already disliked this sauce.' }); // Return error message
                  } else {
                    // Check if user has previous disliked this post
                    if (sauce.usersLiked.includes(user.userId)) {
                      sauce.likes--; // Decrease likes by one
                      const arrayIndex = sauce.usersLiked.indexOf(user.userId); // Check where username is inside of the array
                      sauce.usersLiked.splice(arrayIndex, 1); // Remove username from index
                      sauce.dislikes++; // Increase dislikeds by one
                      sauce.usersDisliked.push(user.userId); // Add username to list of dislikers
                      // Save blog data
                      sauce.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'sauce disliked!' }); // Return success message
                        }
                      });
                    } else {
                      sauce.dislikes++; // Increase likes by one
                      sauce.usersDisliked.push(user.userId); // Add username to list of likers
                      // Save blog data
                      sauce.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'sauce disliked!' }); // Return success message
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
};
const Sauce = require('../models/Sauce');
const User = require('../models/User');
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
  console.log("begin");    
  const like = req.body.like;
  console.log(like);
 if (!req.params.id) {  console.log("étape 2");
   res.json({ success: false, message: 'No id was provided.' }); // Return error message
 } else
 {
   // Search the database with id
    Sauce.findOne({ _id: req.params.id }, (err, sauce) => {
       // Check if error was encountered
      if (err) { console.log("étape A");
        res.json({ success: false, message: 'Invalid sauce id' }); // Return error message
      } else
      {
       // Check if id matched the id of a sauce post in the database
        if (!sauce) { console.log("étape 3");
          res.json({ success: false, message: 'That sauce was not found.' }); // Return error message
        } else 
        {   console.log("étape 3 bis");
         // Get data from user that is signed in
          User.findOne({ _id: req.body.userId }, (err, user) => {  console.log("étape 3 ters");     
            // Check if error was found
            if (err) {  console.log("étape B");
            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else
            { console.log("étape 4");
            
            if (like == 1){
                  sauce.likes++; // Incriment likes
                  sauce.usersLiked.push(user.id); // Add liker's username into array of likedBy 
                  // Save sauce post data
                  sauce.save((err) => { console.log("étape 8");
                  // Check if error was found
                    if (err) {  console.log("étape C");
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else
                    {   console.log("étape 8.2");
                        res.json({ success: true, message: 'Sauce liked!' }); // Return success message
                      }
                    console.log("étape finale");
                  });  
              }   else
              {
                if (like == -1) {
                  sauce.dislikes++; // Incriment likes
                  sauce.usersDisliked.push(user.id); // Add liker's username into array of likedBy
                  // Save sauce post data
                  sauce.save((err) => { console.log("étape 8");
                  // Check if error was found
                    if (err) {  console.log("étape C");
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                    } else
                    {  console.log("étape 8.2");
                        res.json({ success: true, message: 'Sauce liked!' }); // Return success message
                    }
                    console.log("étape finale");
                  });
                } else
                { 
                  if( like == 0);{
                    if (sauce.usersLiked.includes(user.id)){
                        sauce.likes--; // Decrease likes by one
                        console.log("étape 6.1");
                        const arrayIndex = sauce.usersLiked.indexOf(user.id); // Check where username is inside of the array                                
                        sauce.usersLiked.splice(arrayIndex, 1); // Remove username from index
                        console.log("étape 6.3");  
                    } else
                    {
                        if (sauce.usersDisliked.includes(user.id)) {
                          console.log("étape 7");
                          sauce.dislikes--; // Reduce the total number of dislikes
                          const arrayIndex = sauce.usersDisliked.indexOf(user.id); // Get the index of the username in the array for removal
                          sauce.usersDisliked.splice(arrayIndex, 1); // Remove user from array
                        }
                    }
                    // Save sauce post data
                    sauce.save((err) => { console.log("étape 8");
                    // Check if error was found
                      if (err) {  console.log("étape C");
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else
                      {  console.log("étape 8.2");
                          res.json({ success: true, message: 'Sauce liked!' }); // Return success message
                      }
                      console.log("étape finale");
                  });
                  }
                }
              } 
            }
          });
        }
      }     
    });
  }  
}
const Sauce = require('../models/Sauce');
const User = require('../models/User');
const fs = require('fs');

exports.Likes = ( req, res, next) =>  {
    // Check if id was passed provided in request body  
    console.log("begin");    
    const like = req.body.like;
    console.log(like);
   if (!req.params.id) { 
     res.json({ success: false, message: 'No id was provided.' }); // Return error message
   } else
   {
     // Search the database with id
      Sauce.findOne({ _id: req.params.id }, (err, sauce) => {
         // Check if error was encountered
        if (err) { 
          res.json({ success: false, message: 'Invalid sauce id' }); // Return error message
        } else
        {
         // Check if id matched the id of a sauce  in the database
          if (!sauce) {
            res.json({ success: false, message: 'That sauce was not found.' }); // Return error message
          } else 
          {   
           // Get data from user that is signed in
            User.findOne({ _id: req.body.userId }, (err, user) => {    
              // Check if error was found
              if (err) {  
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else
              { 
              
              if (like == 1){
                    sauce.likes++; // Incriment likes
                    sauce.usersLiked.push(user.id); // Add liker's username into array of usersLiked 
                    // Save sauce data
                    sauce.save((err) => { 
                    // Check if error was found
                      if (err) { 
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else
                      {   
                          res.json({ success: true, message: 'Sauce liked!' }); // Return success message
                        }
                      console.log("étape finale");
                    });  
                }   else
                {
                  if (like == -1) {
                    sauce.dislikes++; // Incriment likes
                    sauce.usersDisliked.push(user.id); // Add liker's username into array of usersDisliked
                    // Save sauce  data
                    sauce.save((err) => { 
                    // Check if error was found
                      if (err) {  
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else
                      {  
                          res.json({ success: true, message: 'Sauce liked!' }); // Return success message
                      }
                    });
                  } else
                  { 
                    if( like == 0);{
                      if (sauce.usersLiked.includes(user.id)){
                          sauce.likes--; // Decrease likes by one
                          const arrayIndex = sauce.usersLiked.indexOf(user.id); // Check where username is inside of the array                               
                          sauce.usersLiked.splice(arrayIndex, 1); // Remove username from index
                          
                      } else
                      {
                          if (sauce.usersDisliked.includes(user.id)) {
                            sauce.dislikes--; // Reduce the total number of dislikes
                            const arrayIndex = sauce.usersDisliked.indexOf(user.id); // Get the index of the username in the array for removal
                            sauce.usersDisliked.splice(arrayIndex, 1); // Remove user from array
                          }
                      }
                      // Save sauce  data
                      sauce.save((err) => {
                      // Check if error was found
                        if (err) { 
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else
                        {   res.json({ success: true, message: 'Sauce liked!' }); // Return success message
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
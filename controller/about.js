const About = require("../models/about");
const Notification = require("../models/notifications");
const User = require("../models/user");

exports.createAboutText = (req,res,next) => {
    const post = new About({
      text : req.body.text,
      creator: req.userData.userId
    });

    User.find().select('_id')
    .then(documents => {

    const notification = new Notification({
      text : 'created a new text in About Section',
      section : "About",
      watched : documents,
      creator : req.userData.username
    });
    post.save().then(result => {
  
      // save notification
      notification.save().then(notResult => {
     
        res.status(201).json({
          message: 'Post added Successfully',
          about: {
            ...result,
            id: result._id
          },
          notification: {
            ...notResult,
            id: notResult._id
          }
        });

      });
    })
    .catch(err =>{
      res.status(500).json({
        message : "Creating About Text Failed!"
      });
    });

    });
  }
  exports.getAllAboutText = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = About.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return About.count();
      }).then(count =>{
        res.status(200).json({
          message: 'About Texts fetched Succesfully!',
          abouts: fetchedPosts,
          maxPosts: count
        });
      });
  
  }
  exports.getOneAboutText = (req, res, next) => {
    About.findById(req.params.id).then(post =>{
     if(post){
        res.status(200).json(post);
     } else {
       res.status(404).json({message: 'About Text not found!'});
     }
  
    });
  }

  exports.updateAboutText = (req, res, next) => {

    const post = new About({
      _id: req.body.id,
      text : req.body.text,
      creator: req.body.userId
    });
    User.find().select('_id')
    .then(documents => {

      const notification = new Notification({
        text : 'updated a text in About Section',
        section : "About",
        watched : documents,
        creator : req.userData.username
      });

      About.updateOne({ _id: req.params.id },  post).then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "Update Successful !",
              notification: {
                ...notResult,
                id: notResult._id
              }
            });
          });
        }else {
          res.status(401).json({  message : "Not Authorized!"});
        }
      }).catch(error => {
        res.status(500).json({
          message : "Update About Failed!"
        });
      });
    });
  }

  exports.deleteAboutText = (req, res, next) => {
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'deleted a text in About Section',
        section : "About",
        watched : documents,
        creator : req.userData.username
      });

      About.deleteOne().then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "About Text Deleted !",
              notification: {
                ...notResult,
                id: notResult._id
              }
            });
          });
        }else {
          res.status(401).json({  message : "Not Authorized!"});
        }
      }).catch(error => {
        res.status(500).json({
          message : "Deleting About Text Failed!"
        });
      });
  });
  }
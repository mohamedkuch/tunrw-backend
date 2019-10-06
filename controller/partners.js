const Partner = require("../models/partners");
const Notification = require("../models/notifications");
const User = require("../models/user");


exports.createPartner = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Partner({
      title : req.body.title,
      imagePath: url + "/images/" + req.files[0].filename,
      creator: req.userData.userId
    });

    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'created a new Partner',
        section : "Partner",
        watched : documents,
        creator : req.userData.username
      });

      post.save().then(result => {
    
        notification.save().then(notResult => {
          res.status(201).json({
            message: 'Partner added Successfully',
            partner: {
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
          message : "Creating Partner Failed!"
        });
      });
    });
  }
  exports.getAllPartners = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Partner.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return Partner.count();
      }).then(count =>{
        res.status(200).json({
          message: 'Partners fetched Succesfully!',
          partners: fetchedPosts,
          maxPosts: count
        });
      });
  
  }
  exports.getOnePartner = (req, res, next) => {
    Partner.findById(req.params.id).then(post =>{
     if(post){
        res.status(200).json(post);
     } else {
       res.status(404).json({message: 'Partner not found!'});
     }
  
    });
  }

  exports.updatePartner = (req, res, next) => {
    let imageURL = req.body.imagePath;
    if(req.files){
      const url = req.protocol + '://' + req.get("host");
      imageURL = url + "/images/" + req.files[0].filename;
    }
    
    const post = new Partner({
      _id: req.body.id,
      title : req.body.title,
      imagePath : imageURL,
      creator: req.body.userId
    });
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'updated an existing Partner',
        section : "Partner",
        watched : documents,
        creator : req.userData.username
      });
      Partner.updateOne({ _id: req.params.id }, post).then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "partner updated Successful !",
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
          message : "Update Partner Failed!"
        });
      });
    });
  }

  exports.deletePartner = (req, res, next) => {
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'deleted an existing Partner',
        section : "Partner",
        watched : documents,
        creator : req.userData.username
      });

      Partner.deleteOne().then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "Partner Deleted !",
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
          message : "Deleting Partner Failed!"
        });
      });
    });
  }
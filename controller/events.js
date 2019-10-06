const Event = require("../models/events");
const Notification = require("../models/notifications");
const User = require("../models/user");

exports.createEvent = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    var imagesArray = new Array();

    var imagesArray = []; 
 
    
    var output = req.files.filter(function(value, index, arr){
      let imageFullPath = url + "/images/" + value["filename"] ; 
      imagesArray.push(imageFullPath); // add at the end 
    });

    User.find().select('_id')
    .then(documents => {

      const notification = new Notification({
        text : 'created a new Event',
        section : "Event",
        watched : documents,
        creator : req.userData.username
      });
      const post = new Event({
        title : req.body.title,
        date : req.body.date,
        adress : req.body.adress,
        description : req.body.description,
        imagePath: imagesArray,
        creator: req.userData.userId
      });
      post.save().then(result => {
        // save notification
        notification.save().then(notResult => {
          res.status(201).json({
            message: 'Post added Successfully',
            event: {
              ...result,
              id: result._id
            },
            notification: {
              ...notResult,
              id: notResult._id
            }
          });

        });

      });

    })
    .catch(err =>{
      res.status(500).json({
        message : "Creating Event Failed!"
      });
    });


  }
  exports.getAllEvents = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Event.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return Event.count();
      }).then(count =>{
        res.status(200).json({
          message: 'Events fetched Succesfully!',
          events: fetchedPosts,
          maxPosts: count
        });
      });
  
  }
  exports.getOneEvent = (req, res, next) => {
    Event.findById(req.params.id).then(post =>{
     if(post){
        res.status(200).json(post);
     } else {
       res.status(404).json({message: 'Event not found!'});
     }
  
    });
  }

  exports.updateEvent = (req, res, next) => {

    let imageURL = req.body.imagePath;

    if(req.files){
      var imagesArray = new Array();
      var imagesArray = []; 
      const url = req.protocol + '://' + req.get("host");
      
      var output = req.files.filter(function(value, index, arr){
        let imageFullPath = url + "/images/" + value["filename"] ; 
        imagesArray.push(imageFullPath); // add at the end 
      });
      imageURL = imagesArray;
    }
  

    const post = new Event({
      _id: req.body.id,
      title : req.body.title,
      date : req.body.date,
      adress : req.body.adress,
      description : req.body.description,
      imagePath : imageURL,
      creator: req.body.userId
    });

    User.find().select('_id')
    .then(documents => {
   
   
    const notification = new Notification({
      text : 'updated an Event',
      section : "Event",
      watched : documents,
      creator : req.userData.username
    });

    Event.updateOne({ _id: req.params.id },  post).then(result =>{
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
        message : "Update Event Failed!"
      });
    });

    });
  }

  exports.deleteEvent = (req, res, next) => {

   

    User.find().select('_id')
    .then(documents => {

      const notification = new Notification({
        text : 'deleted an Event',
        section : "Event",
        watched : documents,
        creator : req.userData.username
      });

    Event.deleteOne().then(result =>{
      if(result.n > 0){
        notification.save().then(notResult => {
          res.status(200).json({ 
            message: "Event Deleted !",
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
        message : "Deleting Event Failed!"
      });
    });
  });
  
  }
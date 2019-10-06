const Project = require("../models/projects");
const Notification = require("../models/notifications");
const User = require("../models/user");

exports.createProject = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Project({
      title : req.body.title,
      date : req.body.date,
      adress : req.body.adress,
      description : req.body.description,
      imagePath: url + "/images/" + req.files[0].filename,
      creator: req.userData.userId
    });
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'created a new Project',
        section : "Project",
        watched : documents,
        creator : req.userData.username
      });

      post.save().then(result => {
        notification.save().then(notResult => {
          res.status(201).json({
            message: 'Project added Successfully',
            project: {
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
          message : "Creating Project Failed!"
        });
      });
    });
  }
  exports.getAllProjects = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Project.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return Project.count();
      }).then(count =>{
        res.status(200).json({
          message: 'Projects fetched Succesfully!',
          projects: fetchedPosts,
          maxPosts: count
        });
      });
  
  }
  exports.getOneProject = (req, res, next) => {
    Project.findById(req.params.id).then(post =>{
     if(post){
        res.status(200).json(post);
     } else {
       res.status(404).json({message: 'Project not found!'});
     }
  
    });
  }

  exports.updateProject = (req, res, next) => {
    let imageURL = req.body.imagePath;
    if(req.file){
      const url = req.protocol + '://' + req.get("host");
      imageURL = url + "/images/" + req.file.filename;
    }
    const post = new Project({
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
        text : 'updated an existing Project',
        section : "Project",
        watched : documents,
        creator : req.userData.username
      });
      Project.updateOne( { _id: req.params.id }, post).then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "project updated Successful !",
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
          message : "Update Project Failed!"
        });
      });

    });
  }

  exports.deleteProject = (req, res, next) => {

    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'deleted an existing Project',
        section : "Project",
        watched : documents,
        creator : req.userData.username
      });
      Project.deleteOne().then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "Project deleted Successful !",
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
          message : "Deleting Project Failed!"
        });
      });
    });
  }
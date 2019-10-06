const Notification = require("../models/notifications");

exports.getNotWatchedNotifications = (req, res, next) => {
  const postQuery = Notification.find().sort({_id: -1});
  let notWatchedPost = 0;
  postQuery.find().then(documents => {
      // notWatched Notification
        for(let i=0; i < documents.length; i++){
          let watchedArray = documents[i].watched;
          for(let j=0; j < watchedArray.length; j++){
            if(req.userData.userId == watchedArray[j]._id){
              notWatchedPost++;
              break;
            }
          }
        }
      }).then(data =>{
      res.status(200).json({
        message: 'Not Watched notifications fetched Succesfully!',
        notWatchedPost: notWatchedPost,
      });
  });
}

  exports.getAllNotifications= (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Notification.find().sort({_id: -1});
    let fetchedPosts;
   
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents;
          return Notification.count();
      }).then(data =>{
        res.status(200).json({
          message: 'Notifications fetched Succesfully!',
          notifications: fetchedPosts,
          maxPosts: data,
        });
      });
  
  }
  exports.deleteNotifications = (req, res, next) => {

    Notification.deleteMany().then(result =>{
        if(result.n > 0){
          res.status(200).json({ message: "Notifications Deleted !"});
        }else {
          res.status(401).json({  message : "Not Authorized!"});
        }
      }).catch(error => {
        res.status(500).json({
          message : "Deleting Notifications Failed!"
        });
      });
    
  }
  exports.updateNotification = (req, res, next) => {

    Notification.findById(req.params.id).then(post =>{
        if(post){
            let watchedArray = post.watched;
            for(let j=0; j < watchedArray.length; j++){
              if(req.userData.userId == watchedArray[j]._id){
                post.watched.splice(j,1);
                break;
              }
            }
            Notification.updateOne({ _id: req.params.id },  post).then(result =>{
                if(result.n > 0){
                  res.status(200).json({ message: "Update Successful !"});
                }else {
                  res.status(401).json({  message : "Not Authorized!"});
                }
               }).catch(error => {
                res.status(500).json({
                  message : "Update Notification Failed!"
                });
              });

        } else {

          res.status(404).json({message: 'Notification not found!'});
        }
     
       });


    

  }
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.loginUser = (req, res, next) =>{
    let fetchedUser;
    User.findOne({username: req.body.username })
      .then(user =>{
        if(!user) {
          return res.status(401).json({
            message: 'Login failed'
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }).then ( result => {
        if(!result){
          return res.status(401).json({
            message: 'Login failed'
          });
        }
        const token = jwt.sign({username: fetchedUser.username, userId: fetchedUser._id},
           process.env.JWT_KEY,
           {expiresIn: '1h' }
           );
        return res.status(200).json({
          token: token,
          expiresIn: 3600,
          id: fetchedUser._id,
          username: fetchedUser.username,
          name: fetchedUser.name
        });
  
      }).catch (err => {
        return res.status(401).json({
          message: 'Login failed '
        });
      })
  
}

exports.createUser = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
      .then(hash =>{
        const user = new User({
          username: req.body.username,
          name: req.body.name,
          password: hash
        });
        user.save()
          .then(result =>{
            res.status(201).json({
              message: 'User Created!',
              result: result
            });
          })
          .catch(err =>{
            res.status(500).json({
              message: 'Create User failed, Username is taken !'
            });
          });   
        });
}

exports.getAllMembers = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = User.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return User.count();
      }).then(count =>{
        res.status(200).json({
          message: 'Members fetched Succesfully!',
          users: fetchedPosts,
          maxPosts: count
        });
      });
}
exports.getOneMember = (req, res, next) => {
    User.findById(req.params.id).then(userData =>{
     if(userData){
        res.status(200).json(userData);
     } else {
       res.status(404).json({message: 'Member not found!'});
     }
    });
  }
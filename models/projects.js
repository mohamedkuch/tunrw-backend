const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
        title:  {type : String, required: true},
         date:  {type : String, required: true},
       adress:  {type : String, required: true},
  description:  {type : String, required: true},
    imagePath:  {type : String, required: true},
      creator:  {type : mongoose.Schema.Types.ObjectId, ref: "User" ,required: true}
});


module.exports = mongoose.model('Project', projectSchema);

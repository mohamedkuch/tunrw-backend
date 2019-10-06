const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
         icon:  {type : String, required: true},
        title:  {type : String, required: true},
  description:  {type : String, required: true},
      creator:  {type : mongoose.Schema.Types.ObjectId, ref: "User" ,required: true}
});


module.exports = mongoose.model('Service', serviceSchema);

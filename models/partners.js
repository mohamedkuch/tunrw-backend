const mongoose = require('mongoose');

const partnersSchema = mongoose.Schema({
        title:  {type : String, required: true},
    imagePath:  {type : String, required: true},
      creator:  {type : mongoose.Schema.Types.ObjectId, ref: "User" ,required: true}
});


module.exports = mongoose.model('Partner', partnersSchema);

const mongoose = require('mongoose');


const aboutSchema = mongoose.Schema({
        text:  {type : String, required: true},
        creator:  {type : mongoose.Schema.Types.ObjectId, ref: "User" ,required: true}
});


module.exports = mongoose.model('About', aboutSchema);

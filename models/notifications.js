const mongoose = require('mongoose');


const notificationSchema = mongoose.Schema({
         text: {type : String},
      watched: {type: Array},
      creator: {type : mongoose.Schema.Types.String, ref: "User" },
      section: {type : String}
});


module.exports = mongoose.model('Notification', notificationSchema);

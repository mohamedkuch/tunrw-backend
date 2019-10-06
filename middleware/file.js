
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
  }
  const storage = multer.diskStorage({
    destination: (req , file , cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime Type");
      if (isValid){
        error = null;
      }
      cb(null, __dirname.slice(0, -10) + "images");
    },
    filename: (req , file , cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' +  new Date().toISOString() + '.' + ext);
    }
  });
  
  module.exports = multer({storage : storage}).array('image');
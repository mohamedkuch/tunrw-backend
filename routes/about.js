const express = require("express");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const aboutController = require("../controller/about");
const router = express.Router();

router.post("", checkAuth,extractFile, aboutController.createAboutText);

router.get('', aboutController.getAllAboutText);

router.get('/:id',  aboutController.getOneAboutText);

router.put('/:id', checkAuth, extractFile, aboutController.updateAboutText);

router.delete('/:id',checkAuth, aboutController.deleteAboutText);

module.exports = router;



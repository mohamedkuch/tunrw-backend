const express = require("express");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const projectController = require("../controller/projects");
const router = express.Router();

router.post("", checkAuth, extractFile,projectController.createProject);

router.get('', projectController.getAllProjects);

router.get('/:id', projectController.getOneProject);

router.put('/:id', checkAuth ,extractFile, projectController.updateProject);

router.delete('/:id',  checkAuth, projectController.deleteProject);

module.exports = router;

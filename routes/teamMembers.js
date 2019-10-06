const express = require("express");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const teamMemberController = require("../controller/teamMembers");
const router = express.Router();

router.post("", checkAuth,extractFile, teamMemberController.createTeamMember);

router.get('', teamMemberController.getAllTeamMembers);

router.get('/:id',  teamMemberController.getOneTeamMember);

router.put('/:id', checkAuth, extractFile, teamMemberController.updateTeamMember);

router.delete('/:id',checkAuth, teamMemberController.deleteTeamMember);

module.exports = router;



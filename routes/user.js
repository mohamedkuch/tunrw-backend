const express = require("express");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const userController = require("../controller/user");

router.post("/signup", checkAuth,userController.createUser );
router.post("/login", userController.loginUser);

router.get('', userController.getAllMembers);
router.get('/:id', userController.getOneMember);

module.exports = router;

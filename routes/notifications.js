const express = require("express");
const checkAuth = require('../middleware/check-auth');
const notificationController = require("../controller/notifications");
const router = express.Router();


router.get('', notificationController.getAllNotifications);
router.get('/notWatched',checkAuth, notificationController.getNotWatchedNotifications);
router.delete('', notificationController.deleteNotifications);
router.put('/:id', checkAuth, notificationController.updateNotification);

module.exports = router;

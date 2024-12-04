const express = require('express');
const openchatController = require('../controllers/openchatController');
const router = express.Router();

router.get('/openchat', openchatController.getIndex); // 채팅방 입장 페이지
router.post('/openchat',openchatController.handlePostRoom)
router.post('/openchat/room', openchatController.getChat); // 실제 채팅방 페이지
router.get('/openchat/room', openchatController.getChat);

module.exports = router;
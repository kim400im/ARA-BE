const express = require('express');
const openchatController = require('../controllers/openchatController');
const checkLogin = require('../middlewares/auth');
const router = express.Router();

router.get('/openchat', checkLogin, openchatController.getIndex); // 채팅방 입장 페이지
router.post('/openchat', checkLogin,openchatController.handlePostRoom)
router.post('/openchat/room',checkLogin, openchatController.getChat); // 실제 채팅방 페이지
router.get('/openchat/room', checkLogin, openchatController.getChat);

module.exports = router;

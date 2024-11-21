const express =require("express")
const router = express.Router()
const adminLayout2 = "../views/layouts/login-nologout"
const asyncHandler = require("async-handler");


router.get('/chat', (req, res)=>{
    const locals = {
        title: "관리자 페이지"
    };

    res.render('chat/chat', {locals,layout:adminLayout2})
})

module.exports = router;
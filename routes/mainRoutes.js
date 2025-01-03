const express = require("express")
const router = express.Router()
const mainLayout = "../views/layouts/main"
const asynchandler = require("express-async-handler")

// main에서 route를 설정한다.
// /, /home이면 메인 화면인 main.ejs를 기본 레이아웃
// 그리고 그 안에는 home.ejs를 안에 넣는다

router.get(["/", "/home"], asynchandler(async (req, res)=>{
    const token = req.cookies.token;
    const isLoggedIn = token ? true : false; // 쿠키에 토큰이 있으면 로그인 상태
    const locals = {
        title: "home",
        isLoggedIn: isLoggedIn, // 로그인 상태를 템플릿에 전달
    };

    // home.ejs를 mainLayout 안에 넣는다.
    res.render("home", {locals, layout: mainLayout});
}))

router.get("/about", (req, res) => {
    const token = req.cookies.token;
    const isLoggedIn = token ? true : false; // 쿠키에 토큰이 있으면 로그인 상태
    const locals = { title: "About", isLoggedIn: isLoggedIn };
    res.render("about", { locals, layout: mainLayout });
});

module.exports = router;
const express =require("express")
const router = express.Router()
const adminLayout = "../views/layouts/login"
const adminLayout2 = "../views/layouts/login-nologout"
const User = require("../models/User");
const asyncHandler = require("express-async-handler")
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET


router.get("/login", (req, res)=> {
    const locals = {
        title: "관리자 페이지"
    };

    res.render("login/login", {locals,layout:adminLayout2})
})

router.post("/login", asyncHandler(async (req, res)=>{
    const {username, password} = req.body;

    const user = await User.findOne({username});

    if (!user){
        return res.status(401).json({message: "일치하는 사용자가 없다"})
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword){
        return res.status(401).json({message: "비밀번호가 일치하지 않는다"})
    }
    const token = jwt.sign({id:user._id}, jwtSecret);

    res.cookie("token", token, {httpOnly: true});

    // res.send("success");
    res.redirect("/home");
}))

// 로그아웃 라우트
router.get("/logout", (req, res) => {
    // 쿠키 삭제
    res.clearCookie("token");
    res.redirect("/home");
});

router.get("/register", asyncHandler(async (req, res)=>{
    res.render("login/register",{layout:adminLayout2})
}))

router.post("/register", asyncHandler(async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
    });
    res.json(`user created ${user}`)
}))



module.exports = router
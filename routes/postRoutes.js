const asyncHandler = require("express-async-handler")
const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const checkLogin = require("../middlewares/auth")
const adminLayout = "../views/layouts/login-logout"

router.get("/allPosts", checkLogin, asyncHandler(async (req, res)=>{
    const locals = {
        "title" : "Posts",
    };
    const data = await Post.find().sort({updateAt: "desc", createdAt: "desc"});
    res.render("posts/allPosts", {
        locals, data, layout: adminLayout
    })
    // res.send("log")
}))

router.get("/logout", (req, res)=> {
    res.clearCookie("token");
    res.redirect("/");
})

router.get('/add',checkLogin, asyncHandler(async (req, res)=>{
    const locals = {
        title: "게시물 생성",
    };
    res.render("posts/add", {
        locals, layout: adminLayout,
    })
}))

router.post("/add", checkLogin, asyncHandler(async (req, res)=> {
    const {title, body} = req.body

    const newPost = new Post({
        title: title,
        body: body,
    });

    await Post.create(newPost);

    res.redirect("/allPosts")
}))

router.get("/edit/:id", checkLogin, asyncHandler(async (req, res)=>{
    const locals = {
        title: "게시물 편집",
    };

    const data = await Post.findOne({_id: req.params.id})
    res.render("posts/edit", {
        locals, data, layout: adminLayout
    })
}))

router.post("/edit/:id", checkLogin, asyncHandler(async (req, res)=> {
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        createdAt: Date.now(),
    });

    res.redirect("/allPosts")
}))

router.delete("/delete/:id", checkLogin, asyncHandler(async (req, res)=> {
    await Post.findByIdAndDelete({_id: req.params.id});
    res.redirect("/allPosts")
}))


module.exports = router
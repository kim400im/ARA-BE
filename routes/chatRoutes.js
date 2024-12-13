const express =require("express")
const router = express.Router()
const adminLayout2 = "../views/layouts/login-nologout"
const mainLayout = "../views/layouts/main"
const loginLayout = "../views/layouts/login-logout"
const asyncHandler = require("async-handler");
const checkLogin = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data"); // form-data 패키지 가져오기


router.get('/chat-lobby', checkLogin, (req, res)=>{
    const locals = {
        title: "채팅방 로비"
    };
    res.render('chat/chat-lobby', {locals, layout: loginLayout})
})


router.get('/chat', checkLogin, (req, res)=>{
    const locals = {
        title: "관리자 페이지"
    };

    res.render('chat/chat', {locals,layout: loginLayout})
})

router.get('/normal_chat', checkLogin, (req, res)=>{
    const locals = {
        title: "관리자 페이지"
    };

    res.render('chat/normal_chat', {locals,layout: loginLayout})
})

const storage = multer.memoryStorage()

    const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".pdf") {
        return cb(new Error("Only PDFs are allowed"), false);
        }
        cb(null, true);
    },
    });

    router.post("/upload", upload.single("pdfFile"), async (req, res) => {
        try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
    
        const filePath = req.file.path; // Multer로 저장된 파일 경로
    
        // FastAPI로 파일 전송
        const form = new FormData();
        // form.append("file", fs.createReadStream(filePath)); // 파일 읽기
        form.append("file", req.file.buffer, {
            filename: req.file.originalname, // 파일 이름 설정
            contentType: req.file.mimetype, // 파일의 MIME 타입 설정
        });

    
        const response = await axios.post("http://localhost:8000/upload/", form, {
            headers: {
            ...form.getHeaders(),
            },
        });
    
        // 성공 응답
        res.send({
            message: "File uploaded successfully",
            fastapiResponse: response.data,
        });
    
        // 임시 파일 삭제
        // fs.unlinkSync(filePath);
        } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).send("Failed to upload file");
        }
    });

module.exports = router;
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const dbConnect = require("./config/dbConnect");
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const methodOverride = require("method-override")

// 필요 기능 로그인 회원가입 게시판
// 홈 화면에 home.ejs가 들어가고 
// 홈 화면 상단에 앱 바로 게시판, 로그인 버튼
// 로그인 페이지에는 회원가입하기 버튼 존재함
// 회원가입하면 login으로 넘어간다.

// 게시판은 로그인 해야지 볼 수 있음.
// 게시판 눌렀는데 토큰이 없으면 로그인으로 넘어간다.

// 만드는 순서
// 1. config 아래에 dbConnect와 model에서 db 객체 넣기
// 2. view안에 있는 것들 선언 express-ejs-layouts 설치
// 2-1. 이외에도 ejs 설치하고 app.set으로 view engine 선택
// 3. public 폴더에 정적 요소를 넣고 실행
// 4. mainRoute 홈에 관련된 루트 정리. 홈 화면 가는 루트
// 5. authRoutes.js에서 로그인과 회원 가입을 처리함

dbConnect()

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("./public"))

app.use(cookieParser())
app.use(methodOverride("_method"));

app.use("/", require("./routes/mainRoutes"))
app.use("/", require("./routes/authRoutes"))
app.use("/", require("./routes/postRoutes"))
app.use("/", require("./routes/chatRoutes"))

const port = 4004


app.post("/ask-llm", async (req, res) => {
  const input = req.body.input;

  try {
    // ARA-LLM 서버로 요청 보내기
    const llmResponse = await axios.post("http://localhost:8000/process", {
      prompt: input,
    });

    // ARA-LLM에서 받은 응답 출력
    const llmData = llmResponse.data.response;
    res.json({ response: llmData });
  } catch (error) {
    console.error(error);
    res.status(500).send("LLM 서버 요청 중 오류 발생");
  }
});

app.get("/fastapi-hello", async (req, res) => {
    try {
      // FastAPI 서버의 루트 엔드포인트로 요청 보내기
      const response = await axios.get("http://localhost:8000/");
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("FastAPI 서버 요청 중 오류 발생");
    }
  });

app.listen(port, () => {
  console.log(`ARA-BE 서버가 ${port} 포트에서 실행 중`);
});
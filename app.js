const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const dbConnect = require("./config/dbConnect");
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const methodOverride = require("method-override")
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const server = http.createServer(app);
const { addUser, getUsersInRoom, removeUser, getUser } = require('./utils/users');
const { generateMessage } = require('./utils/messages');
const io = new Server(server); // WebSocket 서버 생성

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
// app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser())
app.use(methodOverride("_method"));



app.use("/", require("./routes/mainRoutes"))
app.use("/", require("./routes/authRoutes"))
app.use("/", require("./routes/postRoutes"))
app.use("/", require("./routes/chatRoutes"))
app.use("/", require("./routes/openchatRoutes"))

const port = 4004


io.on('connection', (socket) => {
  console.log('socket', socket.id);

  // options는 클라가 보낸 데이터다.
  socket.on('join', (options, callback) => {
      const {error, user} = addUser({id: socket.id, ...options}) // 이걸 options를 받아서 addUser에 보낸다.

      if (error) {
          // callback이 chat.js에 있는 emit 함수
          return callback(error);
      }

      socket.join(user.room)
      // socket이 방 안에 들어간다.  user.room 안으로 추가되는 소켓

      socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다`));
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username}가 방에 참여했습니다`))

      // user room에 있는 모든 사람에게 보내준다.
      // room 이름과 users 목록을 전달한다. 모든 사용자에게 
      // io 니까 서버 기준으로 함. socket이면 현재 소켓을 기준으로 함
      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
      })
  });
  socket.on('sendMessage', (message, callback) => {

      const user = getUser(socket.id);
      
      io.to(user.room).emit('message', generateMessage(user.username, message));
      callback();
  });
  socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id)
      const user = removeUser(socket.id);

      if (user) {
          io.to(user.room).emit('message', generateMessage('Admin', `${user.username}가 방을 나갔습니다.`));
          io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
          })
      }
  });
  
})




app.post("/ask-llm", async (req, res) => {
  const input = req.body.input;

  try {
    // ARA-LLM 서버로 요청 보내기
    const llmResponse = await axios.post("http://localhost:8000/process", {
      question: input,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
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

server.listen(port, () => {
  console.log(`ARA-BE 서버가 ${port} 포트에서 실행 중`);
});
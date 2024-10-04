const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    console.log("server in main page")
    res.send("hello node")
})

app.post("/ask-llm", async (req, res) => {
  const input = req.body.input;

  try {
    // ARA-LLM 서버로 요청 보내기
    const llmResponse = await axios.post("http://localhost:5000/process", {
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

app.listen(4040, () => {
  console.log("ARA-BE 서버가 4040 포트에서 실행 중");
});

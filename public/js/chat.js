document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.querySelector("#message-form");
    const messageInput = document.querySelector("input[name='message']");
    const messageButton = messageForm.querySelector("button");
    const messagesContainer = document.querySelector("#messages");
  
    // 메시지를 렌더링하는 함수
    const renderMessage = (username, message, time) => {
      const template = document.querySelector("#message-template").innerHTML;
      const html = Mustache.render(template, {
        username,
        message,
        createdAt: moment(time).format("h:mm a"),
      });
      messagesContainer.insertAdjacentHTML("beforeend", html);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
  
    // 메시지 전송
    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userMessage = messageInput.value.trim();
  
      if (!userMessage) return;
  
      // 전송 버튼 비활성화
      messageButton.setAttribute("disabled", "true");
  
      // 사용자 메시지 출력
      renderMessage("You", userMessage, Date.now());
  
      try {
        // 서버에 메시지 요청
        const response = await fetch("/ask-llm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: userMessage }),
        });
        const data = await response.json();
  
        // GPT 응답 출력
        renderMessage("GPT", data.response, Date.now());
      } catch (error) {
        console.error("Error:", error);
        renderMessage("System", "오류가 발생했습니다. 다시 시도해주세요.", Date.now());
      } finally {
        // 입력 필드와 버튼 초기화
        messageInput.value = "";
        messageButton.removeAttribute("disabled");
      }
    });
  });
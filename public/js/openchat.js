// const socket = io(); // WebSocket 연결

// // URL 쿼리에서 username과 room을 추출
// const query = new URLSearchParams(location.search);
// const username = query.get('username');
// const room = query.get('room');

// // 메시지 입력 폼과 메시지 표시 영역
// const messages = document.querySelector('#messages');
// const messageForm = document.querySelector('#message-form');
// const messageFormInput = messageForm.querySelector('input');
// const messageFormButton = messageForm.querySelector('button');

// // 템플릿들 (Mustache.js를 사용하여 템플릿 렌더링)
// const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
// const messageTemplate = document.querySelector('#message-template').innerHTML;

// // **채팅방 입장**
// socket.emit('join', { username, room }, (error) => {
//   if (error) {
//     alert(error);
//     location.href = '/chat'; // 에러 발생 시 채팅방 입장 화면으로 리다이렉트
//   }
// });

// // **방 정보 업데이트**
// socket.on('roomData', ({ room, users }) => {
//   const html = Mustache.render(sidebarTemplate, { room, users });
//   document.querySelector('#sidebar').innerHTML = html;
// });

// // **메시지 수신**
// socket.on('message', (message) => {
//   const html = Mustache.render(messageTemplate, {
//     username: message.username,
//     message: message.text,
//     createdAt: moment(message.createdAt).format('h:mm a'), // 메시지 시간 포맷
//   });

//   messages.insertAdjacentHTML('beforeend', html);
//   scrollToBottom(); // 새 메시지 수신 시 스크롤 자동 이동
// });

// // **메시지 전송 이벤트**
// messageForm.addEventListener('submit', (e) => {
//   e.preventDefault(); // 페이지 새로고침 방지

//   // 메시지 입력 후 버튼 비활성화
//   messageFormButton.setAttribute('disabled', 'disabled');

//   const message = e.target.elements.message.value; // 입력된 메시지

//   // 메시지를 서버로 전송
//   socket.emit('sendMessage', message, (error) => {
//     // 메시지 전송 후 버튼 활성화 및 입력 필드 초기화
//     messageFormButton.removeAttribute('disabled');
//     messageFormInput.value = '';
//     messageFormInput.focus();

//     if (error) {
//       return console.log(error);
//     }

//     console.log('메시지 전송 완료!');
//   });
// });

// // **스크롤 자동 이동**
// function scrollToBottom() {
//   messages.scrollTop = messages.scrollHeight;
// }
const socket = io();

console.log(socket);

const query = new URLSearchParams(location.search);

const username = query.get('username');

const room = query.get('room'); 
//  주소에서 추출한다.


// emit으로 보내고 on으로 받는다.
// {username, room}, (error) 가 index.js의 socket.on 안으로 들어간다. 
socket.emit('join',{username, room}, (error) => {
    if (error){
        alert(error);
        location.href='/'; 
    }
});

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// index.js에 io.to를 보면 된다. 거기서 정보가 날아온다.
socket.on('roomData', ({room, users}) => {
    // mustache를 이용해서 html을 생성
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html;
})

const messages = document.querySelector('#messages');

const messageTemplate = document.querySelector('#message-template').innerHTML
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
})

function scrollToBottom(){
    messages.scrollTop = messages.scrollHeight;
}

const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');

// event가 발생했을 떄 event를 가져오고
messageForm.addEventListener('submit', (e) => {
  // 페이지가 refresh 되지 않도록 한다. 
  e.preventDefault();
  console.log("error in submit")

  // 메시지를 보낸 후 전송 버튼을 다시 못 누르도록 diable 시킴
  messageFormButton.setAttribute('disabled', 'disabled')


  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) =>{
    console.log("message to server")
      messageFormButton.removeAttribute('disabled'); // 다시 누를 수 있게 설정
      messageFormInput.value = '';
      messageFormInput.focus();

      if(error) {
        return console.log(error);
      }
  })
})
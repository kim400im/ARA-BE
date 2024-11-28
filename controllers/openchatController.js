const mainLayout = "../views/layouts/main"

exports.getIndex = (req, res) => {
    const locals = {
        title: "관리자 페이지"
    };

    res.render('openchat/openchat', {locals, layout:mainLayout}); // 유저 입력 페이지
};

exports.getChat = (req, res) => {
    const { username, room } = req.query;
    console.log(username);
    console.log(room);
    if (!username || !room) {
        console.log("redirected");
        return res.redirect('/chat'); // 잘못된 접근 방지
    }
    res.render('openchat/room', { username, room, layout: mainLayout }); // 채팅방
};

exports.handlePostRoom = (req, res) => {
    const { username, room } = req.body; // POST 요청은 req.body에서 데이터 가져옴


    const locals = {
        title: "관리자 페이지"
    };

    console.log("handle error")
    console.log(username)
    console.log(room)
    if (!username || !room) {
        return res.redirect('/openchat'); // 유효하지 않은 데이터 처리
    }
    res.redirect(`/openchat/room?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`);
    // res.render('openchat/room', { locals, layout:mainLayout, username, room }); // 채팅방 페이지 렌더링
};

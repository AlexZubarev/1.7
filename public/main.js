$(function () {
    let socket = io();
    let connected = false;
    $('#send-msg').submit(function(e){
        socket.emit('new message', $('#m').val());
        $('#messages').append($('<li>').addClass('msg-cur').text($('#m').val()));
        $('#m').val('');
        return false;
    });
    $('#login').submit(function(e){
        socket.emit('add user', $('#username').val());
        $(".login-page").fadeOut();
        return false;
    });
    socket.on('new message', function(data){
        $('#messages').append($('<li>').addClass('msg').text(data.msg).append($('<div>').text(data.username)));
    });
    socket.on('login', function (data) {
        connected = true;
        let msg = "Hi";
        $('#messages').append($('<li>').addClass('login').text(msg));
    });
    socket.on('user joined', function(data) {
        let msg = "Connected " + data.username;
        $('#messages').append($('<li>').addClass('login').text(msg));
    });
    socket.on('user left', function(data) {
        let msg = "Leave" + data.username;
        $('#messages').append($('<li>').addClass('login').text(msg));
    });
});
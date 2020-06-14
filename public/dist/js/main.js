const chatForm = document.getElementById('chat-form');
const socket= io();
var uid = window.localStorage.getItem("login_user_id");
var receiver = window.localStorage.getItem("receiver");
var loginuser = window.localStorage.getItem("login_user_name");

$(document).ready(function()
{
    socket.emit('user_connected', {"room_id" : uid, "user_name": loginuser});
      $("#chat-form").submit(function(e){
        e.preventDefault();
        const message = $.trim($('#msg').val());
        if(message){
            sendmessage.msg.add(message, 'outgoing-message', currentTime());
            console.log({"client":true, "message":message, "sender" : uid, "receiver": window.localStorage.getItem("receiver")});
            socket.emit("send_message", {"message":message, "user_detail":{"id":uid ,"name" :loginuser}, "sender" : uid, "receiver": window.localStorage.getItem("receiver")});
            $("#msg").val('').focus();
        }
      });
});
socket.on("message", message => {
  sendmessage.msg.add(message.message, '', message.time);
  console.log(message);
});
var sendmessage = {
        msg: {
            add: function (message, type, time) {
                var chat_body = $('.layout .content .chat .chat-body');
                if (chat_body.length > 0) {

                    type = type ? type : '';
                    message = message ? message : '';
                    time = time?time :'';

                    $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><div class="message-content">' + message + '</div><div class="message-action">'+time+' ' + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');
                    chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                        cursorcolor: 'rgba(66, 66, 66, 0.20)',
                        cursorwidth: "4px",
                        cursorborder: '0px'
                    }).resize();
                }
            }
        }
    };





function main(){
    this.selectedUser = function (elemnt) {
        const user_name = (elemnt).find('.users-list-name').text();
        const room_id = (elemnt).attr('data-roomid');
        window.localStorage.setItem("receiver", room_id);
        console.log(window.localStorage.getItem("receiver"));
        $('.selected-user').text(user_name);
        //socket.emit('user_connected', {"room_id" : room_id, "user_name": user_name});
    }
}

var mainObj = new main();
$(document).ready(function(){
    $('body').delegate('.user-item','click',function(e) {
        mainObj.selectedUser($(this));
    })
    
});

function currentTime() {
    var time = new Date();
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}
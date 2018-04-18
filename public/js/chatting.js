var socket = io.connect();
$(document).ready(function () {
    $.ajax({
        url: 'https://mamahome360.com/webapp/token',
        xhrFields: {
            withCredentials: true
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.href = "https://mamahome360.com/webapp/login";
        $('#holder').html("Not Logged In");
    })
    .done(function (result, textStatus, jqXHR) {
        $('#name').html(result.user.name);
        $('#email').html(result.user.email);
        $('#userlist').html(result.userlist);
        $('#userid').val(result.user.id);
        console.log(result.user.profilepic);
        $('#pp').attr('src','https://mamahome360.com/webapp/public/profilePic/'+result.user.profilepic);
    });
});
$(function () {
    $('form').submit(function(){
        var msg = $('#m').val(); 
        var id = $('#userid').val();
        socket.emit('chat message', {msg: msg, id: id});
      $('#m').val('');
      return false;
    });
});
socket.on('old chat message', function(msg){
      $('#messages').html(msg);
      $(document).ready(function(){
            $('#log').animate({
            scrollTop: $('#log').get(0).scrollHeight
        });
    });
});
socket.on('chat message', function(msg){
    $('#messages').append($('<p>').html(msg));
        $(document).ready(function(){
            $('#log').animate({
            scrollTop: $('#log').get(0).scrollHeight
        });
    });
});
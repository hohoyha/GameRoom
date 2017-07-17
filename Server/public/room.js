var socket = io.connect('http://localhost:3000/room'); 

  
var connected = false;
console.log('socket.io');


socket.on('connect', function(client){
    console.log('real connected');

      $('#join').click(function(){
             console.log('join');
             socket.emit('join',{name:$('#name').val()});
        });

    
      $('#leave').click(function(){
             console.log('leave');
             socket.emit('leave',{});
        });

     $('#send').click(function(){
             console.log('send');
             socket.emit('chat',{message:$('#context').val() });
        });

    socket.on('joined', function(data){
        console.log(data.message);
        $('#Room').children().hide();
        $('#leave').show();
    });

    socket.on('left', function(data){
        console.log(data.message);
         $('#Room').children().show();
         $('#leave').hide();
    });


     socket.on('joinedUser', function(data){
        console.log(data.message);
    });

    socket.on('chat', function(data){
        console.log(data.message);
        $('#list').append('<li>' + data.message + '</li>' );
    });
});


var group = require('./socket_io/group');

module.exports = function(io){

    var nio = io.of('/room');

     nio.on('connect', function(socket){
            console.log('connected');

            socket.on('disconnect', function(data){
                console.log('disconnect');
                netFun.leave();
            });

            var netFun = group(socket, nio);

            socket.on('join', function(data){ 

                socket.emit('joined', {message:'joined'});
                
                netFun.join(data.name);
                netFun.joined();
                
                console.log('join');

                netFun.roomList();
            });

            socket.on('leave', function(data){
                socket.emit('left', {message:'left'});
                netFun.leave();
            });

            socket.on('chat', function(data){
                netFun.chat(data);
            });
     });
};
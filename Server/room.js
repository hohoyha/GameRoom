

var group = require('./socket_io/group');

module.exports = function(io){

    var nio = io.of('/room');

     nio.on('connect', function(socket){
            console.log('connected');

            var netFun = group(socket, nio);

            console.log(netFun.test);

            socket.on('disconnect', function(data){
                console.log('disconnect');
                netFun.leave();
            });

            socket.on('join', function(data){ 

                socket.emit('joined', {message:'joined'});
                
                netFun.join(data.name);
            //    netFun.joined();
                
                console.log('join');

                // var roomlist =  netFun.roomList();
                // console.log(roomlist);
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